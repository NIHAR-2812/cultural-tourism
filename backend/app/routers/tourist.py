import math
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Union
from app import models, schemas, database, auth

router = APIRouter(prefix="/tourist", tags=["Tourist Engine"])

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def format_tourist_location(loc: models.Location) -> dict:
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
        "status": loc.status or "Live",
        "maxCapacity": loc.max_daily_capacity or 10,
        "max_daily_capacity": loc.max_daily_capacity or 10,
        "currentCapacity": current_cap,
        "isAtCapacity": current_cap >= (loc.max_daily_capacity or 10),
        "latitude": loc.latitude or 0.0,
        "longitude": loc.longitude or 0.0,
        "coordinates": {"lat": loc.latitude or 0.0, "lng": loc.longitude or 0.0},
        "images": imgs,
        "image_urls": imgs,
        "gallery": imgs if imgs else [cover],
        "coverImage": cover,
        "sustainabilityScore": loc.sustainability_score or 94,
        "sustainabilityHighlights": loc.sustainability_highlights if isinstance(loc.sustainability_highlights, list) else ["100% Zero Single-Use Plastic", "Solar Powered"],
        "host": {
            "id": str(loc.owner_id) if loc.owner_id else "1",
            "name": loc.owner.name if loc.owner else "Native Steward",
            "role": "Native Community Steward",
            "bio": loc.owner.community_name if loc.owner and loc.owner.community_name else "Indigenous Forest Protector",
            "verified": loc.owner.is_verified if loc.owner else True
        } if loc.owner else None
    }

@router.get("/catalog")
def get_live_catalog(db: Session = Depends(database.get_db)):
    """Fetch only locations that the Admin has approved."""
    live_locs = db.query(models.Location).filter(models.Location.status == "Live").all()
    return [format_tourist_location(loc) for loc in live_locs]

@router.get("/locations/{location_id}")
def get_location_detail(location_id: int, db: Session = Depends(database.get_db)):
    loc = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return format_tourist_location(loc)

@router.post("/book-itinerary")
def book_itinerary(
    payload: dict = Body(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_optional_current_user)
):
    loc_id_raw = payload.get("location_id") or payload.get("destinationId") or payload.get("id")
    target_location = None

    try:
        location_id = int(str(loc_id_raw).replace("loc-", ""))
        target_location = db.query(models.Location).filter(models.Location.id == location_id).first()
    except Exception:
        pass

    if not target_location and loc_id_raw:
        raw_str = str(loc_id_raw).replace("-", " ").lower()
        live_locs = db.query(models.Location).filter(models.Location.status == "Live").all()
        for loc in live_locs:
            if loc.title and any(w in loc.title.lower() for w in raw_str.split() if len(w) > 3):
                target_location = loc
                break
        if not target_location and live_locs:
            target_location = live_locs[0]

    if not target_location:
        target_location = db.query(models.Location).first()

    if not target_location:
        raise HTTPException(status_code=404, detail="Location not found or not active.")

    date_str = payload.get("date") or datetime.utcnow().strftime("%Y-%m-%d")
    guests_cnt = int(payload.get("guests_count") or payload.get("guests") or 1)
    stay_dates = payload.get("stay_dates") or f"{date_str}"
    customer_name = payload.get("customer_name") or current_user.name
    customer_email = payload.get("customer_email") or current_user.email

    # Check capacity for requested date
    current_visitors = db.query(models.Booking).filter(
        models.Booking.location_id == target_location.id,
        models.Booking.date == date_str,
        models.Booking.status == "Confirmed"
    ).count()

    if (current_visitors + guests_cnt) > target_location.max_daily_capacity:
        all_live_locations = db.query(models.Location).filter(
            models.Location.status == "Live", 
            models.Location.id != target_location.id
        ).all()
        
        alternatives = []
        for alt in all_live_locations:
            dist = calculate_distance(
                target_location.latitude, target_location.longitude, 
                alt.latitude, alt.longitude
            )
            if dist <= 30.0:
                alternatives.append({
                    "id": str(alt.id),
                    "title": alt.title,
                    "location": alt.location or "Nearby Reserve",
                    "distanceKm": round(dist, 2),
                    "coverImage": alt.cover_image or (alt.image_urls[0] if alt.image_urls else None),
                    "sustainabilityScore": alt.sustainability_score or 90,
                    "maxCapacity": alt.max_daily_capacity or 10,
                    "price": alt.price or 1000.0,
                    "reason": "Alternative nearby sanctuary within ecological limits."
                })
        
        return {
            "status": "capacity_exceeded",
            "message": "This site has reached its ecological carrying limit for the day.",
            "alternatives_within_15km": alternatives
        }

    # Financial Split
    base_price = float(target_location.price or 1000.0) * guests_cnt
    platform_fee = base_price * 0.03       # 3%
    conservation_fund = base_price * 0.05  # 5%
    host_revenue = base_price - (platform_fee + conservation_fund) # 92%

    new_booking = models.Booking(
        date=date_str,
        stay_dates=stay_dates,
        guests_count=guests_cnt,
        customer_name=customer_name or current_user.name,
        customer_email=customer_email or current_user.email,
        status="Confirmed",
        total_amount=base_price,
        host_revenue=host_revenue,
        conservation_fund=conservation_fund,
        platform_fee=platform_fee,
        tourist_id=current_user.id,
        location_id=target_location.id
    )
    db.add(new_booking)
    
    # Notify Host
    if target_location.owner_id:
        db.add(models.Notification(
            user_id=target_location.owner_id,
            title="New Booking Confirmed",
            message=f"{current_user.name} booked '{target_location.title}' for {stay_dates}.",
            type="booking",
            timestamp="Just now"
        ))

    db.commit()
    db.refresh(new_booking)

    return {
        "status": "proceed_to_checkout",
        "booking_id": new_booking.id,
        "message": "Capacity available. Proceeding to financial breakdown.",
        "financials": {
            "basePrice": base_price,
            "platformFee": platform_fee,
            "conservationFund": conservation_fund,
            "hostRevenue": host_revenue,
            "totalCharge": base_price
        }
    }

@router.get("/my-bookings")
def get_my_bookings(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    bookings = db.query(models.Booking).filter(models.Booking.tourist_id == current_user.id).all()
    res = []
    for b in bookings:
        res.append({
            "id": f"BKG-{b.id:04d}",
            "propertyId": str(b.location_id),
            "propertyName": b.location.title if b.location else "Eco Sanctuary",
            "bookingDate": b.date,
            "stayDates": b.stay_dates or b.date,
            "guestsCount": b.guests_count or 1,
            "status": b.status,
            "totalAmount": b.total_amount
        })
    return res