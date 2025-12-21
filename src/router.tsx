import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import CategoryPage from './pages/admin/CategoryPage';
import MenuItemPage from './pages/admin/MenuItemPage';
import App from './App';
import PosPage from './pages/pos/PosPage';
import KitchenPage from './pages/kitchen/KitchenPage';
import DayEndPage from './pages/report/DayEndPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/pos',
        element: <PosPage />,
    },
    {
        path: '/kitchen',
        element: <KitchenPage />,
    },
    {
        path: '/report/day-end',
        element: <DayEndPage />,
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
