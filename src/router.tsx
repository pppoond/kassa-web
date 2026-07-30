import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load components
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const CustomerLayout = React.lazy(() => import('./layouts/CustomerLayout'));
const PosLayout = React.lazy(() => import('./layouts/PosLayout'));
const DashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));
const CategoryPage = React.lazy(() => import('./pages/admin/CategoryPage'));
const MenuItemPage = React.lazy(() => import('./pages/admin/MenuItemPage'));
const OptionGroupPage = React.lazy(() => import('./pages/admin/OptionGroupPage'));
const StaffPage = React.lazy(() => import('./pages/admin/StaffPage'));
const TablePage = React.lazy(() => import('./pages/admin/TablePage'));
const BranchPage = React.lazy(() => import('./pages/admin/BranchPage'));
const PosHomePage = React.lazy(() => import('./pages/pos/PosHomePage'));
const PosTablesPage = React.lazy(() => import('./pages/pos/PosTablesPage'));
const KitchenPage = React.lazy(() => import('./pages/kitchen/KitchenPage'));
const DayEndPage = React.lazy(() => import('./pages/report/DayEndPage'));
const MobileOrderingPage = React.lazy(() => import('./pages/ordering/MobileOrderingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const GodResetPage = React.lazy(() => import('./pages/auth/GodResetPage'));

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
        path: '/god-reset',
        element: (
            <Suspense fallback={<Loading />}>
                <GodResetPage />
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
                        <PosLayout />
                    </Suspense>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PosHomePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'home',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PosHomePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'tables',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PosTablesPage />
                            </Suspense>
                        ),
                    },
                ],
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
                    {
                        path: 'option-groups',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <OptionGroupPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'staff',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <StaffPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'tables',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <TablePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'branches',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <BranchPage />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;
