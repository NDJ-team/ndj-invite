export interface Invitation {
  id: string;
  slug: string;
  template_id: string;
  event_type: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
  address: string;
  map_url: string | null;
  status: string;
  cover_photo_url: string | null;
  program: ProgramItem[] | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface InvitationList {
  id: string;
  slug: string;
  template_id: string;
  title: string;
  event_date: string;
  event_time: string;
  status: string;
  created_at: string;
}

export interface ProgramItem {
  time: string;
  title: string;
}

export interface Photo {
  id: string;
  invitation_id: string;
  url: string;
  object_key: string;
  sort_order: number;
  created_at: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  phone: string | null;
  guests_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  total_guests: number;
}

export interface RSVPData {
  name: string;
  phone?: string;
  guests_count: number;
  status: "CONFIRMED" | "DECLINED";
}
