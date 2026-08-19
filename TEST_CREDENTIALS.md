# Eco-Tourism Test Credentials & QA Guide

This document contains **local development and QA testing credentials** for testing every role and workflow in the Eco-Tourism application.

---

## Local Environment URLs

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **FastAPI Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Test Accounts

### 1. Government Admin
- **Role**: Government
- **Name**: Test Government Admin
- **Email**: `government@test.local`
- **Password**: `Government@123`
- **Status**: Approved / Accredited
- **Permissions**: Full government portal access, host verification, property approval/rejection, portal-wide bookings, governance overview.

### 2. Approved Host
- **Role**: Host
- **Name**: Test Approved Host
- **Email**: `approved.host@test.local`
- **Password**: `Host@123`
- **Status**: Approved (`approval_status = "approved"`, `is_verified = True`)
- **Permissions**: Host dashboard access, property registration (`/host/new-location`), view own properties, view bookings for own properties, view host analytics.

### 3. Pending Host
- **Role**: Host
- **Name**: Test Pending Host
- **Email**: `pending.host@test.local`
- **Password**: `Host@123`
- **Status**: Pending (`approval_status = "pending"`, `is_verified = False`)
- **Permissions**: Cannot log in until Government approves. Attempting login presents **"Application Under Review"**.

### 4. Rejected Host
- **Role**: Host
- **Name**: Test Rejected Host
- **Email**: `rejected.host@test.local`
- **Password**: `Host@123`
- **Status**: Rejected (`approval_status = "rejected"`, `is_verified = False`)
- **Permissions**: Cannot log in. Attempting login presents **"Host Application Not Approved"** with council review note.

### 5. Tourist
- **Role**: Tourist
- **Name**: Test Tourist
- **Email**: `tourist@test.local`
- **Password**: `Tourist@123`
- **Status**: Approved (`approval_status = "approved"`, `is_verified = True`)
- **Permissions**: Browse live eco-properties (`/destinations`), book itineraries, view transparent financial split, receive alternative recommendations when capacity is exceeded.

---

## Test Scenarios & Expected Access Matrix

| Account Email | Role | Expected Access State |
| :--- | :--- | :--- |
| `government@test.local` | Government | Government Dashboard (`/government`), Hosts accreditation (`/government/hosts`), Properties review (`/government/properties`) |
| `approved.host@test.local` | Host | Host Dashboard (`/host`), Property upload (`/host/new-location`), Host bookings (`/host/bookings`) |
| `pending.host@test.local` | Host | Login Denied (`403`) → **Application Under Review** Screen |
| `rejected.host@test.local` | Host | Login Denied (`403`) → **Host Application Not Approved** Screen |
| `tourist@test.local` | Tourist | Public Tourist Catalog (`/destinations`), Bookings (`/destinations/[id]/book`) |

---

## Recommended E2E Workflow Test

1. **Login as Government**:
   - Email: `government@test.local` | Password: `Government@123`
   - Navigate to `/government/hosts`.
   - Locate pending host **Test Pending Host** (`pending.host@test.local`).

2. **Approve Pending Host**:
   - Click **Approve**.
   - Verify status updates from `Pending Review` to `Approved`.

3. **Login as Newly Approved Host**:
   - Log out from Government.
   - Go to `/login`, select **Host** role.
   - Enter `pending.host@test.local` | Password: `Host@123`.
   - Confirm login succeeds and redirects to `/host`.

4. **Host Property Registration**:
   - Click **List New Property** (`/host/new-location`).
   - Fill title, capacity, and price, then submit.
   - Verify status displays as `Pending`.

5. **Government Property Review & Approval**:
   - Log in as Government (`government@test.local`).
   - Go to `/government/properties`, locate the pending application.
   - Click **Approve**.

6. **Tourist Catalog & Booking**:
   - Log in as Tourist (`tourist@test.local` | Password: `Tourist@123`).
   - Open `/destinations`. Verify the newly approved property appears.
   - Click **Book Itinerary**, select dates, and complete checkout.

7. **Host & Government Verification**:
   - Log in as Host -> verify the new booking appears under `/host/bookings`.
   - Log in as Government -> verify the new booking and revenue are reflected in `/government/bookings` and `/government` analytics charts.

---

## Seeding & Resetting Test Data

To reset or seed test accounts and data at any time:

```bash
cd backend
python seed_test_data.py
```

Running this command creates any missing test accounts/properties/bookings, resets pending/rejected account states, and ensures the database contains a clean, deterministic dataset for QA testing.
