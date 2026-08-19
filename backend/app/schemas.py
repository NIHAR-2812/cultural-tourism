from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any

# Authentication & User Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str = "password123"
    role: str = "tourist" # 'tourist', 'host', 'government'
    phone_number: Optional[str] = None
    community_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str = "password123"
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_verified: bool
    approval_status: str
    rejection_reason: Optional[str] = None
    community_name: Optional[str] = None
    joined_date: Optional[str] = None

    model_config = {"from_attributes": True}

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class HostApprovalUpdate(BaseModel):
    user_id: int
    status: str # 'approved' | 'rejected'
    reason: Optional[str] = None

# Location / Property Schemas
class LocationCreate(BaseModel):
    title: str
    description: str
    tagline: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = 1000.0
    max_capacity: Optional[int] = 10
    max_daily_capacity: Optional[int] = 10
    latitude: float = 0.0
    longitude: float = 0.0
    images: Optional[List[str]] = []
    image_urls: Optional[List[str]] = []
    sustainability_highlights: Optional[List[str]] = []

class LocationResponse(BaseModel):
    id: str
    title: str
    tagline: Optional[str] = None
    description: str
    location: Optional[str] = None
    region: Optional[str] = None
    category: Optional[str] = None
    price: float = 1000.0
    status: str
    maxCapacity: int
    max_daily_capacity: int
    currentCapacity: int = 0
    latitude: float = 0.0
    longitude: float = 0.0
    images: List[str] = []
    image_urls: List[str] = []
    coverImage: Optional[str] = None
    sustainabilityScore: int = 90
    sustainabilityHighlights: List[str] = []
    rejectionReason: Optional[str] = None
    ownerId: Optional[str] = None
    submittedDate: Optional[str] = None

    model_config = {"from_attributes": True}

# Booking Schemas
class BookingCreate(BaseModel):
    location_id: Any
    date: Optional[str] = None # YYYY-MM-DD
    stay_dates: Optional[str] = None
    guests_count: Optional[int] = 1

class AlternativeLocation(BaseModel):
    id: str
    title: str
    location: Optional[str] = None
    distanceKm: float
    coverImage: Optional[str] = None
    sustainabilityScore: int = 90
    currentCapacity: int = 0
    maxCapacity: int = 10
    price: float = 1000.0
    reason: str = "Nearby ecological sanctuary"

class FinancialBreakdown(BaseModel):
    basePrice: float
    platformFee: float
    conservationFund: float
    hostRevenue: float
    totalCharge: float

class CheckoutResponse(BaseModel):
    status: str
    booking_id: Optional[int] = None
    message: str
    financials: Optional[FinancialBreakdown] = None
    alternatives_within_15km: Optional[List[AlternativeLocation]] = None

class HostBookingResponse(BaseModel):
    id: str
    propertyId: str
    propertyName: str
    hostName: Optional[str] = None
    customerName: str
    customerEmail: Optional[str] = None
    bookingDate: str
    stayDates: str
    guestsCount: int
    status: str
    payoutAmount: float

    model_config = {"from_attributes": True}

# Analytics Schemas
class HostAnalyticsResponse(BaseModel):
    totalEarnings: str
    communityWagesPaid: str
    treesPlantedCount: int
    carbonOffsetTotalKg: int
    upcomingBookings: List[HostBookingResponse]

class GovernanceOverviewResponse(BaseModel):
    destinationsMonitored: int
    pendingHostApprovalsCount: int
    pendingLocationApprovalsCount: int
    conservationFundCollected: str
    hectaresProtected: int
    plasticDivertedKg: int
    platformStatus: str
    flaggedLocations: List[dict]
    capacityAlerts: List[dict]

# Notification Schema
class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    timestamp: str
    isRead: bool
    type: str

    model_config = {"from_attributes": True}