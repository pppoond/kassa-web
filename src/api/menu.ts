import axios from 'axios';
import type { CategoryMenuDto } from '../types/menu';

// Setup axios instance (you can move this to a shared api client file later)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const fetchMenu = async (): Promise<CategoryMenuDto[]> => {
  const response = await api.get<CategoryMenuDto[]>('/menu'); // Adjust endpoint path if needed
  return response.data;
};
