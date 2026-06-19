"""
Tests for achievement badge system.

Verifies:
1. First badge unlock
2. Energy Saver badge
3. Green Traveler badge
4. Eco Champion badge
5. Duplicate badge prevention
6. Badge retrieval
"""

from app.models.user import User
from app.models.emission import EmissionLog
from app.models.achievement import UserBadge
from app.services.achievement import (
    evaluate_badges,
    get_user_badges,
)


# ==================================================
# First Footprint Badge
# ==================================================

def test_first_footprint_badge_awarded(db_session):
    """
    User's first log should unlock First Footprint.
    """

    user = User(
        username="badge_user_1",
        email="badge1@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()

    log = EmissionLog(
        user_id=user.id,
        transport=5,
        electricity=5,
        diet=2,
        total=12,
        eco_score=70
    )

    db_session.add(log)
    db_session.commit()

    badges = evaluate_badges(
        db_session,
        user.id,
        log
    )

    badge_names = [b.badge_name for b in badges]

    assert "First Footprint" in badge_names


# ==================================================
# Energy Saver Badge
# ==================================================

def test_energy_saver_badge_awarded(db_session):
    """
    Electricity under 2kg should unlock badge.
    """

    user = User(
        username="energy_user",
        email="energy@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()

    log = EmissionLog(
        user_id=user.id,
        transport=5,
        electricity=1.5,
        diet=2,
        total=8.5,
        eco_score=75
    )

    db_session.add(log)
    db_session.commit()

    badges = evaluate_badges(
        db_session,
        user.id,
        log
    )

    badge_names = [b.badge_name for b in badges]

    assert "Energy Saver" in badge_names


# ==================================================
# Green Traveler Badge
# ==================================================

def test_green_traveler_badge_awarded(db_session):
    """
    Transport emissions under 1kg should unlock badge.
    """

    user = User(
        username="travel_user",
        email="travel@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()

    log = EmissionLog(
        user_id=user.id,
        transport=0.5,
        electricity=4,
        diet=2,
        total=6.5,
        eco_score=80
    )

    db_session.add(log)
    db_session.commit()

    badges = evaluate_badges(
        db_session,
        user.id,
        log
    )

    badge_names = [b.badge_name for b in badges]

    assert "Green Traveler" in badge_names


# ==================================================
# Eco Champion Badge
# ==================================================

def test_eco_champion_badge_awarded(db_session):
    """
    Eco score >= 90 should unlock badge.
    """

    user = User(
        username="champ_user",
        email="champ@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()

    log = EmissionLog(
        user_id=user.id,
        transport=1,
        electricity=1,
        diet=1,
        total=3,
        eco_score=95
    )

    db_session.add(log)
    db_session.commit()

    badges = evaluate_badges(
        db_session,
        user.id,
        log
    )

    badge_names = [b.badge_name for b in badges]

    assert "Eco Champion" in badge_names


# ==================================================
# Duplicate Badge Prevention
# ==================================================

def test_duplicate_badges_not_created(db_session):
    """
    Existing badges should not be awarded twice.
    """

    user = User(
        username="duplicate_user",
        email="duplicate@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()

    existing = UserBadge(
        user_id=user.id,
        badge_name="Eco Champion",
        description="test",
        icon="🌟"
    )

    db_session.add(existing)
    db_session.commit()

    log = EmissionLog(
        user_id=user.id,
        transport=1,
        electricity=1,
        diet=1,
        total=3,
        eco_score=95
    )

    db_session.add(log)
    db_session.commit()

    badges = evaluate_badges(
        db_session,
        user.id,
        log
    )

    badge_names = [b.badge_name for b in badges]

    assert "Eco Champion" not in badge_names


# ==================================================
# Badge Retrieval
# ==================================================

def test_get_user_badges_returns_list(db_session):
    """
    Verify badge retrieval service.
    """

    user = User(
        username="retrieve_user",
        email="retrieve@test.com",
        password_hash="hashed"
    )

    db_session.add(user)
    db_session.commit()

    badge = UserBadge(
        user_id=user.id,
        badge_name="First Footprint",
        description="Test",
        icon="🌱"
    )

    db_session.add(badge)
    db_session.commit()

    results = get_user_badges(
        db_session,
        user.id
    )

    assert len(results) == 1
    assert results[0].badge_name == "First Footprint"