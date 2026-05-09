import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export interface RegisterRequest {
    username: string;
    password?: string;
    fullName: string;
    email?: string;
}

export const registerUser = async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};
