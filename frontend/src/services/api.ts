'use client';

import { DESTINATIONS, Destination, ALTERNATIVE_RECOMMENDATIONS } from '@/components/data/mock-data';

export type UserRole = 'tourist' | 'host' | 'admin' | 'government';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  community_name?: string;
  joined_date?: string;
}

export interface LocationPayload {
  title: string;
  description: string;
  max_capacity: number;
  latitude: number;
  longitude: number;
  images: string[];
  price: number;
  category: string;
  location: string;
}

export interface BookingBreakdown {
  basePrice: number;
  platformFee: number; // 3%
  conservationFund: number; // 5%
  hostRevenue: number; // 92%
  totalCharge: number;
}

export interface AlternativeLocation {
  id: string;
  title: string;
  location: string;
  distanceKm: number;
  coverImage: string;
  sustainabilityScore: number;
  currentCapacity: number;
  maxCapacity: number;
  price: number;
  reason: string;
}

export interface BookItineraryResponse {
  status: 'proceed_to_checkout' | 'capacity_exceeded';
  message?: string;
  breakdown?: BookingBreakdown;
  alternatives_within_15km?: AlternativeLocation[];
}

export interface HostAnalyticsResponse {
  totalEarnings: string;
  communityWagesPaid: string;
  treesPlantedCount: number;
  carbonOffsetTotalKg: number;
  upcomingBookings: Array<{
    id: string;
    guestName: string;
    dates: string;
    guests: number;
    payout: string;
    status: string;
  }>;
}

export interface GovernanceOverviewResponse {
  destinationsMonitored: number;
  pendingHostApprovalsCount: number;
  pendingLocationApprovalsCount: number;
  approvedLocationsCount?: number;
  rejectedLocationsCount?: number;
  conservationFundCollected: string;
  hectaresProtected: number;
  plasticDivertedKg: number;
  platformStatus: 'Optimal' | 'Attention Required';
  flaggedLocations: Array<{ id: string; name: string; reason: string }>;
  capacityAlerts: Array<{ zone: string; status: string; percent: number }>;
}

export interface HostBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  hostName?: string;
  customerName: string;
  customerEmail?: string;
  bookingDate: string;
  stayDates: string;
  guestsCount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Confirmed';
  payoutAmount: number;
}

export interface HostNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'property' | 'booking' | 'system';
}

export interface GovernmentNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'application' | 'alert' | 'system';
}

export interface MonthlyBookingActivity {
  month: string;
  bookingsCount: number;
  revenueGenerated: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cultural-tourism-pjet.onrender.com";

class StorageService {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('vanantara_jwt_token');
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vanantara_jwt_token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vanantara_jwt_token');
      localStorage.removeItem('vanantara_current_user');
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('vanantara_current_user');
    if (!data) return null;
    try { return JSON.parse(data); } catch (_) { return null; }
  }

  setCurrentUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vanantara_current_user', JSON.stringify(user));
    }
  }
}

export const apiStorage = new StorageService();

// Helper for making authorized fetch requests
async function customFetch(endpoint: string, options: RequestInit = {}) {
  const token = apiStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    apiStorage.clearToken();
  }

  return res;
}

export const ApiClient = {
  // Auth API
  async register(role: UserRole, email: string, name: string): Promise<{ success: boolean; user: User; token?: string; status: 'pending' | 'approved' }> {
    try {
      const res = await customFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ role, email, name, password: 'password123' }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.access_token) {
          apiStorage.setToken(data.access_token);
          apiStorage.setCurrentUser(data.user);
        }
        return {
          success: true,
          user: data.user,
          token: data.access_token,
          status: data.status === 'pending' ? 'pending' : 'approved',
        };
      }
      return { success: false, user: data.user, status: 'pending' };
    } catch (err) {
      console.error('Registration API error:', err);
      throw err;
    }
  },

  async testLogin(role: UserRole, email?: string): Promise<{ success: boolean; user?: User; token?: string; error?: string; reason?: string }> {
    try {
      const res = await customFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ role, email: email || `${role}@vanantara.org`, password: 'password123' }),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.access_token) {
          apiStorage.setToken(data.access_token);
          apiStorage.setCurrentUser(data.user);
        }
        return { success: true, user: data.user, token: data.access_token };
      }

      if (res.status === 403) {
        const detailStr = typeof data.detail === 'string' ? data.detail : '';
        if (detailStr.includes('HOST_PENDING_APPROVAL')) {
          return { success: false, error: 'HOST_PENDING_APPROVAL' };
        }
        if (detailStr.includes('HOST_REJECTED')) {
          const reason = detailStr.split('HOST_REJECTED:')[1] || 'Host application was not approved.';
          return { success: false, error: 'HOST_REJECTED', reason };
        }
      }

      return { success: false, error: 'INVALID_CREDENTIALS' };
    } catch (err) {
      console.error('Login API error:', err);
      return { success: false, error: 'NETWORK_ERROR' };
    }
  },

  // Government / Admin API Methods
  async getGovernmentStats() {
    try {
      const overview = await this.getGovernanceOverview();
      return {
        totalApplications: overview.destinationsMonitored,
        pendingApplications: overview.pendingLocationApprovalsCount,
        approvedApplications: overview.approvedLocationsCount || 5,
        rejectedApplications: overview.rejectedLocationsCount || 1,
        statusDistribution: [
          { name: 'Pending Review', value: overview.pendingLocationApprovalsCount, color: '#A65A3A' },
          { name: 'Approved / Live', value: overview.approvedLocationsCount || 5, color: '#5F6B4F' },
          { name: 'Rejected', value: overview.rejectedLocationsCount || 1, color: '#8C2E2E' },
        ],
        monthlyBookings: [
          { month: 'Mar 2026', bookingsCount: 14, revenueGenerated: 168000 },
          { month: 'Apr 2026', bookingsCount: 19, revenueGenerated: 228000 },
          { month: 'May 2026', bookingsCount: 24, revenueGenerated: 288000 },
          { month: 'Jun 2026', bookingsCount: 18, revenueGenerated: 216000 },
          { month: 'Jul 2026', bookingsCount: 31, revenueGenerated: 372000 },
          { month: 'Aug 2026', bookingsCount: 42, revenueGenerated: 504000 },
        ],
      };
    } catch (_) {
      return {
        totalApplications: 6,
        pendingApplications: 1,
        approvedApplications: 4,
        rejectedApplications: 1,
        statusDistribution: [],
        monthlyBookings: [],
      };
    }
  },

  async getBookingSalesAnalytics(range: '7D' | '30D' | '3M' | '1Y' = '30D') {
    if (range === '7D') {
      return [
        { label: 'Aug 11', bookings: 3, revenue: 36000 },
        { label: 'Aug 12', bookings: 5, revenue: 60000 },
        { label: 'Aug 13', bookings: 4, revenue: 48000 },
        { label: 'Aug 14', bookings: 7, revenue: 84000 },
        { label: 'Aug 15', bookings: 9, revenue: 108000 },
        { label: 'Aug 16', bookings: 6, revenue: 72000 },
        { label: 'Aug 17', bookings: 8, revenue: 96000 },
      ];
    }
    if (range === '30D') {
      return [
        { label: 'Jul 20', bookings: 12, revenue: 144000 },
        { label: 'Jul 25', bookings: 18, revenue: 216000 },
        { label: 'Jul 30', bookings: 15, revenue: 180000 },
        { label: 'Aug 04', bookings: 22, revenue: 264000 },
        { label: 'Aug 09', bookings: 28, revenue: 336000 },
        { label: 'Aug 14', bookings: 35, revenue: 420000 },
        { label: 'Aug 17', bookings: 42, revenue: 504000 },
      ];
    }
    return [
      { label: 'Jun 2026', bookings: 18, revenue: 216000 },
      { label: 'Jul 2026', bookings: 31, revenue: 372000 },
      { label: 'Aug 2026', bookings: 42, revenue: 504000 },
    ];
  },

  async getPendingHosts(): Promise<User[]> {
    try {
      const res = await customFetch('/admin/pending-hosts');
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  async getAllHosts(filter: string = 'All'): Promise<User[]> {
    try {
      const res = await customFetch('/admin/all-hosts');
      if (res.ok) {
        const hosts: User[] = await res.json();
        return hosts.filter((u) => {
          if (filter === 'All') return true;
          if (filter === 'Pending') return u.approval_status === 'pending' || !u.is_verified;
          if (filter === 'Approved') return u.approval_status === 'approved' && u.is_verified;
          if (filter === 'Rejected') return u.approval_status === 'rejected';
          return true;
        });
      }
    } catch (_) {}
    return [];
  },

  async approveHost(userId: string): Promise<User | null> {
    try {
      const res = await customFetch(`/admin/approve-host/${userId}`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (_) {}
    return null;
  },

  async rejectHost(userId: string, reason?: string): Promise<User | null> {
    try {
      const res = await customFetch(`/admin/reject-host/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: reason || 'Does not meet environmental carrying capacity standards.' }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (_) {}
    return null;
  },

  async getPendingLocations(): Promise<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected' }>> {
    try {
      const res = await customFetch('/admin/pending-locations');
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  async approveLocation(locationId: string): Promise<Destination | null> {
    try {
      const res = await customFetch(`/admin/approve-location/${locationId}`, { method: 'PATCH' });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  async rejectLocation(locationId: string, reason?: string): Promise<Destination | null> {
    try {
      const res = await customFetch(`/admin/reject-location/${locationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  async getAllProperties(filter: string = 'All', search: string = '') {
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        customFetch('/admin/approved-locations'),
        customFetch('/admin/pending-locations'),
      ]);
      let all: any[] = [];
      if (approvedRes.ok) all = all.concat(await approvedRes.json());
      if (pendingRes.ok) all = all.concat(await pendingRes.json());

      return all.filter((loc) => {
        const matchesFilter =
          filter === 'All'
            ? true
            : filter === 'Approved'
            ? loc.status === 'Live'
            : loc.status === filter;

        const matchesSearch =
          search === '' ||
          loc.title.toLowerCase().includes(search.toLowerCase()) ||
          (loc.host && loc.host.name && loc.host.name.toLowerCase().includes(search.toLowerCase())) ||
          (loc.location && loc.location.toLowerCase().includes(search.toLowerCase()));

        return matchesFilter && matchesSearch;
      });
    } catch (_) {
      return [];
    }
  },

  async getAllPortalBookings(filter: string = 'All', propertyId: string = 'All', search: string = ''): Promise<HostBooking[]> {
    try {
      const res = await customFetch('/admin/bookings');
      if (res.ok) {
        const bookings: HostBooking[] = await res.json();
        return bookings.filter((bkg) => {
          const matchesFilter = filter === 'All' || bkg.status === filter;
          const matchesProp = propertyId === 'All' || bkg.propertyId === propertyId;
          const matchesSearch =
            search === '' ||
            bkg.propertyName.toLowerCase().includes(search.toLowerCase()) ||
            bkg.customerName.toLowerCase().includes(search.toLowerCase()) ||
            (bkg.hostName && bkg.hostName.toLowerCase().includes(search.toLowerCase())) ||
            bkg.id.toLowerCase().includes(search.toLowerCase());

          return matchesFilter && matchesProp && matchesSearch;
        });
      }
    } catch (_) {}
    return [];
  },

  async getGovernmentNotifications(): Promise<GovernmentNotification[]> {
    try {
      const res = await customFetch('/notifications');
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  async markGovNotificationRead(id: string) {
    try {
      await customFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch (_) {}
  },

  // Host Methods
  async getHostProperties(): Promise<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected' }>> {
    try {
      const res = await customFetch('/community/properties');
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  async getPropertyById(id: string) {
    const props = await this.getHostProperties();
    return props.find((l) => l.id === id);
  },

  async getHostBookings(filter: string = 'All', search: string = ''): Promise<HostBooking[]> {
    try {
      const res = await customFetch('/community/bookings');
      if (res.ok) {
        const bookings: HostBooking[] = await res.json();
        return bookings.filter((b) => {
          const matchesFilter = filter === 'All' || b.status === filter;
          const matchesSearch =
            search === '' ||
            b.propertyName.toLowerCase().includes(search.toLowerCase()) ||
            b.customerName.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase());
          return matchesFilter && matchesSearch;
        });
      }
    } catch (_) {}
    return [];
  },

  async getBookingById(id: string): Promise<HostBooking | undefined> {
    const bookings = await this.getHostBookings();
    return bookings.find((b) => b.id === id);
  },

  async getHostNotifications(): Promise<HostNotification[]> {
    try {
      const res = await customFetch('/notifications');
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  async markNotificationRead(id: string) {
    try {
      await customFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch (_) {}
  },

  async getHostStats() {
    try {
      const props = await this.getHostProperties();
      const bookings = await this.getHostBookings();
      return {
        totalProperties: props.length,
        pendingApprovals: props.filter((p) => p.status === 'Pending').length,
        acceptedProperties: props.filter((p) => p.status === 'Live').length,
        totalBookings: bookings.length,
        upcomingBookings: bookings.filter((b) => b.status === 'Upcoming' || b.status === 'Confirmed').length,
      };
    } catch (_) {
      return { totalProperties: 0, pendingApprovals: 0, acceptedProperties: 0, totalBookings: 0, upcomingBookings: 0 };
    }
  },

  async getGovernanceOverview(): Promise<GovernanceOverviewResponse> {
    try {
      const res = await customFetch('/admin/governance-overview');
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      destinationsMonitored: 8,
      pendingHostApprovalsCount: 1,
      pendingLocationApprovalsCount: 1,
      conservationFundCollected: '₹14,85,000',
      hectaresProtected: 14200,
      plasticDivertedKg: 8900,
      platformStatus: 'Optimal',
      flaggedLocations: [],
      capacityAlerts: [],
    };
  },

  async uploadLocation(payload: LocationPayload): Promise<Destination & { status: 'Pending' | 'Live' | 'Rejected' }> {
    try {
      const res = await customFetch('/community/upload-location', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
      const errData = await res.json();
      throw new Error(errData.detail || 'Upload failed');
    } catch (err) {
      console.error('Upload location error:', err);
      throw err;
    }
  },

  async getHostAnalytics(): Promise<HostAnalyticsResponse> {
    try {
      const res = await customFetch('/community/dashboard/analytics');
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      totalEarnings: '₹0',
      communityWagesPaid: '₹0',
      treesPlantedCount: 0,
      carbonOffsetTotalKg: 0,
      upcomingBookings: [],
    };
  },

  // Tourist API
  async getTouristCatalog(): Promise<Destination[]> {
    try {
      const res = await customFetch('/tourist/catalog');
      if (res.ok) return await res.json();
    } catch (_) {}
    return DESTINATIONS;
  },

  async bookItinerary(
    locationId: string,
    date: string,
    guestsCount: number = 1,
    stayDates?: string,
    customerName?: string,
    customerEmail?: string
  ): Promise<BookItineraryResponse> {
    try {
      const res = await customFetch('/tourist/book-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          location_id: locationId,
          date,
          guests_count: guestsCount,
          stay_dates: stayDates || date,
          customer_name: customerName,
          customer_email: customerEmail,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'proceed_to_checkout') {
          return {
            status: 'proceed_to_checkout',
            breakdown: data.financials,
          };
        } else if (data.status === 'capacity_exceeded') {
          return {
            status: 'capacity_exceeded',
            message: data.message,
            alternatives_within_15km: data.alternatives_within_15km,
          };
        }
      }
      return data;
    } catch (err) {
      console.error('Booking error:', err);
      throw err;
    }
  },
};
