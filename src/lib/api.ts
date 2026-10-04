import {
  User,
  Member,
  Executive,
  EventItem,
  EventRegistration,
  AdmissionApplication,
  DashboardStats,
  PaginatedResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle unauthorized (401)
  if (response.status === 401 && typeof window !== 'undefined') {
    // Optional token refresh or logout
  }

  return response;
}

export const api = {
  // Auth
  auth: {
    async login(credentials: { email: string; password: string }) {
      const res = await fetch(`${API_BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed. Please check credentials.');
      return data;
    },

    async register(payload: { email: string; name: string; phone?: string; password: string; confirm_password: string }) {
      const res = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join('\n');
        throw new Error(errorMsg || 'Registration failed.');
      }
      return data;
    },

    async getProfile(): Promise<User> {
      const res = await fetchWithAuth('/auth/me/');
      if (!res.ok) throw new Error('Could not fetch user profile');
      return res.json();
    },
  },

  // Events
  events: {
    async getAll(params: Record<string, string | number> = {}): Promise<PaginatedResponse<EventItem>> {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE_URL}/events/${query ? `?${query}` : ''}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },

    async getFeatured(): Promise<EventItem[]> {
      const res = await fetch(`${API_BASE_URL}/events/featured/`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch featured events');
      return res.json();
    },

    async getBySlug(slug: string): Promise<EventItem> {
      const res = await fetch(`${API_BASE_URL}/events/${slug}/`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Event not found');
      return res.json();
    },

    async create(eventData: Partial<EventItem>): Promise<EventItem> {
      const res = await fetchWithAuth('/events/', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      return data;
    },

    async update(id: number, eventData: Partial<EventItem>): Promise<EventItem> {
      const res = await fetchWithAuth(`/events/id/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      return data;
    },

    async delete(id: number): Promise<void> {
      const res = await fetchWithAuth(`/events/id/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete event');
    },
  },

  // Members
  members: {
    async getAll(params: Record<string, string | number> = {}): Promise<PaginatedResponse<Member>> {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE_URL}/members/${query ? `?${query}` : ''}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    },

    async getById(id: number): Promise<Member> {
      const res = await fetch(`${API_BASE_URL}/members/${id}/`);
      if (!res.ok) throw new Error('Member not found');
      return res.json();
    },
  },

  // Executives
  executives: {
    async getAll(): Promise<PaginatedResponse<Executive>> {
      const res = await fetch(`${API_BASE_URL}/executives/`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch executives');
      return res.json();
    },
  },

  // Registrations
  registrations: {
    async create(data: {
      event: number;
      name: string;
      email: string;
      phone: string;
      member_id?: string;
      organization?: string;
      address?: string;
      additional_info?: string;
    }): Promise<EventRegistration> {
      const res = await fetchWithAuth('/registrations/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        const errorMsg = Object.entries(resData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join('\n');
        throw new Error(errorMsg || 'Failed to submit registration');
      }
      return resData;
    },

    async getMy(): Promise<PaginatedResponse<EventRegistration>> {
      const res = await fetchWithAuth('/registrations/my/');
      if (!res.ok) throw new Error('Failed to fetch user registrations');
      return res.json();
    },

    async getAllAdmin(params: Record<string, string | number> = {}): Promise<PaginatedResponse<EventRegistration>> {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetchWithAuth(`/registrations/all/${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch registrations');
      return res.json();
    },

    async updateStatus(id: number, status: string): Promise<EventRegistration> {
      const res = await fetchWithAuth(`/registrations/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },

    async verify(ticketNumber: string) {
      const res = await fetch(`${API_BASE_URL}/registrations/verify/${ticketNumber}/`);
      return res.json();
    },
  },

  // Admissions
  admissions: {
    async create(data: {
      full_name: string;
      email: string;
      phone: string;
      date_of_birth?: string;
      gender: string;
      address: string;
      profession: string;
      organization: string;
      nid_number: string;
      membership_type: string;
      photo_url?: string;
    }): Promise<AdmissionApplication> {
      const res = await fetchWithAuth('/admissions/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        const errorMsg = Object.entries(resData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join('\n');
        throw new Error(errorMsg || 'Failed to submit admission application');
      }
      return resData;
    },

    async getMy(): Promise<PaginatedResponse<AdmissionApplication>> {
      const res = await fetchWithAuth('/admissions/my/');
      if (!res.ok) throw new Error('Failed to fetch my applications');
      return res.json();
    },

    async getStatus(appNumber: string) {
      const res = await fetch(`${API_BASE_URL}/admissions/status/${appNumber}/`);
      return res.json();
    },

    async getAllAdmin(params: Record<string, string | number> = {}): Promise<PaginatedResponse<AdmissionApplication>> {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetchWithAuth(`/admissions/all/${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch admissions');
      return res.json();
    },

    async review(id: number, status: 'approved' | 'rejected' | 'pending', admin_notes = '') {
      const res = await fetchWithAuth(`/admissions/${id}/review/`, {
        method: 'POST',
        body: JSON.stringify({ status, admin_notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to review admission');
      return data;
    },
  },

  // Common stats
  stats: {
    async getDashboardStats(): Promise<DashboardStats> {
      const res = await fetch(`${API_BASE_URL}/common/stats/`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    },
  },
};
