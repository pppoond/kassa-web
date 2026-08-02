/**
 * Helper สำหรับอ่านข้อมูลใน JWT ฝั่ง client
 * ใช้เช็คแค่ว่า token หมดอายุหรือยัง (ไม่ได้ verify signature — ฝั่ง server ทำอยู่แล้ว)
 */

interface JwtPayload {
    exp?: number; // seconds since epoch
    [key: string]: unknown;
}

const base64UrlDecode = (value: string): string => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const binary = atob(padded);
    // รองรับ UTF-8 (เช่น ชื่อภาษาไทยใน claim)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
};

export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        return JSON.parse(base64UrlDecode(payload)) as JwtPayload;
    } catch {
        return null;
    }
};

/** เวลาหมดอายุเป็น epoch milliseconds (null = ไม่มี claim exp หรือ decode ไม่ได้) */
export const getTokenExpiry = (token: string | null | undefined): number | null => {
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload?.exp) return null;
    return payload.exp * 1000;
};

/**
 * token หมดอายุแล้วหรือยัง
 * @param leewaySeconds เผื่อเวลาไว้ (default 10 วิ) กัน clock skew และกันยิง request ที่ใกล้หมดอายุ
 */
export const isTokenExpired = (token: string | null | undefined, leewaySeconds = 10): boolean => {
    if (!token) return true;
    const expiresAt = getTokenExpiry(token);
    // ถ้าอ่าน exp ไม่ได้ ถือว่ายังใช้ได้ ปล่อยให้ server ตัดสิน (กัน false logout)
    if (expiresAt === null) return false;
    return Date.now() >= expiresAt - leewaySeconds * 1000;
};

/** เหลือเวลาอีกกี่ ms ก่อนหมดอายุ (null = ไม่รู้เวลาหมดอายุ) */
export const getTimeUntilExpiry = (token: string | null | undefined): number | null => {
    const expiresAt = getTokenExpiry(token);
    if (expiresAt === null) return null;
    return expiresAt - Date.now();
};
