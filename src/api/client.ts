import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { refreshSession } from './session';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/** ทำเครื่องหมายว่า request นี้ retry ไปแล้ว กันวน refresh ไม่จบ */
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Interceptor สำหรับแนบ JWT Token ไปกับทุก Request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor สำหรับจัดการ Error (เช่น Token หมดอายุ)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config as RetriableConfig | undefined;

        // 401 จาก /auth/* (login ผิด, refresh หมดอายุ) ไม่ต้อง refresh หรือเคลียร์ session
        // ปล่อยให้หน้าที่เรียกจัดการข้อความเอง
        const isAuthCall = config?.url?.startsWith('/auth/') ?? false;

        if (error.response?.status === 401 && config && !isAuthCall && !config._retried) {
            config._retried = true;

            // ลอง refresh 1 ครั้ง แล้วยิง request เดิมซ้ำ
            const newToken = await refreshSession();
            if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(config);
            }

            // refresh ไม่ได้ → ล้าง session แล้วเด้งไปหน้า login
            useAuthStore.getState().expireSession();

            // กัน redirect วนซ้ำถ้าอยู่หน้า login/public อยู่แล้ว
            const path = window.location.pathname;
            if (path !== '/login' && !path.startsWith('/customer') && path !== '/god-reset') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
