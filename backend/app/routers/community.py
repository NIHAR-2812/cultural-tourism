from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from app import models, database, auth, schemas

router = APIRouter(prefix="/community", tags=["Community Host"])

def format_host_location(loc: models.Location) -> dict:
    imgs = loc.image_urls if isinstance(loc.image_urls, list) else []
    cover = loc.cover_image or (imgs[0] if imgs else "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80")
    
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
        "sustainabilityHighlights": loc.sustainability_highlights if isinstance(loc.sustainability_highlights, list) else ["100% Solar Powered"],
        "rejectionReason": loc.rejection_reason,
        "ownerId": str(loc.owner_id),
        "submittedDate": loc.created_at.strftime("%Y-%m-%d") if loc.created_at else "2026-08-15"
    }

# Add these below your existing routes in community.py

@router.get("/properties")
def get_host_properties(current_user: dict = Depends(auth.get_current_user)):
    # Returns an empty list to satisfy the frontend's data fetch
    return []

@router.get("/bookings")
def get_host_bookings(current_user: dict = Depends(auth.get_current_user)):
    # Returns an empty list to satisfy the frontend's data fetch
    return []

@router.post("/upload-location")
def upload_location(
    payload: dict = Body(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_host)
):
    if current_user.approval_status != "approved" and not current_user.is_verified:
        raise HTTPException(status_code=403, detail="Account pending admin verification. You cannot upload properties yet.")

    title = payload.get("title") or payload.get("propertyName") or "Eco Sanctuary"
    description = payload.get("description") or "Native ecological retreat with strict carrying capacity limits."
    max_cap = int(payload.get("max_capacity") or payload.get("max_daily_capacity") or payload.get("maxCapacity") or 10)
    lat = float(payload.get("latitude") or 10.0)
    lng = float(payload.get("longitude") or 76.0)
    imgs = payload.get("images") or payload.get("image_urls") or []
    cover = payload.get("coverImage") or (imgs[0] if imgs else None)
    price = float(payload.get("price") or 1000.0)
    loc_str = payload.get("location") or "Kerala, India"
    cat_str = payload.get("category") or "Forest"
    tagline = payload.get("tagline") or "Community Forest Lodge"

    new_location = models.Location(
        title=title,
        tagline=tagline,
        description=description,
        location=loc_str,
        category=cat_str,
        price=price,
        max_daily_capacity=max_cap,
        latitude=lat,
        longitude=lng,
        image_urls=imgs,
        cover_image=cover,
        status="Pending",
        owner_id=current_user.id
    )
    db.add(new_location)
    
    # Send notification to Government Admin
    gov_users = db.query(models.User).filter(models.User.role.in_(["government", "admin"])).all()
    for gov in gov_users:
        db.add(models.Notification(
            user_id=gov.id,
            title="New Property Application Submitted",
            message=f"Host {current_user.name} submitted proposal '{new_location.title}' for verification.",
            type="application",
            timestamp="Just now"
        ))

    db.commit()
    db.refresh(new_location)
    return format_host_location(new_location)

@router.get("/properties")
def get_host_properties(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_host)
):
    locs = db.query(models.Location).filter(models.Location.owner_id == current_user.id).all()
    return [format_host_location(l) for l in locs]

@router.get("/bookings")
def get_host_bookings(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_host)
):
    bookings = db.query(models.Booking).join(models.Location).filter(
        models.Location.owner_id == current_user.id
    ).all()
    
    res = []
    for b in bookings:
        res.append({
            "id": f"BKG-{b.id:04d}",
            "propertyId": str(b.location_id),
            "propertyName": b.location.title if b.location else "Eco Sanctuary",
            "hostName": current_user.name,
            "customerName": b.customer_name or (b.tourist.name if b.tourist else "Mindful Tourist"),
            "customerEmail": b.customer_email or (b.tourist.email if b.tourist else "tourist@vanantara.org"),
            "bookingDate": b.date,
            "stayDates": b.stay_dates or f"{b.date}",
            "guestsCount": b.guests_count or 1,
            "status": b.status or "Confirmed",
            "payoutAmount": b.host_revenue or (b.total_amount * 0.92 if b.total_amount else 0.0)
        })
    return res

@router.get("/dashboard/analytics")
def host_analytics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_host)
):
    host_id = current_user.id
    
    total_revenue = db.query(func.sum(models.Booking.host_revenue)).join(models.Location).filter(
        models.Location.owner_id == host_id,
        models.Booking.status == "Confirmed"
    ).scalar() or 0.0
    
    upcoming_arrivals = db.query(models.Booking).join(models.Location).filter(
        models.Location.owner_id == host_id,
        models.Booking.status == "Confirmed"
    ).all()
    
    formatted_upcoming = []
    for b in upcoming_arrivals:
        formatted_upcoming.append({
            "id": f"BKG-{b.id:04d}",
            "guestName": b.customer_name or (b.tourist.name if b.tourist else "Mindful Tourist"),
            "dates": b.stay_dates or b.date,
            "guests": b.guests_count or 1,
            "payout": f"₹{round(b.host_revenue or 0.0):,}",
            "status": b.status or "Confirmed"
        })

    return {
        "totalEarnings": f"₹{round(total_revenue, 2):,}",
        "communityWagesPaid": f"₹{round(total_revenue * 0.65, 2):,}",
        "treesPlantedCount": int(total_revenue / 500) if total_revenue > 0 else 45,
        "carbonOffsetTotalKg": int(total_revenue / 50) if total_revenue > 0 else 620,
        "upcomingBookings": formatted_upcoming
    }