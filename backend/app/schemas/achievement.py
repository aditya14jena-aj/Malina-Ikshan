from pydantic import BaseModel
from datetime import datetime
from typing import List

class UserBadgeResponse(BaseModel):
    id: int
    user_id: int
    badge_name: str
    description: str
    icon: str
    earned_at: datetime

    model_config = {"from_attributes": True}

class BadgeUnlockNotification(BaseModel):
    badge_name: str
    description: str
    icon: str
