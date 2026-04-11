// frontend/lib/api.ts
const API_BASE = '';

console.log('api.ts loaded, API_BASE =', API_BASE);

function formatFastApiDetail(detail: any): string {
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const loc = Array.isArray(d?.loc) ? d.loc.join('.') : '';
        const msg = d?.msg ?? 'Ошибка валидации';
        return loc ? `${loc}: ${msg}` : msg;
      })
      .join('\n');
  }

  if (typeof detail === 'string') return detail;

  try {
    return JSON.stringify(detail);
  } catch {
    return 'Ошибка сервера';
  }
}

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  console.log('FETCH URL FROM api.ts =', url);

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Ошибка сервера' }));
    const message = formatFastApiDetail((data as any)?.detail) || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

// ──────────────────────────────
// API methods
// ──────────────────────────────
export const api = {
  getWindowTypes: () => fetchAPI<WindowType[]>('/api/windows/types'),

  calculatePrice: (data: PriceCalcRequest) =>
    fetchAPI<PriceResult>('/api/windows/calculate-price', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createOrder: (data: OrderRequest) =>
    fetchAPI<OrderResponse>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAvailableSlots: (date: string) =>
    fetchAPI<SlotsResponse>(`/api/appointments/available-slots?date=${date}`),

  createAppointment: (data: AppointmentRequest) =>
    fetchAPI<AppointmentResponse>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendConstructorLead: (data: ConstructorLeadRequest) =>
    fetchAPI<{ ok: true }>('/api/leads/constructor', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendAppointmentLead: (data: AppointmentLeadRequest) =>
    fetchAPI<{ ok: true }>('/api/leads/appointment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendContactLead: (data: ContactLeadRequest) =>
    fetchAPI<{ ok: true }>('/api/leads/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getReviews: (limit?: number) =>
    fetchAPI<ReviewResponse[]>(limit ? `/api/reviews?limit=${limit}` : '/api/reviews'),

  createReview: (data: ReviewCreateRequest) =>
    fetchAPI<ReviewResponse>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ──────────────────────────────
// Types
// ──────────────────────────────
export interface WindowType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  features: Record<string, any> | null;
}

export interface PriceCalcRequest {
  window_type_id: number;
  width: number;
  height: number;
  sections?: number;
  opening_type?: string;
  glass_type?: string;
  profile_type?: string;
  has_mosquito_net?: boolean;
  has_windowsill?: boolean;
  windowsill_depth?: number;
  has_slopes?: boolean;
  quantity?: number;
}

export interface PriceResult {
  base_price: number;
  area_price: number;
  options_price: number;
  total_per_unit: number;
  quantity: number;
  total_price: number;
  breakdown: Record<string, number>;
}

export interface WindowConfig extends PriceCalcRequest {
  color?: string;
}

export interface OrderRequest {
  client_name: string;
  client_phone: string;
  client_email?: string;
  client_address?: string;
  city?: string;
  notes?: string;
  configurations: WindowConfig[];
}

export interface OrderResponse {
  id: number;
  client_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface AppointmentRequest {
  client_name: string;
  client_phone: string;
  client_email?: string;
  appointment_date: string;
  appointment_type: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: number;
  client_name: string;
  client_phone?: string;
  appointment_date: string;
  appointment_type?: string;
  status: string;
  created_at?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booked_count: number;
}

export interface SlotsResponse {
  date: string;
  slots: TimeSlot[];
}

// ──────────────────────────────
// Telegram lead payloads
// ──────────────────────────────
export interface ConstructorLeadRequest {
  name: string;
  phone: string;
  window_type: string;
  width: number;
  height: number;
  quantity: number;
  profile_type?: string;
  glass_type?: string;
  opening_type?: string;
  color?: string;
  notes?: string;
}

export interface ContactLeadRequest {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export interface AppointmentLeadRequest {
  name: string;
  phone: string;
  appointment_type: string;
  appointment_date: string;
  city: string;
  address?: string;
  email?: string;
  notes?: string;
}

// ──────────────────────────────
// Reviews
// ──────────────────────────────
export interface ReviewCreateRequest {
  name: string;
  city?: string;
  rating: number;
  text: string;
}

export interface ReviewResponse {
  id: number;
  name: string;
  city?: string;
  rating: number;
  text: string;
  is_approved: boolean;
  created_at: string;
}