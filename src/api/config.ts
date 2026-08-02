/** Base URL ของ API — แยกไว้เพื่อให้ session.ts ใช้ได้โดยไม่ import apiClient (กัน circular import) */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5248/api';
