from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.emission import EmissionLog
from app.schemas.emission import EmissionLogCreate
from datetime import date, datetime
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from app.models.emission import EmissionLog
from app.services.coach import CoachService
from app.schemas.coach import CoachRequest

def create_emission_log(db: Session, user_id: int, log: EmissionLogCreate):
    db_log = EmissionLog(
        user_id=user_id,
        transport=log.transport,
        electricity=log.electricity,
        diet=log.diet,
        total=log.total,
        eco_score=log.eco_score
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_user_logs(db: Session, user_id: int, limit: int = 100):
    return db.query(EmissionLog).filter(EmissionLog.user_id == user_id).order_by(desc(EmissionLog.date)).limit(limit).all()

def get_weekly_logs(db: Session, user_id: int):
    from sqlalchemy import func
    # Group by date, sum the totals, return last 7 unique days
    results = db.query(
        func.date(EmissionLog.date).label('day'),
        func.sum(EmissionLog.total).label('total'),
        func.sum(EmissionLog.transport).label('transport'),
        func.sum(EmissionLog.electricity).label('electricity'),
        func.sum(EmissionLog.diet).label('diet'),
        func.avg(EmissionLog.eco_score).label('eco_score')
    ).filter(EmissionLog.user_id == user_id).group_by(func.date(EmissionLog.date)).order_by(desc('day')).limit(7).all()
    return list(reversed(results))

def get_streaks(db: Session, user_id: int):
    logs = db.query(EmissionLog.date).filter(EmissionLog.user_id == user_id).order_by(desc(EmissionLog.date)).all()
    if not logs:
        return {"current_streak": 0, "longest_streak": 0}
        
    unique_dates = sorted(list(set([log.date.date() for log in logs])), reverse=True)
    
    from datetime import date, timedelta
    today = date.today()
    
    current_streak = 0
    longest_streak = 0
    
    # Calculate current streak
    if unique_dates and (unique_dates[0] == today or unique_dates[0] == today - timedelta(days=1)):
        current_streak = 1
        for i in range(1, len(unique_dates)):
            if unique_dates[i-1] - unique_dates[i] == timedelta(days=1):
                current_streak += 1
            else:
                break
                
    # Calculate longest streak
    temp_streak = 1
    longest_streak = 1 if unique_dates else 0
    for i in range(1, len(unique_dates)):
        if unique_dates[i-1] - unique_dates[i] == timedelta(days=1):
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 1
            
    return {"current_streak": current_streak, "longest_streak": longest_streak}




def save_or_update_daily_log(
    db: Session,
    user_id: int,
    car_km: float,
    bus_km: float,
    electricity_kwh: float,
    diet_type: str
):
    """
    Creates or updates today's emission log safely.
    FIX: stable date detection + correct update vs insert behavior
    """

    # -----------------------------
    # 1. Calculate emissions
    # -----------------------------
    transport = (car_km * 0.2) + (bus_km * 0.05)
    electricity = electricity_kwh * 0.4
    diet = 1.5 if diet_type == "vegetarian" else 3.0
    total = transport + electricity + diet

    # -----------------------------
    # 2. Coach score calculation
    # -----------------------------
    coach_req = CoachRequest(
        transport=transport,
        electricity=electricity,
        diet=diet,
        total=total
    )
    coach_advice = CoachService.get_coach_advice(coach_req)
    base_eco_score = coach_advice.score

    # -----------------------------
    # Gamified Scoring Algorithm
    # -----------------------------
    import random
    
    # 1. Base Reward
    base_reward = 10
    
    # 2. Eco Performance Multiplier
    if base_eco_score >= 90:
        multiplier = 2.0
    elif base_eco_score >= 75:
        multiplier = 1.5
    elif base_eco_score >= 60:
        multiplier = 1.0
    else:
        multiplier = 0.5
        
    # 3. Streak Bonus
    streak_data = get_streaks(db, user_id)
    streak_bonus = streak_data.get("current_streak", 0) * 2
    
    # 4. Engagement Randomness
    random_bonus = random.randint(0, 5)
    
    # 5. Low Score Penalty
    penalty = 15 if base_eco_score < 40 else 0
    
    calculated_score = (base_reward * multiplier) + streak_bonus + random_bonus - penalty
    eco_score = max(0, int(calculated_score))

    # -----------------------------
    # 3. SAFE "TODAY" DETECTION (FIXED)
    #    (prevents duplicate insert bug)
    # -----------------------------
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())

    today_log = db.query(EmissionLog).filter(
        EmissionLog.user_id == user_id,
        EmissionLog.date >= today_start,
        EmissionLog.date <= today_end
    ).first()

    # -----------------------------
    # 4. UPDATE EXISTING RECORD
    # -----------------------------
    if today_log:
        today_log.transport = round(transport, 2)
        today_log.electricity = round(electricity, 2)
        today_log.diet = round(diet, 2)
        today_log.total = round(total, 2)
        today_log.eco_score = eco_score

        db.commit()
        db.refresh(today_log)
        return today_log

    # -----------------------------
    # 5. CREATE NEW RECORD
    # -----------------------------
    db_log = EmissionLog(
        user_id=user_id,
        transport=round(transport, 2),
        electricity=round(electricity, 2),
        diet=round(diet, 2),
        total=round(total, 2),
        eco_score=eco_score
    )

    try:
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
    except IntegrityError:
        db.rollback()
        # Handle the race condition by fetching the newly inserted log and updating it
        today_log = db.query(EmissionLog).filter(
            EmissionLog.user_id == user_id,
            EmissionLog.date >= today_start,
            EmissionLog.date <= today_end
        ).first()
        if today_log:
            today_log.transport = round(transport, 2)
            today_log.electricity = round(electricity, 2)
            today_log.diet = round(diet, 2)
            today_log.total = round(total, 2)
            today_log.eco_score = eco_score
            db.commit()
            db.refresh(today_log)
            return today_log
        raise

    return db_log


