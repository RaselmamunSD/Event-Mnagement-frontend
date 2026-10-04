export type Role = 'admin' | 'member' | 'user';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended';
  is_staff: boolean;
  date_joined: string;
}

export interface Member {
  id: number;
  member_id: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  profession?: string;
  organization?: string;
  address?: string;
  bio?: string;
  avatar_url?: string;
  avatar?: string;
  membership_type: 'general' | 'life' | 'student' | 'honorary' | 'corporate';
  status: 'active' | 'inactive' | 'pending';
  joining_date: string;
}

export interface Executive {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  designation: string;
  department: string;
  biography?: string;
  avatar_url?: string;
  avatar?: string;
  display_order: number;
  term: string;
  social_links?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    email?: string;
  };
  is_active: boolean;
}

export interface EventAgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export interface EventSpeaker {
  name: string;
  role: string;
  company?: string;
  image?: string;
  bio?: string;
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  banner?: string;
  category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'cultural' | 'tech' | 'general';
  event_type: 'in_person' | 'virtual' | 'hybrid';
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  location_map_url?: string;
  organizer: string;
  registration_deadline: string;
  capacity: number;
  registration_fee: string | number;
  is_featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  agenda?: EventAgendaItem[];
  speakers?: EventSpeaker[];
  gallery?: string[];
  registered_count: number;
  available_seats: number;
  is_registration_open: boolean;
}

export interface EventRegistration {
  id: number;
  event: number;
  event_title: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  event_slug: string;
  ticket_number: string;
  name: string;
  email: string;
  phone: string;
  member_id?: string;
  organization?: string;
  address?: string;
  additional_info?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'attended';
  registration_date: string;
}

export interface AdmissionApplication {
  id: number;
  application_number: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  profession: string;
  organization: string;
  nid_number: string;
  membership_type: 'general' | 'life' | 'student' | 'corporate';
  photo_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface DashboardStats {
  total_members: number;
  total_events: number;
  upcoming_events: number;
  ongoing_events: number;
  completed_events: number;
  total_registrations: number;
  pending_admissions: number;
  total_executives: number;
  total_users: number;
  years_of_experience: number;
  category_breakdown: Record<string, number>;
  recent_registrations: Array<{
    id: number;
    name: string;
    email: string;
    event_title: string;
    ticket_number: string;
    status: string;
    date: string;
  }>;
  recent_admissions: Array<{
    id: number;
    name: string;
    email: string;
    membership_type: string;
    application_number: string;
    status: string;
    date: string;
  }>;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
