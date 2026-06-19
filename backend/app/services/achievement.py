from app.services.notification import create_notification
from sqlalchemy.orm import Session
from app.models.achievement import UserBadge
from app.models.emission import EmissionLog
from app.services.emission import get_streaks

# Badge Definitions
BADGES = {
    "First Footprint": {"description": "Logged your first emission.", "icon": "🌱"},
    "3 Day Streak": {"description": "Logged emissions for 3 consecutive days.", "icon": "🔥"},
    "7 Day Streak": {"description": "Logged emissions for 7 consecutive days.", "icon": "🏆"},
    "Energy Saver": {"description": "Kept electricity emissions under 2.0 kg.", "icon": "💡"},
    "Green Traveler": {"description": "Kept transport emissions under 1.0 kg.", "icon": "🚲"},
    "Eco Champion": {"description": "Achieved an eco score of 90 or above.", "icon": "🌟"},
}

def evaluate_badges(db: Session, user_id: int, current_log: EmissionLog):
    """
    Evaluates which badges the user has earned after submitting a new log.
    Returns a list of newly unlocked badges.
    """
    newly_unlocked = []
    
    # Get user's existing badges
    existing_badges = db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
    earned_badge_names = {badge.badge_name for badge in existing_badges}
    
    # 1. First Footprint
    if "First Footprint" not in earned_badge_names:
        newly_unlocked.append("First Footprint")
        
    # 2. Streaks
    streaks = get_streaks(db, user_id)
    current_streak = streaks.get("current_streak", 0)
    
    if current_streak >= 3 and "3 Day Streak" not in earned_badge_names:
        newly_unlocked.append("3 Day Streak")
        
    if current_streak >= 7 and "7 Day Streak" not in earned_badge_names:
        newly_unlocked.append("7 Day Streak")
        
    # 3. Energy Saver
    if current_log.electricity < 2.0 and "Energy Saver" not in earned_badge_names:
        newly_unlocked.append("Energy Saver")
        
    # 4. Green Traveler
    if current_log.transport < 1.0 and "Green Traveler" not in earned_badge_names:
        newly_unlocked.append("Green Traveler")
        
    # 5. Eco Champion
    if current_log.eco_score >= 90 and "Eco Champion" not in earned_badge_names:
        newly_unlocked.append("Eco Champion")
        
    # Persist newly unlocked badges
    unlocked_objects = []
    for badge_name in newly_unlocked:
        badge_data = BADGES[badge_name]
        db_badge = UserBadge(
            user_id=user_id,
            badge_name=badge_name,
            description=badge_data["description"],
            icon=badge_data["icon"]
        )
        db.add(db_badge)
#         create_notification(
#         db=db,
#         user_id=user_id,
#         title="Badge Unlocked!",
#         message=f"You earned {badge_name} {badge_data['icon']}"
# )
        create_notification(
        db=db,
        user_id=user_id,
        title="Badge Unlocked!",
        message=f"You earned {badge_name} {badge_data['icon']}",
        notif_type="achievement"
    )
    
        unlocked_objects.append(db_badge)
        
    if unlocked_objects:
        db.commit()
        for b in unlocked_objects:
            db.refresh(b)
            
    return unlocked_objects

def get_user_badges(db: Session, user_id: int):
    return db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
