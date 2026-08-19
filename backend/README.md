# Eco-Cultural Tourism Platform (Backend MVP) 🌿

## Overview
This repository contains the core backend infrastructure for the Eco-Tourism platform. Built with a focus on sustainable travel and community empowerment, this API powers an automated **Marketplace and Benefit-Distribution System (MBDS)**. 

The architecture aligns closely with UN Sustainable Development Goals (specifically Climate Action and Reduced Inequalities) by enforcing strict ecological carrying capacities, executing Haversine-based geographic redirections to prevent over-tourism, and automating transparent financial routing directly to local communities and conservation funds.

## Tech Stack
* **Framework:** FastAPI (Python)
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Validation:** Pydantic
* **Authentication:** JWT (JSON Web Tokens)

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+
* PostgreSQL (pgAdmin recommended for local management)
* Git

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/eco-tourism-api.git](https://github.com/YOUR_USERNAME/eco-tourism-api.git)
   cd eco-tourism-api

2. **Create and activate a virtual environment:**
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

```

3. **Install dependencies:**
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-jose

```


4. **Database Configuration:** Ensure your PostgreSQL server is running and update your database connection string in `app/database.py` (or `.env`).

5. **Start the server:**
```bash
uvicorn app.main:app --reload

```


6. **Access the API Documentation:**
Navigate to `http://127.0.0.1:8000/docs` to view the interactive Swagger UI.

---

## 🗄️ Database Schema

The platform relies on three primary PostgreSQL tables:

1. **Users Table (`users`)**:
* Stores account details, roles (`Admin`, `Host`, `Tourist`), and contact info.
* `is_verified` (Boolean): Enforces admin approval before a Host can upload locations.
* `upi_id` (String): Simulated payment routing for local hosts.


2. **Locations Table (`locations`)**:
* Stores core listing data including `title`, `description`, `max_daily_capacity`, `latitude`, and `longitude`.
* `image_urls` (JSON Array): Stores internet links to listing images.
* `status` (String): Defaults to `Pending`; must be set to `Live` by an Admin.


3. **Bookings Table (`bookings`)**:
* The transactional ledger.
* Records `tourist_id`, `location_id`, `date`, and the exact MBDS financial split (`host_revenue`, `conservation_fund`, `platform_fee`).



---

## 🗺️ System Workflows

### 1. Community (Local Host) Flow

`Create Account` $\rightarrow$ `Verified by Admin` $\rightarrow$ `Login` $\rightarrow$ `Upload Locations (Images & Text)` $\rightarrow$ `View Earnings Dashboard` $\rightarrow$ `System Auto-Accepts Bookings`

### 2. Tourist Flow

`Create Account` $\rightarrow$ `Login` $\rightarrow$ `Browse Live Locations` $\rightarrow$ `Backend Capacity Check (Pass/Fail + 15km Redirect)` $\rightarrow$ `Transparent Checkout (Shows 8% split)` $\rightarrow$ `Simulates UPI Payment` $\rightarrow$ `Booking Confirmation`

### 3. Admin (Governance) Flow

`Login` $\rightarrow$ `Verify Communities (Hosts)` $\rightarrow$ `Verify/Approve Locations` $\rightarrow$ `View Governance Dashboard (Fund Totals & Capacity Alerts)`

---

## 🔌 API Endpoints Reference

### Authentication Module

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/test-login` | Generates a JWT access token based on provided credentials and role. | Public |
| **POST** | `/register` | Creates a new user account (Tourist, Host, or Admin). | Public |

### Admin (Governance) Module

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **PATCH** | `/admin/approve-host/{user_id}` | Verifies a Host account (`is_verified = True`), unlocking their upload ability. | Admin |
| **PATCH** | `/admin/approve-location/{id}` | Updates a location status from `Pending` to `Live`. | Admin |
| **GET** | `/admin/governance-overview` | Aggregates the 5% Conservation Fund and flags overbooked (0-capacity) sites. | Admin |

### Community (Host) Module

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/community/upload-location` | Submits a new location. Defaults to `Pending` status. Blocks unverified accounts. | Verified Host |
| **GET** | `/dashboard/analytics` | Returns total direct revenue (92% split) and a count of upcoming tourist arrivals. | Verified Host |

### Tourist (Booking) Module

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **GET** | `/tourist/catalog` | Fetches all active locations explicitly marked as `Live` by an Admin. | Tourist |
| **POST** | `/tourist/book-itinerary` | Core MBDS Engine. Executes capacity checks, 15km redirects, and 8% fee calculations. | Tourist |

---

## 💻 Frontend Integration Guide

This API is designed to return clean, predictable JSON structures to seamlessly integrate with modern React/Flutter components. Devesh, as the lead Frontend Developer, can utilize the following standard payload structures to map data directly into UI components like Bento Grids, checkout modals, and analytics dashboards.

### 1. Uploading a Location (Community)

The frontend form must submit images as an array of string URLs.
**POST Payload to `/community/upload-location`:**

```json
{
  "title": "Ancient Waterfall Trek",
  "description": "A guided trek through the historic valley.",
  "max_daily_capacity": 20,
  "latitude": 18.756,
  "longitude": 73.412,
  "image_urls": [
    "[https://example.com/waterfall1.jpg](https://example.com/waterfall1.jpg)",
    "[https://example.com/waterfall2.jpg](https://example.com/waterfall2.jpg)"
  ]
}

```

### 2. Successful Booking / Checkout Breakdown (Tourist)

When a location has available capacity, the backend instantly calculates the checkout math for the UI modal.
**Response from `/tourist/book-itinerary`:**

```json
{
  "status": "proceed_to_checkout",
  "financial_breakdown": {
    "total_price": 1000.0,
    "platform_fee_3_percent": 30.0,
    "conservation_fund_5_percent": 50.0,
    "host_direct_revenue_92_percent": 920.0
  }
}

```

### 3. Capacity Rejection & Redirection (Tourist)

If a location reaches its `max_daily_capacity`, the backend prevents the booking and returns a `400 Bad Request` alongside a dynamically generated list of alternative `Live` locations within a 15km radius (calculated via the Haversine formula).
**Error Response from `/tourist/book-itinerary`:**

```json
{
  "detail": "Capacity exceeded for this date.",
  "alternatives": [
    {
      "id": 8,
      "title": "Hidden Valley Trail",
      "distance_km": 4.2
    },
    {
      "id": 12,
      "title": "Sunrise Peak Tour",
      "distance_km": 11.5
    }
  ]
}

```

### 4. Admin Dashboard Alerts (Admin)

The governance endpoint will actively shift its status if any location hits zero capacity, allowing the frontend to conditionally render alert banners.
**Response from `/admin/governance-overview`:**

```json
{
  "total_community_conservation_fund": 50.0,
  "platform_status": "Attention Required",
  "flagged_locations": [
    {
      "id": 4,
      "title": "Fragile Coral Reef",
      "issue": "Zero Capacity / Overbooked"
    }
  ]
}

```