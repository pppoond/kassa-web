import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Coffee } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-base-100">
            {/* Sidebar */}
            <aside className="w-64 bg-base-200 text-base-content flex flex-col">
                <div className="p-4 text-2xl font-bold text-primary text-center">
                    Kassa Admin
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/categories"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/categories') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
                            }`}
                    >
                        <List size={20} />
                        Categories
                    </Link>
                    <Link
                        to="/admin/menu-items"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/menu-items') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
                            }`}
                    >
                        <Coffee size={20} />
                        Menu Items
                    </Link>
                </nav>
                <div className="p-4 text-xs text-base-content/50 text-center">
                    v0.1.0-alpha
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
