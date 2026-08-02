export interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
    permissions?: string[];
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    /** ISO string — เวลาหมดอายุของ access token */
    expiresAt: string;
    /** ISO string — เวลาหมดอายุของ refresh token */
    refreshTokenExpiresAt: string;
}

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface RegisterRequest {
    username: string;
    password?: string;
    fullName: string;
    email?: string;
    avatarUrl?: string;
    roleId?: string;
}
