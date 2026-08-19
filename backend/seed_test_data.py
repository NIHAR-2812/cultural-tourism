import sys
import os
from datetime import datetime

# Add parent directory to path to allow importing app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import models, database, auth

def seed_test_data():
    db = database.SessionLocal()
    try:
        print("[SEED] Seeding deterministic test accounts and workflow data...")

        # 1. GOVERNMENT ADMIN ACCOUNT
        gov = db.query(models.User).filter(models.User.email == "government@test.local").first()
        if not gov:
            gov = models.User(
                name="Test Government Admin",
                email="government@test.local",
                role="government",
                password_hash=auth.hash_password("Government@123"),
                approval_status="approved",
                is_verified=True,
                community_name="Government Conservation Council"
            )
            db.add(gov)
            db.commit()
            db.refresh(gov)
            print("  [OK] Created Government Admin: government@test.local")
        else:
            gov.password_hash = auth.hash_password("Government@123")
            gov.approval_status = "approved"
            gov.is_verified = True
            db.commit()
            print("  [OK] Updated Government Admin: government@test.local")

        # Demo fallback gov
        gov_demo = db.query(models.User).filter(models.User.email == "government@vanantara.org").first()
        if not gov_demo:
            gov_demo = models.User(
                name="Dr. Ramesh Nambiar",
                email="government@vanantara.org",
                role="government",
                password_hash=auth.hash_password("password123"),
                approval_status="approved",
                is_verified=True,
                community_name="Government Eco-Conservation Board"
            )
            db.add(gov_demo)
            db.commit()

        # 2. APPROVED HOST ACCOUNT
        app_host = db.query(models.User).filter(models.User.email == "approved.host@test.local").first()
        if not app_host:
            app_host = models.User(
                name="Test Approved Host",
                email="approved.host@test.local",
                role="host",
                password_hash=auth.hash_password("Host@123"),
                approval_status="approved",
                is_verified=True,
                community_name="Vayanad Stewards Co-op"
            )
            db.add(app_host)
            db.commit()
            db.refresh(app_host)
            print("  [OK] Created Approved Host: approved.host@test.local")
        else:
            app_host.password_hash = auth.hash_password("Host@123")
            app_host.approval_status = "approved"
            app_host.is_verified = True
            db.commit()
            print("  [OK] Updated Approved Host: approved.host@test.local")

        # Demo fallback host
        host_demo = db.query(models.User).filter(models.User.email == "host@vanantara.org").first()
        if not host_demo:
            host_demo = models.User(
                name="Devendra Kulkarni",
                email="host@vanantara.org",
                role="host",
                password_hash=auth.hash_password("password123"),
                approval_status="approved",
                is_verified=True,
                community_name="Netravali Forest Stewards"
            )
            db.add(host_demo)
            db.commit()

        # 3. PENDING HOST ACCOUNT
        pend_host = db.query(models.User).filter(models.User.email == "pending.host@test.local").first()
        if not pend_host:
            pend_host = models.User(
                name="Test Pending Host",
                email="pending.host@test.local",
                role="host",
                password_hash=auth.hash_password("Host@123"),
                approval_status="pending",
                is_verified=False,
                community_name="Mollem Wilds Co-op"
            )
            db.add(pend_host)
            db.commit()
            db.refresh(pend_host)
            print("  [OK] Created Pending Host: pending.host@test.local")
        else:
            pend_host.password_hash = auth.hash_password("Host@123")
            pend_host.approval_status = "pending"
            pend_host.is_verified = False
            db.commit()
            print("  [OK] Reset Pending Host: pending.host@test.local")

        # 4. REJECTED HOST ACCOUNT
        rej_host = db.query(models.User).filter(models.User.email == "rejected.host@test.local").first()
        if not rej_host:
            rej_host = models.User(
                name="Test Rejected Host",
                email="rejected.host@test.local",
                role="host",
                password_hash=auth.hash_password("Host@123"),
                approval_status="rejected",
                rejection_reason="Exceeds maximum allowable daily guest carrying limits for core tiger habitat zone.",
                is_verified=False,
                community_name="Vilas Commercial Retreat"
            )
            db.add(rej_host)
            db.commit()
            db.refresh(rej_host)
            print("  [OK] Created Rejected Host: rejected.host@test.local")
        else:
            rej_host.password_hash = auth.hash_password("Host@123")
            rej_host.approval_status = "rejected"
            rej_host.is_verified = False
            db.commit()
            print("  [OK] Reset Rejected Host: rejected.host@test.local")

        # 5. TOURIST ACCOUNT
        tourist_user = db.query(models.User).filter(models.User.email == "tourist@test.local").first()
        if not tourist_user:
            tourist_user = models.User(
                name="Test Tourist",
                email="tourist@test.local",
                role="tourist",
                password_hash=auth.hash_password("Tourist@123"),
                approval_status="approved",
                is_verified=True
            )
            db.add(tourist_user)
            db.commit()
            db.refresh(tourist_user)
            print("  [OK] Created Tourist: tourist@test.local")
        else:
            tourist_user.password_hash = auth.hash_password("Tourist@123")
            tourist_user.approval_status = "approved"
            tourist_user.is_verified = True
            db.commit()
            print("  [OK] Updated Tourist: tourist@test.local")

        # Demo fallback tourist
        tourist_demo = db.query(models.User).filter(models.User.email == "tourist@vanantara.org").first()
        if not tourist_demo:
            tourist_demo = models.User(
                name="Aarya Sharma",
                email="tourist@vanantara.org",
                role="tourist",
                password_hash=auth.hash_password("password123"),
                approval_status="approved",
                is_verified=True
            )
            db.add(tourist_demo)
            db.commit()

        # 6. SEED PROPERTIES FOR APPROVED HOST
        prop1 = db.query(models.Location).filter(models.Location.title == "Kerala Backwater Retreat").first()
        if not prop1:
            prop1 = models.Location(
                title="Kerala Backwater Retreat",
                tagline="Floating Solar Catamaran Eco-Lodge",
                description="Zero emission backwater eco-stay surrounded by native mangrove bird sanctuaries.",
                location="Kumarakom, Kerala",
                region="Vembanad Lake",
                category="Coastal",
                price=12000.0,
                status="Live",
                max_daily_capacity=12,
                latitude=9.60,
                longitude=76.40,
                image_urls=["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"],
                cover_image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
                sustainability_score=96,
                sustainability_highlights=["Solar Powered Boats", "Zero Plastic", "Organic Kitchen"],
                owner_id=app_host.id
            )
            db.add(prop1)

        prop2 = db.query(models.Location).filter(models.Location.title == "Wayanad Forest Stay").first()
        if not prop2:
            prop2 = models.Location(
                title="Wayanad Forest Stay",
                tagline="High Canopy Biodiversity Reserve",
                description="Off-grid sustainable timber treehouse in protected elephant migratory buffer zone.",
                location="Wayanad, Kerala",
                region="Western Ghats",
                category="Mountain",
                price=8500.0,
                status="Live",
                max_daily_capacity=15,
                latitude=11.68,
                longitude=76.13,
                image_urls=["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"],
                cover_image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
                sustainability_score=94,
                sustainability_highlights=["Native Stewards", "100% Rainwater Harvesting"],
                owner_id=app_host.id
            )
            db.add(prop2)

        # 7. SEED PENDING PROPERTY
        prop_pending = db.query(models.Location).filter(models.Location.title == "Silent Valley Canopy Lodge").first()
        if not prop_pending:
            prop_pending = models.Location(
                title="Silent Valley Canopy Lodge",
                tagline="Endemic Rainforest Sanctuary",
                description="Low footprint bamboo pavilion awaiting government environmental carrying audit.",
                location="Palakkad, Kerala",
                region="Western Ghats",
                category="Canopy",
                price=9500.0,
                status="Pending",
                max_daily_capacity=10,
                latitude=11.10,
                longitude=76.40,
                image_urls=["https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80"],
                cover_image="https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80",
                sustainability_score=92,
                sustainability_highlights=["Solar Power Grid", "Waste Diversion"],
                owner_id=app_host.id
            )
            db.add(prop_pending)

        # 8. SEED REJECTED PROPERTY
        prop_rejected = db.query(models.Location).filter(models.Location.title == "High-Rise Tent Resort").first()
        if not prop_rejected:
            prop_rejected = models.Location(
                title="High-Rise Tent Resort",
                tagline="Commercial Glamping Complex",
                description="High density resort proposal rejected due to habitat disruption.",
                location="Palakkad, Kerala",
                region="Western Ghats",
                category="Mountain",
                price=18000.0,
                status="Rejected",
                rejection_reason="Exceeds maximum allowable daily carrying capacity for core elephant corridor (80 guests > 15 limit).",
                max_daily_capacity=80,
                latitude=11.15,
                longitude=76.45,
                image_urls=["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"],
                cover_image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                sustainability_score=60,
                sustainability_highlights=["Diesel Generator"],
                owner_id=rej_host.id
            )
            db.add(prop_rejected)

        db.commit()

        # 9. SEED TOURIST BOOKINGS
        prop1 = db.query(models.Location).filter(models.Location.title == "Kerala Backwater Retreat").first()
        prop2 = db.query(models.Location).filter(models.Location.title == "Wayanad Forest Stay").first()

        b1 = db.query(models.Booking).filter(models.Booking.stay_dates == "Sep 10 - Sep 12, 2026", models.Booking.tourist_id == tourist_user.id).first()
        if not b1 and prop1:
            b1 = models.Booking(
                date="2026-09-10",
                stay_dates="Sep 10 - Sep 12, 2026",
                guests_count=2,
                customer_name=tourist_user.name,
                customer_email=tourist_user.email,
                status="Confirmed",
                total_amount=24000.0,
                host_revenue=22080.0,
                conservation_fund=1200.0,
                platform_fee=720.0,
                tourist_id=tourist_user.id,
                location_id=prop1.id
            )
            db.add(b1)

        b2 = db.query(models.Booking).filter(models.Booking.stay_dates == "Sep 15 - Sep 18, 2026", models.Booking.tourist_id == tourist_user.id).first()
        if not b2 and prop2:
            b2 = models.Booking(
                date="2026-09-15",
                stay_dates="Sep 15 - Sep 18, 2026",
                guests_count=3,
                customer_name=tourist_user.name,
                customer_email=tourist_user.email,
                status="Confirmed",
                total_amount=25500.0,
                host_revenue=23460.0,
                conservation_fund=1275.0,
                platform_fee=765.0,
                tourist_id=tourist_user.id,
                location_id=prop2.id
            )
            db.add(b2)

        b3 = db.query(models.Booking).filter(models.Booking.stay_dates == "Aug 01 - Aug 03, 2026", models.Booking.tourist_id == tourist_user.id).first()
        if not b3 and prop1:
            b3 = models.Booking(
                date="2026-08-01",
                stay_dates="Aug 01 - Aug 03, 2026",
                guests_count=1,
                customer_name=tourist_user.name,
                customer_email=tourist_user.email,
                status="Cancelled",
                total_amount=12000.0,
                host_revenue=0.0,
                conservation_fund=0.0,
                platform_fee=0.0,
                tourist_id=tourist_user.id,
                location_id=prop1.id
            )
            db.add(b3)

        db.commit()

        # 10. SEED NOTIFICATIONS
        # Approved Host Notifications
        if not db.query(models.Notification).filter(models.Notification.user_id == app_host.id, models.Notification.title == "New Booking Confirmed").first():
            db.add(models.Notification(
                user_id=app_host.id,
                title="New Booking Confirmed",
                message="Test Tourist booked 'Kerala Backwater Retreat' for Sep 10 - Sep 12.",
                type="booking",
                timestamp="2 hours ago"
            ))

        if not db.query(models.Notification).filter(models.Notification.user_id == app_host.id, models.Notification.title == "Property Approved & Live").first():
            db.add(models.Notification(
                user_id=app_host.id,
                title="Property Approved & Live",
                message="Your sanctuary 'Wayanad Forest Stay' has been verified by Government Council and is live.",
                type="property",
                timestamp="Yesterday"
            ))

        # Government Notifications
        if not db.query(models.Notification).filter(models.Notification.user_id == gov.id, models.Notification.title == "New Host Application Pending").first():
            db.add(models.Notification(
                user_id=gov.id,
                title="New Host Application Pending",
                message="Host 'Test Pending Host' (pending.host@test.local) registered and requires accreditation review.",
                type="application",
                timestamp="3 hours ago"
            ))

        if not db.query(models.Notification).filter(models.Notification.user_id == gov.id, models.Notification.title == "New Property Application Submitted").first():
            db.add(models.Notification(
                user_id=gov.id,
                title="New Property Application Submitted",
                message="Property proposal 'Silent Valley Canopy Lodge' was submitted for verification.",
                type="application",
                timestamp="5 hours ago"
            ))

        # Tourist Notifications
        if not db.query(models.Notification).filter(models.Notification.user_id == tourist_user.id, models.Notification.title == "Booking Confirmed").first():
            db.add(models.Notification(
                user_id=tourist_user.id,
                title="Booking Confirmed",
                message="Your booking for 'Kerala Backwater Retreat' (Sep 10 - Sep 12) has been confirmed.",
                type="booking",
                timestamp="2 hours ago"
            ))

        db.commit()
        print("[DONE] Deterministic test dataset seeded successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_test_data()
