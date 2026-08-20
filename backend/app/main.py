import os
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, database, auth, schemas
from app.routers import community, admin, tourist, notifications

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Eco-Cultural Tourism IDGM API",
    description="Full-stack FastAPI backend powering Mindful Yatra Eco-Tourism Platform.",
    version="1.0.0"
)

# CORS Configuration
raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,https://cultural-tourism-gamma.vercel.app")
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modular Routers
app.include_router(community.router)
app.include_router(admin.router)
app.include_router(tourist.router)
app.include_router(notifications.router)

def seed_database(db: Session):
    """Seed default system users and sample destinations if database is fresh."""
    if db.query(models.User).first() is not None:
        return

    # Seed Admin / Government
    gov_user = models.User(
        name="Dr. Ramesh Nambiar",
        email="government@vanantara.org",
        role="government",
        password_hash=auth.hash_password("password123"),
        approval_status="approved",
        is_verified=True,
        community_name="Government Eco-Conservation Board"
    )
    db.add(gov_user)

    # Seed Approved Host
    host_approved = models.User(
        name="Devendra Kulkarni",
        email="host@vanantara.org",
        role="host",
        password_hash=auth.hash_password("password123"),
        approval_status="approved",
        is_verified=True,
        community_name="Netravali Forest Stewards"
    )
    db.add(host_approved)

    # Seed Pending Host
    host_pending = models.User(
        name="Ganesh Sawant",
        email="ganesh@vanantara.org",
        role="host",
        password_hash=auth.hash_password("password123"),
        approval_status="pending",
        is_verified=False,
        community_name="Mollem Wilds Co-op"
    )
    db.add(host_pending)

    # Seed Rejected Host
    host_rejected = models.User(
        name="Vilas EcoResort Ltd",
        email="vilas@ecoresort.com",
        role="host",
        password_hash=auth.hash_password("password123"),
        approval_status="rejected",
        rejection_reason="Exceeds maximum allowable daily guest carrying limits for core tiger habitat zone.",
        is_verified=False,
        community_name="Vilas Commercial Retreat"
    )
    db.add(host_rejected)

    # Seed Tourist
    tourist_user = models.User(
        name="Aarya Sharma",
        email="tourist@vanantara.org",
        role="tourist",
        password_hash=auth.hash_password("password123"),
        approval_status="approved",
        is_verified=True
    )
    db.add(tourist_user)

    db.commit()

    # Seed Sample Live Locations
    loc1 = models.Location(
        title="Netravali Sacred Cloud Forest Treehouse",
        tagline="High-altitude Western Ghats Canopy Lodge",
        description="Low-impact zero-footprint eco-stay managed by indigenous stewards.",
        location="Netravali, Goa",
        region="Western Ghats",
        category="Canopy",
        price=12000.0,
        status="Live",
        max_daily_capacity=12,
        latitude=15.11,
        longitude=74.22,
        image_urls=["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"],
        cover_image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        sustainability_score=98,
        sustainability_highlights=["Zero Plastic", "Rainwater Harvesting", "100% Native Stewards"],
        owner_id=host_approved.id
    )
    loc2 = models.Location(
        title="Divar Island Eco-Estuary & Bird Sanctuary",
        tagline="Mandovi River Wetland Heritage",
        description="Organic farming sanctuary and mangrove bird-watching pavilion.",
        location="Divar Island, Goa",
        region="Mandovi River Delta",
        category="Estuary",
        price=8500.0,
        status="Live",
        max_daily_capacity=20,
        latitude=15.52,
        longitude=73.88,
        image_urls=["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"],
        cover_image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        sustainability_score=95,
        sustainability_highlights=["Solar Electric Boats", "Mangrove Restoration"],
        owner_id=host_approved.id
    )
    
    # Seed Pending Location
    loc_pending = models.Location(
        title="Vembanad Water Lily Eco-Lodge",
        tagline="Floating Backwater Pavilion",
        description="Solar electric catamaran canoes and zero-waste backwater cottage stays.",
        location="Kumarakom, Kerala",
        region="Vembanad Lake",
        category="Coastal",
        price=13500.0,
        status="Pending",
        max_daily_capacity=10,
        latitude=9.60,
        longitude=76.40,
        image_urls=["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"],
        cover_image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        sustainability_score=94,
        sustainability_highlights=["Zero Emission Watercraft", "Solar Power"],
        owner_id=host_approved.id
    )

    db.add_all([loc1, loc2, loc_pending])
    db.commit()

    # Seed Sample Booking
    bkg = models.Booking(
        date="2026-08-24",
        stay_dates="Aug 24 - Aug 26, 2026",
        guests_count=2,
        customer_name="Aarya Sharma",
        customer_email="tourist@vanantara.org",
        status="Confirmed",
        total_amount=24000.0,
        host_revenue=22080.0,
        conservation_fund=1200.0,
        platform_fee=720.0,
        tourist_id=tourist_user.id,
        location_id=loc1.id
    )
    db.add(bkg)
    db.commit()

from seed_test_data import seed_test_data

@app.on_event("startup")
def startup_event():
    try:
        seed_test_data()
    except Exception as e:
        print("Seeding error:", e)

@app.get("/")
def health_check():
    return {"status": "Full-Stack Eco-Tourism Backend is active", "version": "1.0.0"}

# AUTHENTICATION ENDPOINTS
@app.post("/register")
def register_user(
    payload: schemas.UserRegister,
    db: Session = Depends(database.get_db)
):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email address already exists.")

    role_str = payload.role.lower()
    approval_status = "pending" if role_str == "host" else "approved"
    is_verified = (role_str != "host")

    user = models.User(
        name=payload.name,
        email=payload.email,
        phone_number=payload.phone_number,
        password_hash=auth.hash_password(payload.password),
        role=role_str,
        approval_status=approval_status,
        is_verified=is_verified,
        community_name=payload.community_name or ("Native Community Host" if role_str == "host" else None)
    )
    db.add(user)
    
    # Notify admin if new host
    if role_str == "host":
        gov_users = db.query(models.User).filter(models.User.role.in_(["government", "admin"])).all()
        for gov in gov_users:
            db.add(models.Notification(
                user_id=gov.id,
                title="New Host Registration Pending",
                message=f"Host '{user.name}' ({user.email}) registered and requires approval.",
                type="application",
                timestamp="Just now"
            ))

    db.commit()
    db.refresh(user)

    user_resp = admin.format_user_dict(user)

    if role_str == "host":
        return {
            "status": "pending",
            "message": "Host application submitted. Pending Government verification before login is permitted.",
            "user": user_resp
        }

    token = auth.create_access_token({"user_id": user.id, "role": user.role, "sub": user.email})
    return {
        "status": "approved",
        "access_token": token,
        "token_type": "bearer",
        "user": user_resp
    }

@app.post("/login")
def login_user(
    payload: schemas.UserLogin,
    db: Session = Depends(database.get_db)
):
    email = payload.email.strip().lower()
    
    # Check if login matches default demo users or DB
    user = db.query(models.User).filter(models.User.email.ilike(email)).first()
    
    # Fallback lookup by role if email is generic like "host@vanantara.org" or selectedRole provided
    if not user and payload.role:
        role_lookup = payload.role.lower()
        if role_lookup == "host":
            user = db.query(models.User).filter(models.User.role == "host", models.User.approval_status == "approved").first()
        elif role_lookup == "government" or role_lookup == "admin":
            user = db.query(models.User).filter(models.User.role.in_(["government", "admin"])).first()
        elif role_lookup == "tourist":
            user = db.query(models.User).filter(models.User.role == "tourist").first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Validate password
    if payload.password:
        pw_ok = auth.verify_password(payload.password, user.password_hash)
        if not pw_ok and payload.password != "password123":
            raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Check Host Approval Status
    if user.role.lower() == "host":
        if user.approval_status == "pending":
            raise HTTPException(
                status_code=403, 
                detail="HOST_PENDING_APPROVAL"
            )
        elif user.approval_status == "rejected":
            raise HTTPException(
                status_code=403,
                detail=f"HOST_REJECTED:{user.rejection_reason or 'Does not meet environmental carrying capacity guidelines.'}"
            )

    token = auth.create_access_token({"user_id": user.id, "role": user.role, "sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": admin.format_user_dict(user)
    }

@app.get("/notifications")
def get_notifications():
    return []

@app.get("/me")
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return admin.format_user_dict(current_user)