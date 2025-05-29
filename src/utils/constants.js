export const USER_ROLES = {
  ADMIN: 'admin',
  RESTAURANT_OWNER: 'restaurant_owner',
  USER: 'user',
};

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const RESTAURANT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const CUISINE_TYPES = {
  UZBEK: 'uzbek',
  EUROPEAN: 'european',
  ASIAN: 'asian',
  FASTFOOD: 'fastfood',
};

export const PRICE_RANGES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const RATINGS = {
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2,
  ONE: 1,
};

export const TIME_SLOTS = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

export const MAX_GUESTS = 100;
export const MIN_GUESTS = 1;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  RESTAURANTS: {
    BASE: '/restaurants',
    APPROVE: (id) => `/restaurants/${id}/approve`,
    REJECT: (id) => `/restaurants/${id}/reject`,
  },
  RESERVATIONS: {
    BASE: '/reservations',
    CANCEL: (id) => `/reservations/${id}/cancel`,
  },
  USERS: {
    BASE: '/users',
    ROLE: (id) => `/users/${id}/role`,
  },
}; 