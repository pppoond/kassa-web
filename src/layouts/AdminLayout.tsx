import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Coffee } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-base-100 transition-colors duration-400">
            {/* Sidebar */}
            <aside className="w-72 bg-base-200 border-r border-base-300 flex flex-col z-50">
                <div className="p-8">
                    <div className="text-3xl font-black tracking-tight text-primary">
                        KINDEE
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mt-1">
                        Administration
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/categories"
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/categories') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                            }`}
                    >
                        <List size={20} />
                        Categories
                    </Link>
                    <Link
                        to="/admin/menu-items"
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/menu-items') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                            }`}
                    >
                        <Coffee size={20} />
                        Menu Items
                    </Link>
                </nav>

                <div className="p-6">
                    <div className="bg-base-300/50 rounded-2xl p-4 flex items-center justify-between">
                         <div className="text-[10px] font-bold opacity-40 uppercase">v0.1.0</div>
                         <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
