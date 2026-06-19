from app.services.emission import (
    create_emission_log,
    get_user_logs,
    get_streaks,
)

from app.models.user import User
from app.schemas.emission import EmissionLogCreate


def test_create_emission_log(db_session):
    """
    Verify emission logs can be created.
    """

    user = User(
        username="tester",
        email="tester@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    log = EmissionLogCreate(
        transport=10,
        electricity=5,
        diet=2,
        total=17,
        eco_score=80
    )

    result = create_emission_log(
        db=db_session,
        user_id=user.id,
        log=log
    )

    assert result.id is not None
    assert result.total == 17


def test_get_user_logs_returns_logs(db_session):
    """
    Verify user logs retrieval.
    """

    user = User(
        username="tester2",
        email="tester2@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    log = EmissionLogCreate(
        transport=5,
        electricity=5,
        diet=5,
        total=15,
        eco_score=75
    )

    create_emission_log(db_session, user.id, log)

    logs = get_user_logs(db_session, user.id)

    assert len(logs) >= 1


def test_get_streaks_empty_user(db_session):
    """
    User without logs should have zero streak.
    """

    user = User(
        username="emptyuser",
        email="empty@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    streaks = get_streaks(db_session, user.id)

    assert streaks["current_streak"] == 0
    assert streaks["longest_streak"] == 0