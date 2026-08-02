import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { isTokenExpired } from '../utils/jwt';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    /** ถูกตัดออกจากระบบเพราะ session หมดอายุ (ใช้แสดงข้อความที่หน้า login) */
    sessionExpired: boolean;
    login: (user: User, token: string, refreshToken?: string | null) => void;
    logout: () => void;
    /** เคลียร์ session พร้อมทำเครื่องหมายว่าหมดอายุ */
    expireSession: () => void;
    clearSessionExpired: () => void;
    /** เช็คว่า access token ยังใช้ได้ไหม (มี token + ยังไม่หมดอายุ) */
    isSessionValid: () => boolean;
    /** ยังมี refresh token ที่พอจะขอ access token ใหม่ได้ไหม */
    canRefresh: () => boolean;
}

const clearStoredTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            sessionExpired: false,
            login: (user, token, refreshToken) => {
                localStorage.setItem('token', token);
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

                set({
                    user,
                    token,
                    refreshToken: refreshToken ?? get().refreshToken,
                    isAuthenticated: true,
                    sessionExpired: false
                });
            },
            logout: () => {
                clearStoredTokens();
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false, sessionExpired: false });
            },
            expireSession: () => {
                clearStoredTokens();
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false, sessionExpired: true });
            },
            clearSessionExpired: () => set({ sessionExpired: false }),
            isSessionValid: () => {
                const state = get();
                if (!state.isAuthenticated) return false;
                const token = state.token ?? localStorage.getItem('token');
                return !!token && !isTokenExpired(token);
            },
            canRefresh: () => {
                const state = get();
                return state.isAuthenticated && !!(state.refreshToken ?? localStorage.getItem('refreshToken'));
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
