import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5248/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    (error) => {
        if (error.response?.status === 401) {
            // ล้าง Token และส่งกลับไปหน้า Login ถ้า Token หมดอายุ
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
