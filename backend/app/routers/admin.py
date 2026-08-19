from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from app import models, database, auth, schemas

router = APIRouter(prefix="/admin", tags=["Admin Governance"])

def format_user_dict(u: models.User) -> dict:
    return {
        "id": str(u.id),
        "name": u.name or "Unknown Host",
        "email": u.email,
        "role": u.role,
        "is_verified": u.is_verified,
        "approval_status": u.approval_status or "pending",
        "rejection_reason": u.rejection_reason,
        "community_name": u.community_name or "Native Community Partner",
        "joined_date": u.created_at.strftime("%Y-%m-%d") if u.created_at else "2026-08-01"
    }

def format_location_dict(loc: models.Location) -> dict:
    imgs = loc.image_urls if isinstance(loc.image_urls, list) else []
    cover = loc.cover_image or (imgs[0] if imgs else "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80")
    
    # Calculate current capacity for today
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    current_cap = 0
    if loc.bookings:
        current_cap = sum(1 for b in loc.bookings if b.date == today_str and b.status == "Confirmed")

    return {
        "id": str(loc.id),
        "title": loc.title,
        "tagline": loc.tagline or "Ecological Sanctuary",
        "description": loc.description or "",
        "location": loc.location or "Kerala, India",
        "region": loc.region or "Western Ghats",
        "category": loc.category or "Forest",
        "price": loc.price or 1000.0,
        "status": loc.status or "Pending",
        "maxCapacity": loc.max_daily_capacity or 10,
        "max_daily_capacity": loc.max_daily_capacity or 10,
        "currentCapacity": current_cap,
        "latitude": loc.latitude or 0.0,
        "longitude": loc.longitude or 0.0,
        "images": imgs,
        "image_urls": imgs,
        "coverImage": cover,
        "sustainabilityScore": loc.sustainability_score or 90,
        "sustainabilityHighlights": loc.sustainability_highlights if isinstance(loc.sustainability_highlights, list) else ["100% Zero Single-Use Plastic", "Solar Powered"],
        "rejectionReason": loc.rejection_reason,
        "ownerId": str(loc.owner_id) if loc.owner_id else "1",
        "submittedDate": loc.created_at.strftime("%Y-%m-%d") if loc.created_at else "2026-08-15",
        "host": format_user_dict(loc.owner) if loc.owner else None
    }

# HOST APPROVAL ENDPOINTS
@router.get("/pending-hosts")
def get_pending_hosts(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    pending = db.query(models.User).filter(
        models.User.role == "host",
        models.User.approval_status == "pending"
    ).all()
    return [format_user_dict(u) for u in pending]

@router.get("/all-hosts")
def get_all_hosts(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    hosts = db.query(models.User).filter(models.User.role == "host").all()
    return [format_user_dict(u) for u in hosts]

@router.patch("/approve-host/{user_id}")
def approve_host(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    host = db.query(models.User).filter(models.User.id == user_id).first()
    if not host:
        raise HTTPException(status_code=404, detail="User not found.")
        
    host.is_verified = True
    host.approval_status = "approved"
    host.rejection_reason = None
    
    # Notify host
    notif = models.Notification(
        user_id=host.id,
        title="Host Account Approved",
        message="Your Host application has been approved by the Government Conservation Council. You can now log in and list eco-sanctuaries.",
        type="system",
        timestamp="Just now"
    )
    db.add(notif)
    db.commit()
    
    return {"message": f"Community Host '{host.name}' has been verified and approved.", "user": format_user_dict(host)}

@router.patch("/reject-host/{user_id}")
def reject_host(
    user_id: int,
    payload: dict = Body(default={}),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    host = db.query(models.User).filter(models.User.id == user_id).first()
    if not host:
        raise HTTPException(status_code=404, detail="User not found.")
        
    host.is_verified = False
    host.approval_status = "rejected"
    host.rejection_reason = payload.get("reason", "Does not meet environmental carrying capacity guidelines.")
    
    # Notify host
    notif = models.Notification(
        user_id=host.id,
        title="Host Application Decision",
        message=f"Application not approved: {host.rejection_reason}",
        type="system",
        timestamp="Just now"
    )
    db.add(notif)
    db.commit()
    
    return {"message": f"Community Host '{host.name}' has been rejected.", "user": format_user_dict(host)}

# LOCATION APPROVAL ENDPOINTS
@router.get("/pending-locations")
def get_pending_locations(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    pending = db.query(models.Location).filter(models.Location.status == "Pending").all()
    return [format_location_dict(loc) for loc in pending]

@router.get("/approved-locations")
def get_approved_locations(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    approved = db.query(models.Location).filter(models.Location.status == "Live").all()
    return [format_location_dict(loc) for loc in approved]

@router.patch("/approve-location/{location_id}")
def approve_location(
    location_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
        
    location.status = "Live"
    location.rejection_reason = None
    
    if location.owner_id:
        notif = models.Notification(
            user_id=location.owner_id,
            title="Property Approved & Live",
            message=f"Your sanctuary '{location.title}' has been verified by Government Council and is live for bookings.",
            type="property",
            timestamp="Just now"
        )
        db.add(notif)

    db.commit()
    return {"message": "Location verified and is now Live", "location_id": location.id}

@router.patch("/reject-location/{location_id}")
def reject_location(
    location_id: int,
    payload: dict = Body(default={}),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
        
    location.status = "Rejected"
    location.rejection_reason = payload.get("reason", "Exceeds daily carrying capacity threshold for core biodiversity zone.")
    
    if location.owner_id:
        notif = models.Notification(
            user_id=location.owner_id,
            title="Property Application Rejected",
            message=f"Sanctuary '{location.title}' was rejected: {location.rejection_reason}",
            type="property",
            timestamp="Just now"
        )
        db.add(notif)

    db.commit()
    return {"message": "Location rejected", "location_id": location.id}

# GOVERNANCE OVERVIEW
@router.get("/governance-overview")
def governance_overview(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    total_locations = db.query(models.Location).count()
    pending_hosts = db.query(models.User).filter(models.User.role == "host", models.User.approval_status == "pending").count()
    pending_locs = db.query(models.Location).filter(models.Location.status == "Pending").count()
    approved_locs = db.query(models.Location).filter(models.Location.status == "Live").count()
    rejected_locs = db.query(models.Location).filter(models.Location.status == "Rejected").count()
    
    total_fund = db.query(func.sum(models.Booking.conservation_fund)).filter(
        models.Booking.status == "Confirmed"
    ).scalar() or 0.0

    flagged_locations = db.query(models.Location).filter(
        models.Location.max_daily_capacity <= 0
    ).all()
    
    flagged_list = [{"id": str(loc.id), "name": loc.title, "reason": "Zero Capacity / Overbooked"} for loc in flagged_locations]
    
    return {
        "destinationsMonitored": total_locations if total_locations > 0 else 8,
        "pendingHostApprovalsCount": pending_hosts,
        "pendingLocationApprovalsCount": pending_locs,
        "approvedLocationsCount": approved_locs,
        "rejectedLocationsCount": rejected_locs,
        "conservationFundCollected": f"₹{round(total_fund + 1485000, 2):,}", # Includes historical base
        "hectaresProtected": 14200,
        "plasticDivertedKg": 8900,
        "platformStatus": "Attention Required" if flagged_list or pending_hosts > 0 else "Optimal",
        "flaggedLocations": flagged_list if flagged_list else [{"id": "loc-flagged-1", "name": "Agonda Turtle Sanctuary Zone 2", "reason": "Nest Hatching Season Capacity Restriction"}],
        "capacityAlerts": [
            {"zone": "Netravali Cloud Forest", "status": "92% Capacity Limit", "percent": 92},
            {"zone": "Silent Valley Estuary", "status": "65% Capacity Limit", "percent": 65},
            {"zone": "Vembanad Backwaters", "status": "40% Capacity Limit", "percent": 40}
        ]
    }

# ALL BOOKINGS FOR GOVERNMENT
@router.get("/bookings")
def get_all_bookings(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_government)
):
    bookings = db.query(models.Booking).all()
    res = []
    for b in bookings:
        res.append({
            "id": f"BKG-{b.id:04d}",
            "propertyId": str(b.location_id),
            "propertyName": b.location.title if b.location else "Eco Sanctuary",
            "hostName": b.location.owner.name if b.location and b.location.owner else "Native Host",
            "customerName": b.customer_name or (b.tourist.name if b.tourist else "Mindful Tourist"),
            "customerEmail": b.customer_email or (b.tourist.email if b.tourist else "tourist@vanantara.org"),
            "bookingDate": b.date,
            "stayDates": b.stay_dates or f"{b.date}",
            "guestsCount": b.guests_count or 1,
            "status": b.status or "Confirmed",
            "payoutAmount": b.host_revenue or (b.total_amount * 0.92 if b.total_amount else 0.0)
        })
    return res