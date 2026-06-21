from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.emission import EmissionLogCreate, EmissionLogResponse, EmissionLogWithBadgesResponse, DailyEmissionRequest
from app.services.emission import create_emission_log, get_user_logs, get_weekly_logs, get_streaks, save_or_update_daily_log
from app.services.achievement import evaluate_badges

router = APIRouter()

@router.post("/", response_model=EmissionLogWithBadgesResponse, status_code=status.HTTP_201_CREATED)
def add_log(log: EmissionLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_log = create_emission_log(db=db, user_id=current_user.id, log=log)
    new_badges = evaluate_badges(db=db, user_id=current_user.id, current_log=db_log)
    return {"log": db_log, "new_badges": new_badges}

@router.get("/", response_model=List[EmissionLogResponse])
def read_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_logs(db=db, user_id=current_user.id)

@router.get("/streak")
def read_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"current_streak": current_user.streak or 0, "longest_streak": current_user.streak or 0, "score": current_user.score or 0}

@router.get("/weekly")
def read_weekly_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = get_weekly_logs(db=db, user_id=current_user.id)
    formatted_logs = []
    from datetime import datetime
    for log in logs:
        try:
            d = datetime.strptime(str(log.day), '%Y-%m-%d')
            day_name = d.strftime('%b %d')
        except Exception:
            day_name = str(log.day)
        formatted_logs.append({
            "day": day_name,
            "total": round(log.total, 2),
            "transport": round(log.transport, 2),
            "electricity": round(log.electricity, 2),
            "diet": round(log.diet, 2),
            "eco_score": round(log.eco_score, 1)
        })
    return formatted_logs

@router.post("/daily", response_model=EmissionLogWithBadgesResponse, status_code=status.HTTP_201_CREATED)
def add_or_update_daily_log(
    data: DailyEmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from datetime import date
    from sqlalchemy import func
    from app.models.emission import EmissionLog

    # Check if a log existed for today before saving
    today = date.today()
    had_log_today = db.query(EmissionLog).filter(
        EmissionLog.user_id == current_user.id,
        func.date(EmissionLog.date) == today
    ).first() is not None

    db_log = save_or_update_daily_log(
        db=db,
        user_id=current_user.id,
        car_km=data.car_km,
        bus_km=data.bus_km,
        electricity_kwh=data.electricity_kwh,
        diet_type=data.diet_type
    )
    new_badges = evaluate_badges(db=db, user_id=current_user.id, current_log=db_log)

    # Goal met if eco_score is >= 70 (high efficiency)
    goal_met = db_log.eco_score >= 70

    if goal_met and not had_log_today:
        current_user.streak = (current_user.streak or 0) + 1
        
    if not had_log_today:
        # Dynamic eco-score scaling matrix
        eco = db_log.eco_score
        if   eco >= 90: pts = 50
        elif eco >= 80: pts = 40
        elif eco >= 70: pts = 30
        elif eco >= 60: pts = 20
        elif eco >= 50: pts = 10
        else:           pts = 5

        current_user.score = (current_user.score or 0) + pts

        # Streak milestone bonuses — exact == prevents double-award on re-runs
        streak_now = current_user.streak or 0
        STREAK_MILESTONES = {3: 25, 7: 75, 14: 150, 30: 500}
        for milestone_days, bonus in STREAK_MILESTONES.items():
            if streak_now == milestone_days:
                current_user.score += bonus
                break

        db.commit()
        db.refresh(current_user)

    return {
        "log": db_log,
        "new_badges": new_badges,
        "updatedScore": current_user.score,
        "updatedStreak": current_user.streak
    }

@router.get("/progress")
def read_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = read_weekly_logs(db=db, current_user=current_user)
    return {"history": history, "streaks": {"current_streak": current_user.streak}}

@router.get("/weekly-report")
def read_weekly_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = get_weekly_logs(db=db, user_id=current_user.id)
    if not logs:
        return {
            "weekly_emissions": 0.0,
            "average_score": 0,
            "best_day": "N/A",
            "worst_day": "N/A",
            "primary_source": "N/A",
            "recommendation": "Log your emissions to get insights."
        }
    
    total_emissions = sum(log.total for log in logs)
    avg_score = sum(log.eco_score for log in logs) / len(logs)
    
    best_log = min(logs, key=lambda l: l.total)
    worst_log = max(logs, key=lambda l: l.total)
    
    from datetime import datetime
    def format_day(d):
        try:
            return datetime.strptime(str(d), '%Y-%m-%d').strftime('%A')
        except Exception:
            return str(d)
            
    best_day_str = format_day(best_log.day) if hasattr(best_log, "day") else format_day(best_log.date)
    worst_day_str = format_day(worst_log.day) if hasattr(worst_log, "day") else format_day(worst_log.date)
    
    t_tot = sum(log.transport for log in logs)
    e_tot = sum(log.electricity for log in logs)
    d_tot = sum(log.diet for log in logs)
    
    sources = {"Transportation": t_tot, "Electricity": e_tot, "Diet": d_tot}
    primary_source = max(sources, key=sources.get)
    
    if primary_source == "Transportation":
        recommendation = "Reducing car travel or carpooling could drastically improve your weekly average."
    elif primary_source == "Electricity":
        recommendation = "Consider an energy audit or reducing AC/heating usage slightly to save power."
    else:
        recommendation = "Incorporating more plant-based meals could lower your dominant dietary emissions."
        
    return {
        "weekly_emissions": round(total_emissions, 2),
        "average_score": int(avg_score),
        "best_day": best_day_str,
        "worst_day": worst_day_str,
        "primary_source": primary_source,
        "recommendation": recommendation
    }

