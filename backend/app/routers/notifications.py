from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database, auth

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_user_notifications(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    notifs = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).all()

    return [
        {
            "id": f"NOTIF-{n.id}",
            "title": n.title,
            "message": n.message,
            "timestamp": n.timestamp or "Just now",
            "isRead": n.is_read,
            "type": n.type
        }
        for n in notifs
    ]

@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        nid = int(notification_id.replace("NOTIF-", "").replace("GOVT-NOTIF-", ""))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid notification ID format")

    notif = db.query(models.Notification).filter(
        models.Notification.id == nid,
        models.Notification.user_id == current_user.id
    ).first()

    if notif:
        notif.is_read = True
        db.commit()

    return {"message": "Notification marked as read"}
