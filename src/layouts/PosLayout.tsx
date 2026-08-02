import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Store, LayoutGrid, Receipt, Settings, LogOut, MapPin } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { cn } from '../utils/cn';
import { useAdminStore } from '../store/useAdminStore';
import { logoutSession } from '../api/session';
import { useTranslation } from 'react-i18next';

const PosLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { branches, selectedBranchId, fetchBranches } = useAdminStore();

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    const handleLogout = async () => {
        await logoutSession();
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === '/pos/home') {
            return location.pathname === '/pos' || location.pathname === '/pos/home';
        }
        return location.pathname === path;
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-base-100 overflow-hidden transition-colors duration-300">
            {/* Sidebar Navigation - hidden on mobile, shown on md+ */}
            <div className="hidden md:flex w-20 bg-base-200 border-r border-base-300 flex-col items-center py-4 gap-6 z-20">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl shadow-lg">
                    K
                </div>

                <div className="flex flex-col gap-4 w-full px-2">
                    <Link
                        to="/pos/home"
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", isActive('/pos/home') ? "btn-active btn-neutral" : "btn-ghost")}
                        title={t('nav.posHome')}
                    >
                        <Store className="w-6 h-6" />
                    </Link>
                    <Link
                        to="/pos/tables"
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", isActive('/pos/tables') ? "btn-active btn-neutral" : "btn-ghost")}
                        title={t('nav.posTables')}
                    >
                        <LayoutGrid className="w-6 h-6" />
                    </Link>
                    <Link
                        to="/pos/orders"
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", isActive('/pos/orders') ? "btn-active btn-neutral" : "btn-ghost")}
                        title={t('nav.posOrders')}
                    >
                        <Receipt className="w-6 h-6" />
                    </Link>
                    <Link
                        to="/pos/settings"
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", isActive('/pos/settings') ? "btn-active btn-neutral" : "btn-ghost")}
                        title={t('nav.posSettings')}
                    >
                        <Settings className="w-6 h-6" />
                    </Link>
                </div>

                <div className="mt-auto flex flex-col gap-4 w-full px-2 items-center">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Link to="/" className="btn btn-square btn-ghost w-full h-14 rounded-xl text-error" title={t('common.logout')}>
                        <LogOut className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {/* Main Area (Navbar + Content) */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Top Navbar */}
                <header className="h-14 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-primary" />
                            <span className="font-bold">{selectedBranch?.name || t('nav.selectBranch')}</span>
                        </div>
                        <Link
                            to="/pos/select-branch"
                            className="btn btn-primary btn-xs text-white"
                        >
                            {t('common.edit')}
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="btn btn-error btn-sm gap-2 text-white"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">{t('common.logout')}</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-hidden pb-16 md:pb-0">
                    <Outlet />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-base-200 border-t border-base-300 flex items-center justify-around py-2 md:hidden">
                <Link
                    to="/pos/home"
                    className={cn("btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2", isActive('/pos/home') && "text-primary")}
                >
                    <Store className="w-5 h-5" />
                    <span className="text-[10px]">{t('nav.posHome')}</span>
                </Link>
                <Link
                    to="/pos/tables"
                    className={cn("btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2", isActive('/pos/tables') && "text-primary")}
                >
                    <LayoutGrid className="w-5 h-5" />
                    <span className="text-[10px]">{t('nav.posTables')}</span>
                </Link>
                <Link
                    to="/pos/orders"
                    className={cn("btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2", isActive('/pos/orders') && "text-primary")}
                >
                    <Receipt className="w-5 h-5" />
                    <span className="text-[10px]">{t('nav.posOrders')}</span>
                </Link>
                <Link
                    to="/pos/settings"
                    className={cn("btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2", isActive('/pos/settings') && "text-primary")}
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px]">{t('nav.posSettings')}</span>
                </Link>
            </div>
        </div>
    );
};

export default PosLayout;
