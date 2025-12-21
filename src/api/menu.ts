// import axios from 'axios';
import type { CategoryMenuDto } from '../types/menu';

// Setup axios instance (you can move this to a shared api client file later)
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || '/api',
// });

// Mock Data
const MOCK_MENU: CategoryMenuDto[] = [
    {
        categoryId: 'cat-001',
        categoryName: 'Appetizers',
        items: [
            { id: 'item-001', name: 'Caesar Salad', description: 'Fresh romaine lettuce, croutons, parmesan cheese, and caesar dressing.', price: 180, imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=500' },
            { id: 'item-002', name: 'French Fries', description: 'Crispy golden fries served with ketchup and mayo.', price: 120, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=500' },
            { id: 'item-003', name: 'Garlic Bread', description: 'Toasted baguette generous topped with garlic butter and herbs.', price: 90 },
        ]
    },
    {
        categoryId: 'cat-002',
        categoryName: 'Main Courses',
        items: [
            { id: 'item-004', name: 'Grilled Salmon', description: 'Fresh atlantic salmon grilled to perfection, served with asparagus.', price: 450, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=500' },
            { id: 'item-005', name: 'Beef Burger', description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce.', price: 280, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500' },
            { id: 'item-006', name: 'Spaghetti Carbonara', description: 'Classic italian pasta with eggs, cheese, pancetta, and black pepper.', price: 250, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=500' },
        ]
    },
    {
        categoryId: 'cat-003',
        categoryName: 'Beverages',
        items: [
            { id: 'item-007', name: 'Cola', description: 'Classic refreshing cola.', price: 40 },
            { id: 'item-008', name: 'Iced Coffee', description: 'Freshly brewed coffee served over ice.', price: 80, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7fa8b?auto=format&fit=crop&q=80&w=500' },
            { id: 'item-009', name: 'Water', description: 'Mineral water.', price: 20 },
        ]
    }
];

export const fetchMenu = async (): Promise<CategoryMenuDto[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return Mock Data
  return MOCK_MENU;
  
  // Uncomment to use real API
  // const response = await api.get<CategoryMenuDto[]>('/menu'); 
  // return response.data;
};
