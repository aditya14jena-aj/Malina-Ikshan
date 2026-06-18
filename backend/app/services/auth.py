from app.api import leaderboard
from app.services.notification import create_notification
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password
from app.services.notification import create_notification

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    

    create_notification(
    db=db,
    user_id=db_user.id,
    title="Welcome to Malina-Ikshan 🌱",
    message="Your sustainability journey starts now. Record your first footprint to unlock achievements.",
    notif_type="system")
    
    return db_user
