from datetime import datetime, timedelta

from app.models.user import User
from app.models.emission import EmissionLog
from app.services.emission import (
    get_weekly_logs,
    get_streaks,
    save_or_update_daily_log,
)


def create_user(db_session):
    user = User(
        username=f"user_{datetime.now().timestamp()}",
        email=f"user_{datetime.now().timestamp()}@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


def test_get_weekly_logs_returns_data(db_session):
    """
    Covers get_weekly_logs()
    """

    user = create_user(db_session)

    for i in range(3):
        log = EmissionLog(
            user_id=user.id,
            transport=5,
            electricity=2,
            diet=1,
            total=8,
            eco_score=80,
            date=datetime.now() - timedelta(days=i)
        )

        db_session.add(log)

    db_session.commit()

    weekly = get_weekly_logs(db_session, user.id)

    assert len(weekly) >= 1


def test_get_streaks_consecutive_days(db_session):
    """
    Covers streak calculation branch.
    """

    user = create_user(db_session)

    for i in range(3):
        log = EmissionLog(
            user_id=user.id,
            transport=1,
            electricity=1,
            diet=1,
            total=3,
            eco_score=90,
            date=datetime.now() - timedelta(days=i)
        )

        db_session.add(log)

    db_session.commit()

    streaks = get_streaks(db_session, user.id)

    assert streaks["current_streak"] >= 3
    assert streaks["longest_streak"] >= 3


def test_save_or_update_daily_log_creates_record(db_session):
    """
    Covers CREATE branch.
    """

    user = create_user(db_session)

    result = save_or_update_daily_log(
        db=db_session,
        user_id=user.id,
        car_km=10,
        bus_km=5,
        electricity_kwh=3,
        diet_type="vegetarian"
    )

    assert result.id is not None
    assert result.total > 0


def test_save_or_update_daily_log_updates_existing_record(db_session):
    """
    Covers UPDATE branch.
    """

    user = create_user(db_session)

    first = save_or_update_daily_log(
        db=db_session,
        user_id=user.id,
        car_km=10,
        bus_km=0,
        electricity_kwh=2,
        diet_type="vegetarian"
    )

    second = save_or_update_daily_log(
        db=db_session,
        user_id=user.id,
        car_km=20,
        bus_km=0,
        electricity_kwh=4,
        diet_type="non-vegetarian"
    )

    assert first.id == second.id
    assert second.total != 0


def test_save_or_update_daily_log_non_vegetarian(db_session):
    """
    Covers diet branch.
    """

    user = create_user(db_session)

    result = save_or_update_daily_log(
        db=db_session,
        user_id=user.id,
        car_km=0,
        bus_km=0,
        electricity_kwh=0,
        diet_type="non-vegetarian"
    )

    assert result.diet == 3.0