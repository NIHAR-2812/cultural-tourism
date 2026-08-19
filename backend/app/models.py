from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    upi_id = Column(String, nullable=True)
    role = Column(String, nullable=False) # 'tourist', 'host', 'government', 'admin'
    approval_status = Column(String, default="pending") # 'pending', 'approved', 'rejected'
    rejection_reason = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    community_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    locations = relationship("Location", back_populates="owner")
    bookings = relationship("Booking", back_populates="tourist")
    notifications = relationship("Notification", back_populates="user")

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    tagline = Column(String, nullable=True)
    description = Column(String)
    location = Column(String, nullable=True) # e.g. "Kumarakom, Kerala"
    region = Column(String, nullable=True)
    category = Column(String, nullable=True)
    price = Column(Float, default=1000.0)
    status = Column(String, default="Pending") # "Pending", "Live", "Rejected"
    rejection_reason = Column(String, nullable=True)
    max_daily_capacity = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    image_urls = Column(JSON, nullable=True)
    cover_image = Column(String, nullable=True)
    sustainability_score = Column(Integer, default=90)
    sustainability_highlights = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="locations")
    bookings = relationship("Booking", back_populates="location")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True) # Format: YYYY-MM-DD
    stay_dates = Column(String, nullable=True)
    guests_count = Column(Integer, default=1)
    customer_name = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    status = Column(String, default="Confirmed") # Values: Confirmed, Cancelled, Rejected-Capacity
    total_amount = Column(Float)
    host_revenue = Column(Float)
    conservation_fund = Column(Float)
    platform_fee = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tourist_id = Column(Integer, ForeignKey("users.id"))
    tourist = relationship("User", back_populates="bookings")
    
    location_id = Column(Integer, ForeignKey("locations.id"))
    location = relationship("Location", back_populates="bookings")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(String, default="Just now")
    is_read = Column(Boolean, default=False)
    type = Column(String, default="system") # 'property', 'booking', 'system', 'application', 'alert'
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")