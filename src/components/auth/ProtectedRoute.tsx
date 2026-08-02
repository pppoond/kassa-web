import React, { useCallback, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ensureFreshToken, REFRESH_LEAD_TIME_MS } from '../../api/session';
import { getTimeUntilExpiry } from '../../utils/jwt';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, token, isSessionValid, canRefresh } = useAuthStore();
    const location = useLocation();

    // access token ยังใช้ได้ หรือหมดอายุแต่ยังมี refresh token → ถือว่ายังอยู่ใน session
    const accessValid = isAuthenticated && isSessionValid();
    const refreshable = isAuthenticated && canRefresh();
    const inSession = accessValid || refreshable;

    // ต่ออายุ token ถ้าทำได้ ถ้าไม่ได้ก็ตัด session ทิ้ง
    const keepAlive = useCallback(async () => {
        const ok = await ensureFreshToken();
        if (!ok) useAuthStore.getState().expireSession();
    }, []);

    // เข้า route แล้ว token หมดอายุ (หรือใกล้หมด) → refresh เงียบ ๆ ไม่ต้องรอ 401
    useEffect(() => {
        if (!isAuthenticated) return;
        if (accessValid) return;
        keepAlive();
    }, [isAuthenticated, accessValid, keepAlive]);

    // ตั้งเวลา refresh ล่วงหน้าก่อน token หมดอายุ (เผื่อ user นั่งค้างหน้าเดิมไม่ยิง API)
    useEffect(() => {
        if (!accessValid) return;

        const remaining = getTimeUntilExpiry(token);
        if (remaining === null) return;

        // setTimeout รับได้ไม่เกิน ~24.8 วัน (2^31-1 ms)
        const delay = Math.min(Math.max(remaining - REFRESH_LEAD_TIME_MS, 0), 2_147_483_647);
        const timer = window.setTimeout(keepAlive, delay);

        return () => window.clearTimeout(timer);
    }, [accessValid, token, keepAlive]);

    // กลับมาที่ tab อีกครั้ง (เปิดทิ้งไว้ / เครื่อง sleep แล้ว timer เพี้ยน) ให้เช็คใหม่
    useEffect(() => {
        if (!isAuthenticated) return;

        const recheck = () => {
            if (document.visibilityState === 'hidden') return;
            keepAlive();
        };

        document.addEventListener('visibilitychange', recheck);
        window.addEventListener('focus', recheck);

        return () => {
            document.removeEventListener('visibilitychange', recheck);
            window.removeEventListener('focus', recheck);
        };
    }, [isAuthenticated, keepAlive]);

    if (!inSession) {
        // Redirect to login page, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
