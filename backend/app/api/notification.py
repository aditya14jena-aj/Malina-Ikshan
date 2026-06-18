from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.notification import (
    NotificationResponse,
    NotificationCountResponse,
    MarkReadResponse,
    DeleteResponse,
)
from app.services.notification import (
    get_user_notifications,
    get_unread_count,
    mark_as_read,
    mark_all_as_read,
    delete_notification,
)

router = APIRouter()


@router.get("", response_model=List[NotificationResponse])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_notifications(db=db, user_id=current_user.id)


@router.get("/count", response_model=NotificationCountResponse)
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = get_unread_count(db=db, user_id=current_user.id)
    return {"unread_count": count}


@router.patch("/{notif_id}/read", response_model=MarkReadResponse)
def mark_notification_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = mark_as_read(db=db, user_id=current_user.id, notif_id=notif_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True, "message": "Notification marked as read"}


@router.patch("/read-all", response_model=MarkReadResponse)
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = mark_all_as_read(db=db, user_id=current_user.id)
    return {"success": True, "message": f"Marked {count} notifications as read"}


@router.post("/mark-read", response_model=MarkReadResponse)
def mark_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = mark_all_as_read(db=db, user_id=current_user.id)
    return {"success": True, "message": f"Marked {count} notifications as read"}


@router.delete("/{notif_id}", response_model=DeleteResponse)
def remove_notification(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_notification(db=db, user_id=current_user.id, notif_id=notif_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True, "message": "Notification deleted"}
