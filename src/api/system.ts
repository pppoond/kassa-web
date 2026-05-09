import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const getSystemStatus = async () => {
    const response = await api.get('/system/status');
    return response.data as { isSetupCompleted: boolean };
};

export interface SetupRequest {
    organizationName: string;
    branchName: string;
    branchAddress?: string;
    adminUsername: string;
    adminPassword?: string;
    adminFullName: string;
    adminEmail?: string;
}

export const setupSystem = async (data: SetupRequest) => {
    const response = await api.post('/system/setup', data);
    return response.data;
};
