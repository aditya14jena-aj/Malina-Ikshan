"""
Pytest Configuration for Malina-Ikshan

Purpose:
--------
Creates a completely isolated SQLite database for testing.

Why?
----
We do NOT want tests touching:

1. Production PostgreSQL database
2. Local development database

Every pytest run gets its own temporary database.
"""

import os

# --------------------------------------------------
# Force tests to use SQLite instead of PostgreSQL
# --------------------------------------------------
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

# Database objects
from app.database.session import Base, engine

# --------------------------------------------------
# Import all models so SQLAlchemy knows which
# tables need to be created.
#
# Without these imports:
# Base.metadata.create_all()
# will create ZERO tables.
# --------------------------------------------------
from app.models.user import User
from app.models.emission import EmissionLog
from app.models.notification import Notification
from app.models.achievement import UserBadge


def pytest_sessionstart(session):
    """
    Executed automatically before the test suite starts.

    Creates all required tables inside test.db.

    Example:
        users
        emissions
        notifications
        achievements

    This guarantees that tests can safely query
    the database without crashing due to
    missing tables.
    """

    Base.metadata.create_all(bind=engine)