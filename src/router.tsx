import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import CategoryPage from './pages/admin/CategoryPage';
import MenuItemPage from './pages/admin/MenuItemPage';
import App from './App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />, // Existing simple landing/example
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'categories',
                element: <CategoryPage />,
            },
            {
                path: 'menu-items',
                element: <MenuItemPage />,
            },
        ],
    },
]);

export default router;
