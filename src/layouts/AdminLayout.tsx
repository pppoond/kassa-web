import { useEffect, Fragment } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Coffee, MapPin, Check, ChevronDown } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { useAdminStore } from '../store/useAdminStore';
import ThemeToggle from '../components/common/ThemeToggle';

const AdminLayout = () => {
    const location = useLocation();
    const { branches, selectedBranchId, setSelectedBranch, fetchBranches } = useAdminStore();

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const isActive = (path: string) => location.pathname === path;
    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    return (
        <div className="flex min-h-screen bg-base-100 transition-colors duration-400">
            {/* Sidebar */}
            <aside className="w-72 bg-base-200 border-r border-base-300 flex flex-col z-50">
                <div className="p-8 pb-4">
                    <div className="text-3xl font-black tracking-tight text-primary">
                        KINDEE
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mt-1">
                        Administration
                    </div>
                </div>

                <div className="px-6 mb-8 mt-4">
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text font-bold text-[10px] uppercase opacity-40">Active Branch</span>
                        </label>
                        
                        <Listbox value={selectedBranchId} onChange={setSelectedBranch}>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-xl bg-base-100 py-3 pl-10 pr-10 text-left border border-base-300 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all sm:text-sm shadow-sm hover:border-primary/50">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                        <MapPin size={16} aria-hidden="true" />
                                    </span>
                                    <span className="block truncate font-bold text-xs uppercase tracking-tight">
                                        {selectedBranch ? selectedBranch.name : 'Select Branch...'}
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
                                                No branches found
                                            </div>
                                        )}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
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
                    <div className="bg-base-300/50 rounded-2xl p-4 flex items-center justify-between border border-base-300/50">
                         <div className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">System v0.1.0</div>
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
