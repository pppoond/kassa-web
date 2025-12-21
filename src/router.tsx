import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load components
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const CustomerLayout = React.lazy(() => import('./layouts/CustomerLayout')); // Add this
const DashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));
const CategoryPage = React.lazy(() => import('./pages/admin/CategoryPage'));
const MenuItemPage = React.lazy(() => import('./pages/admin/MenuItemPage'));
const PosPage = React.lazy(() => import('./pages/pos/PosPage'));
const KitchenPage = React.lazy(() => import('./pages/kitchen/KitchenPage'));
const DayEndPage = React.lazy(() => import('./pages/report/DayEndPage')); // Restore this
const MobileOrderingPage = React.lazy(() => import('./pages/ordering/MobileOrderingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage')); // Add this

// Loading component
const Loading = () => (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
);

const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<Loading />}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        // Public Customer Routes
        path: '/customer',
        element: (
            <Suspense fallback={<Loading />}>
                <CustomerLayout />
            </Suspense>
        ),
        children: [
            {
                path: 'order/:orderId',
                element: (
                    <Suspense fallback={<Loading />}>
                        <MobileOrderingPage />
                    </Suspense>
                ),
            },
        ],
    },
    {
        // Protected Admin/Staff Routes
        element: <ProtectedRoute />, // Wrap these routes
        children: [
            {
                path: '/',
                element: <App />,
            },
            {
                path: '/pos',
                element: (
                    <Suspense fallback={<Loading />}>
                        <PosPage />
                    </Suspense>
                ),
            },
            {
                path: '/kitchen',
                element: (
                    <Suspense fallback={<Loading />}>
                        <KitchenPage />
                    </Suspense>
                ),
            },
            {
                path: '/report/day-end',
                element: (
                    <Suspense fallback={<Loading />}>
                        <DayEndPage />
                    </Suspense>
                ),
            },
            {
                path: '/admin',
                element: (
                    <Suspense fallback={<Loading />}>
                        <AdminLayout />
                    </Suspense>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loading />}>
                                <DashboardPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'categories',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <CategoryPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'menu-items',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <MenuItemPage />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;
