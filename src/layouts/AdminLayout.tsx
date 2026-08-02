import { useEffect, useState, Fragment } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Coffee, MapPin, Check, ChevronDown, Settings2, Home, LogOut, Users, TableProperties, Building, Menu, X } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { useAdminStore } from '../store/useAdminStore';
import { logoutSession } from '../api/session';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { branches, selectedBranchId, setSelectedBranch, fetchBranches } = useAdminStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) => location.pathname === path;
    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    const handleLogout = async () => {
        await logoutSession();
        navigate('/login');
    };

    const sidebarContent = (
        <>
            <div className="p-6 lg:p-8 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-black tracking-tight text-primary">
                            KINDEE
                        </div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mt-1">
                            {t('nav.administration')}
                        </div>
                    </div>
                    {/* Close button on mobile */}
                    <button
                        className="btn btn-sm btn-circle btn-ghost lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="px-4 lg:px-6 mb-6 lg:mb-8 mt-4">
                <div className="form-control w-full">
                    <label className="label py-1">
                        <span className="label-text font-bold text-[10px] uppercase opacity-40">{t('nav.activeBranch')}</span>
                    </label>
                    
                    <Listbox value={selectedBranchId ?? undefined} onChange={setSelectedBranch}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-xl bg-base-100 py-3 pl-10 pr-10 text-left border border-base-300 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all sm:text-sm shadow-sm hover:border-primary/50">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                    <MapPin size={16} aria-hidden="true" />
                                </span>
                                <span className="block truncate font-bold text-xs uppercase tracking-tight">
                                    {selectedBranch ? selectedBranch.name : t('nav.selectBranch')}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown size={16} className="text-base-content/30" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-base-100 py-2 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm z-[100] border border-base-300">
                                    {branches.map((branch) => (
                                        <Listbox.Option
                                            key={branch.id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-3 pl-10 pr-4 transition-colors ${
                                                    active ? 'bg-primary/10 text-primary' : 'text-base-content'
                                                }`
                                            }
                                            value={branch.id}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                                        {branch.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                            <Check size={16} aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                    {branches.length === 0 && (
                                        <div className="py-4 px-4 text-center text-xs opacity-40 font-bold">
                                            {t('common.noData')}
                                        </div>
                                    )}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>
            
            <nav className="flex-1 px-3 lg:px-4 space-y-1 overflow-y-auto">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
                >
                    <Home size={20} />
                    {t('common.backToHome')}
                </Link>

                <div className="divider my-2 opacity-20"></div>

                <Link
                    to="/admin"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <LayoutDashboard size={20} />
                    {t('nav.dashboard')}
                </Link>
                <Link
                    to="/admin/categories"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/categories') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <List size={20} />
                    {t('nav.categories')}
                </Link>
                <Link
                    to="/admin/menu-items"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/menu-items') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <Coffee size={20} />
                    {t('nav.menuItems')}
                </Link>
                <Link
                    to="/admin/option-groups"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/option-groups') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <Settings2 size={20} />
                    {t('nav.optionGroups')}
                </Link>
                <Link
                    to="/admin/staff"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/staff') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <Users size={20} />
                    {t('nav.staff')}
                </Link>
                <Link
                    to="/admin/tables"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/tables') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <TableProperties size={20} />
                    {t('nav.tables')}
                </Link>
                <Link
                    to="/admin/branches"
                    className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/branches') ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                        }`}
                >
                    <Building size={20} />
                    {t('nav.branches')}
                </Link>
            </nav>

            <div className="p-4 lg:p-6 space-y-3">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl font-medium transition-all duration-200 text-error/70 hover:bg-error/10 hover:text-error w-full"
                >
                    <LogOut size={20} />
                    {t('common.logout')}
                </button>
                <div className="bg-base-300/50 rounded-2xl p-3 lg:p-4 flex items-center justify-between border border-base-300/50">
                     <div className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">System v0.1.0</div>
                     <div className="flex items-center gap-2">
                         <LanguageSwitcher />
                         <ThemeToggle />
                     </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-base-100 transition-colors duration-400">
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 py-3 lg:hidden">
                <button
                    className="btn btn-sm btn-ghost btn-square"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
                <div className="text-xl font-black tracking-tight text-primary">KINDEE</div>
                <div className="flex items-center gap-1">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-base-200 border-r border-base-300 flex flex-col z-50
                transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 pt-20 lg:pt-10 lg:p-10 overflow-auto bg-base-100 min-w-0 lg:h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
