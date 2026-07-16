const rawApiUrl = import.meta.env.VITE_API_URL || 'https://vendorstreet.onrender.com';

export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`);

export const SOCKET_URL = import.meta.env.DEV
  ? undefined
  : (import.meta.env.VITE_SOCKET_URL || rawApiUrl.replace('/api', ''));
