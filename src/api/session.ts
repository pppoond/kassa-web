import axios from 'axios';
import { API_BASE_URL } from './config';
import { useAuthStore } from '../store/useAuthStore';
import { getTimeUntilExpiry, isTokenExpired } from '../utils/jwt';
import type { ApiResponse, AuthResponse } from '../types';

/**
 * จัดการ refresh token
 * ใช้ axios ตัวเปล่า (ไม่ผ่าน apiClient) เพื่อไม่ให้ชน response interceptor แล้ววน refresh ไม่จบ
 */
const bareClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

/** refresh ก่อนหมดอายุเท่านี้ (ms) — 2 นาที */
export const REFRESH_LEAD_TIME_MS = 2 * 60 * 1000;

/** request ที่กำลัง refresh อยู่ — ให้ทุกคนที่เรียกพร้อมกันรอ promise เดียวกัน */
let inFlight: Promise<string | null> | null = null;

const doRefresh = async (refreshToken: string): Promise<string | null> => {
    try {
        const response = await bareClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
        const result = response.data.data;
        if (!result?.token || !result?.refreshToken) return null;

        // เก็บ token ชุดใหม่ (backend หมุน refresh token ทุกครั้งที่ refresh)
        useAuthStore.getState().login(result.user, result.token, result.refreshToken);
        return result.token;
    } catch {
        return null;
    }
};

/**
 * ขอ access token ใหม่ด้วย refresh token
 * คืน token ใหม่ หรือ null ถ้า refresh ไม่ได้ (ต้อง login ใหม่)
 */
export const refreshSession = (): Promise<string | null> => {
    if (inFlight) return inFlight;

    const refreshToken = useAuthStore.getState().refreshToken ?? localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve(null);

    inFlight = doRefresh(refreshToken).finally(() => {
        inFlight = null;
    });

    return inFlight;
};

/**
 * เช็คก่อนใช้งานว่า access token ใกล้หมดอายุหรือหมดแล้ว ถ้าใช่ให้ refresh
 * คืน true ถ้ายังมี session ที่ใช้ได้
 */
export const ensureFreshToken = async (): Promise<boolean> => {
    const state = useAuthStore.getState();
    if (!state.isAuthenticated) return false;

    const token = state.token ?? localStorage.getItem('token');
    if (!token) return (await refreshSession()) !== null;

    const remaining = getTimeUntilExpiry(token);
    const needsRefresh = isTokenExpired(token) || (remaining !== null && remaining <= REFRESH_LEAD_TIME_MS);

    if (!needsRefresh) return true;

    return (await refreshSession()) !== null;
};

/** logout: revoke refresh token ที่ server แล้วล้าง session ฝั่ง client */
export const logoutSession = async (): Promise<void> => {
    const refreshToken = useAuthStore.getState().refreshToken ?? localStorage.getItem('refreshToken');

    if (refreshToken) {
        try {
            await bareClient.post('/auth/logout', { refreshToken });
        } catch {
            // revoke ไม่สำเร็จก็ไม่เป็นไร ยังต้องล้าง session ฝั่ง client อยู่ดี
        }
    }

    useAuthStore.getState().logout();
};
