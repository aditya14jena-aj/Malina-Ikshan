from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import date, timedelta, datetime
from app.models.notification import Notification
from app.models.emission import EmissionLog
from app.models.achievement import UserBadge


def create_notification(db: Session, user_id: int, title: str, message: str, notif_type: str):
    """Create and persist a single notification."""
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type,
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def get_user_notifications(db: Session, user_id: int, limit: int = 50):
    """Get all notifications for a user, newest first."""
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(desc(Notification.created_at))
        .limit(limit)
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    """Return the count of unread notifications."""
    return (
        db.query(func.count(Notification.id))
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .scalar()
    )


def mark_as_read(db: Session, user_id: int, notif_id: int):
    """Mark a single notification as read."""
    notif = (
        db.query(Notification)
        .filter(Notification.id == notif_id, Notification.user_id == user_id)
        .first()
    )
    if notif:
        notif.is_read = True
        db.commit()
        db.refresh(notif)
    return notif


def mark_all_as_read(db: Session, user_id: int) -> int:
    """Mark all notifications as read. Returns count updated."""
    count = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .update({"is_read": True})
    )
    db.commit()
    return count


def delete_notification(db: Session, user_id: int, notif_id: int) -> bool:
    """Delete a notification. Returns True if deleted."""
    notif = (
        db.query(Notification)
        .filter(Notification.id == notif_id, Notification.user_id == user_id)
        .first()
    )
    if notif:
        db.delete(notif)
        db.commit()
        return True
    return False


# ──────────────────────────────────────────────
# Event-driven notification generators
# ──────────────────────────────────────────────

def notify_account_created(db: Session, user_id: int, username: str):
    """System: account created."""
    create_notification(
        db, user_id,
        "🎉 Welcome to Malina-Ikshan!",
        f"Welcome aboard, {username}! Start logging your carbon footprint to track your sustainability journey.",
        "system"
    )


def notify_badge_unlocked(db: Session, user_id: int, badge_name: str, badge_icon: str):
    """Achievement: new badge unlocked."""
    create_notification(
        db, user_id,
        f"{badge_icon} Achievement Unlocked",
        f"You earned the {badge_name} badge!",
        "achievement"
    )


def notify_streak_milestone(db: Session, user_id: int, streak_days: int):
    """Streak: milestone reached (3, 7, 14, 30 days)."""
    create_notification(
        db, user_id,
        "🔥 Streak Milestone",
        f"You have maintained a {streak_days}-day sustainability streak!",
        "streak"
    )


def notify_streak_broken(db: Session, user_id: int, previous_streak: int):
    """Streak: broken."""
    create_notification(
        db, user_id,
        "💔 Streak Broken",
        f"Your {previous_streak}-day streak has ended. Log today to start a new one!",
        "streak"
    )


def notify_goal_reached(db: Session, user_id: int, goal_type: str, target_kg: float):
    """Goal: target reached."""
    create_notification(
        db, user_id,
        "🎯 Goal Reached!",
        f"Congratulations! You achieved your {goal_type} target of {target_kg:.1f} kg CO₂.",
        "goal"
    )


def notify_goal_progress(db: Session, user_id: int, percent: int, goal_type: str):
    """Goal: 80% milestone."""
    create_notification(
        db, user_id,
        "🎯 Goal Progress",
        f"You are {percent}% toward your {goal_type} reduction target. Keep going!",
        "goal"
    )


def notify_emissions_insight(db: Session, user_id: int, change_percent: float, direction: str):
    """Insight: weekly emissions comparison."""
    if direction == "decreased":
        create_notification(
            db, user_id,
            "📈 Sustainability Insight",
            f"Great work! Your emissions are {abs(change_percent):.0f}% lower than last week.",
            "insight"
        )
    else:
        create_notification(
            db, user_id,
            "📉 Sustainability Insight",
            f"Your emissions increased by {abs(change_percent):.0f}% compared to last week. Consider adjusting your habits.",
            "insight"
        )


def notify_leaderboard_rank_change(db: Session, user_id: int, old_rank: int, new_rank: int):
    """Leaderboard: rank improved."""
    if new_rank <= 10 and old_rank > 10:
        create_notification(
            db, user_id,
            "🏅 Leaderboard Update",
            f"Amazing! You entered the top 10 at rank #{new_rank}!",
            "leaderboard"
        )
    else:
        create_notification(
            db, user_id,
            "🏅 Leaderboard Update",
            f"You moved from rank #{old_rank} to #{new_rank}!",
            "leaderboard"
        )


def notify_personal_best(db: Session, user_id: int, score: float):
    """Leaderboard: new personal best eco score."""
    create_notification(
        db, user_id,
        "🏅 New Personal Best!",
        f"You achieved a new personal best eco score of {score:.0f}!",
        "leaderboard"
    )


# ──────────────────────────────────────────────
# Composite evaluator called after a log is saved
# ──────────────────────────────────────────────

def evaluate_notifications_after_log(db: Session, user_id: int, db_log: EmissionLog, new_badges: list):
    """
    Called after save_or_update_daily_log + evaluate_badges.
    Checks all notification triggers based on current state.
    """

    # 1. Badge notifications
    for badge in new_badges:
        notify_badge_unlocked(db, user_id, badge.badge_name, badge.icon)

    # 2. Streak milestones
    from app.services.emission import get_streaks
    streaks = get_streaks(db, user_id)
    current_streak = streaks.get("current_streak", 0)

    streak_milestones = [3, 7, 14, 30]
    for milestone in streak_milestones:
        if current_streak == milestone:
            # Check we haven't already notified for this exact milestone
            existing = (
                db.query(Notification)
                .filter(
                    Notification.user_id == user_id,
                    Notification.type == "streak",
                    Notification.message.contains(f"{milestone}-day")
                )
                .first()
            )
            if not existing:
                notify_streak_milestone(db, user_id, milestone)

    # 3. Goal progress (daily goal check using settings from localStorage defaults)
    daily_goal = 10.0  # default
    try:
        settings_goals = db.execute(
            "SELECT daily_goal_kg FROM user_settings WHERE user_id = :uid",
            {"uid": user_id}
        ).first()
        if settings_goals:
            daily_goal = settings_goals[0]
    except Exception:
        pass

    if db_log.total > 0 and daily_goal > 0:
        progress_pct = int((1 - db_log.total / daily_goal) * 100) if db_log.total <= daily_goal else 0
        if db_log.total <= daily_goal:
            # Check if already notified today for goal reached
            today = date.today()
            existing_goal = (
                db.query(Notification)
                .filter(
                    Notification.user_id == user_id,
                    Notification.type == "goal",
                    Notification.title.contains("Goal Reached"),
                    func.date(Notification.created_at) == today,
                )
                .first()
            )
            if not existing_goal:
                notify_goal_reached(db, user_id, "daily", daily_goal)
        elif db_log.total <= daily_goal * 1.25:  # within 80% threshold
            pct = int((1 - (db_log.total - daily_goal) / daily_goal) * 100)
            if pct >= 80:
                existing_progress = (
                    db.query(Notification)
                    .filter(
                        Notification.user_id == user_id,
                        Notification.type == "goal",
                        Notification.title.contains("Goal Progress"),
                        func.date(Notification.created_at) == date.today(),
                    )
                    .first()
                )
                if not existing_progress:
                    notify_goal_progress(db, user_id, 80, "daily")

    # 4. Weekly insight: compare this week vs last week
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    last_week_start = week_start - timedelta(days=7)
    last_week_end = week_start - timedelta(days=1)

    this_week_total = (
        db.query(func.sum(EmissionLog.total))
        .filter(
            EmissionLog.user_id == user_id,
            func.date(EmissionLog.date) >= week_start,
            func.date(EmissionLog.date) <= today,
        )
        .scalar()
    ) or 0

    last_week_total = (
        db.query(func.sum(EmissionLog.total))
        .filter(
            EmissionLog.user_id == user_id,
            func.date(EmissionLog.date) >= last_week_start,
            func.date(EmissionLog.date) <= last_week_end,
        )
        .scalar()
    ) or 0

    if last_week_total > 0 and this_week_total > 0:
        change_pct = ((this_week_total - last_week_total) / last_week_total) * 100
        # Only notify once per day for insight
        existing_insight = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.type == "insight",
                func.date(Notification.created_at) == today,
            )
            .first()
        )
        if not existing_insight and abs(change_pct) >= 5:
            direction = "decreased" if change_pct < 0 else "increased"
            notify_emissions_insight(db, user_id, change_pct, direction)

    # 5. Leaderboard rank check
    _check_leaderboard_rank(db, user_id, db_log)

    # 6. Personal best eco score
    _check_personal_best(db, user_id, db_log)


def _check_leaderboard_rank(db: Session, user_id: int, db_log: EmissionLog):
    """Check if user's leaderboard rank improved after this log."""
    from app.models.user import User

    # Get all users ranked by avg eco score
    results = (
        db.query(
            EmissionLog.user_id,
            func.avg(EmissionLog.eco_score).label("avg_score")
        )
        .group_by(EmissionLog.user_id)
        .order_by(desc("avg_score"))
        .all()
    )

    rank_map = {r.user_id: idx + 1 for idx, r in enumerate(results)}
    current_rank = rank_map.get(user_id)

    if current_rank is None:
        return

    # Check for previous rank notification to compare
    last_rank_notif = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.type == "leaderboard",
            Notification.title.contains("Leaderboard Update"),
        )
        .order_by(desc(Notification.created_at))
        .first()
    )

    if last_rank_notif:
        # Extract old rank from message
        import re
        match = re.search(r"#(\d+)", last_rank_notif.message)
        if match:
            # Get the last rank mentioned
            all_ranks = re.findall(r"#(\d+)", last_rank_notif.message)
            old_rank = int(all_ranks[-1])  # the destination rank from last notification
            if current_rank < old_rank:
                notify_leaderboard_rank_change(db, user_id, old_rank, current_rank)
    else:
        # First time on leaderboard
        if current_rank <= 10:
            notify_leaderboard_rank_change(db, user_id, 999, current_rank)


def _check_personal_best(db: Session, user_id: int, db_log: EmissionLog):
    """Check if this log's eco score is a personal best."""
    best_score = (
        db.query(func.max(EmissionLog.eco_score))
        .filter(EmissionLog.user_id == user_id, EmissionLog.id != db_log.id)
        .scalar()
    ) or 0

    if db_log.eco_score > best_score and best_score > 0:
        # Don't spam - check if we already notified for this score today
        existing = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.type == "leaderboard",
                Notification.title.contains("Personal Best"),
                func.date(Notification.created_at) == date.today(),
            )
            .first()
        )
        if not existing:
            notify_personal_best(db, user_id, db_log.eco_score)
