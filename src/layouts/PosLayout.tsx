import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Store, LayoutGrid, Receipt, Settings, LogOut, MapPin } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import { cn } from '../utils/cn';
import { useAdminStore } from '../store/useAdminStore';

const PosLayout = () => {
    const location = useLocation();
    const { branches, selectedBranchId, setSelectedBranch, fetchBranches } = useAdminStore();

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const isActive = (path: string) => {
        if (path === '/pos/home') {
            return location.pathname === '/pos' || location.pathname === '/pos/home';
        }
        return location.pathname === path;
    };

    // ถ้ายังไม่ได้เลือกสาขา แสดงหน้าเลือกสาขาก่อน
    if (!selectedBranchId) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 transition-colors duration-300">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-content font-bold text-2xl shadow-lg mx-auto mb-4">
                            K
                        </div>
                        <h1 className="text-2xl font-black text-primary">KINDEE POS</h1>
                        <p className="text-base-content/50 mt-1 text-sm">เลือกสาขาเพื่อเริ่มใช้งาน</p>
                    </div>

                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body p-6">
                            {branches.length === 0 ? (
                                <div className="text-center py-8 text-base-content/40">
                                    <MapPin size={40} className="mx-auto mb-3" />
                                    <p className="font-medium">ไม่พบสาขา</p>
                                    <p className="text-sm mt-1">กรุณาสร้างสาขาในหน้า Admin ก่อน</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {branches.map((branch) => (
                                        <button
                                            key={branch.id}
                                            onClick={() => setSelectedBranch(branch.id)}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all text-left"
                                        >
                                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                                <MapPin size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold truncate">{branch.name}</h3>
                                                {branch.address && (
                                                    <p className="text-xs text-base-content/50 truncate">{branch.address}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <Link to="/" className="btn btn-ghost btn-sm mt-4 w-full">
                                ← กลับหน้าหลัก
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    >
                        <Store className="w-6 h-6" />
                    </Link>
                    <Link
                        to="/pos/tables"
                        className={cn("btn btn-square w-full h-14 rounded-xl transition-all", isActive('/pos/tables') ? "btn-active btn-neutral" : "btn-ghost")}
                    >
                        <LayoutGrid className="w-6 h-6" />
                    </Link>
                    <button className="btn btn-square btn-ghost w-full h-14 rounded-xl">
                        <Receipt className="w-6 h-6" />
                    </button>
                    <button className="btn btn-square btn-ghost w-full h-14 rounded-xl">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                <div className="mt-auto flex flex-col gap-4 w-full px-2 items-center">
                    <ThemeToggle />
                    <Link to="/" className="btn btn-square btn-ghost w-full h-14 rounded-xl text-error">
                        <LogOut className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-base-200 border-t border-base-300 flex items-center justify-around py-2 md:hidden">
                <Link
                    to="/pos/home"
                    className={cn("btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2", isActive('/pos/home') && "text-primary")}
                >
                    <Store className="w-5 h-5" />
                    <span className="text-[10px]">Counter</span>
                </Link>
                <Link
                    to="/pos/tables"
                    className={cn("btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2", isActive('/pos/tables') && "text-primary")}
                >
                    <LayoutGrid className="w-5 h-5" />
                    <span className="text-[10px]">Tables</span>
                </Link>
                <Link to="/" className="btn btn-ghost btn-sm flex-col gap-0.5 h-auto py-2 text-error">
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px]">Exit</span>
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0 pb-16 md:pb-0">
                <Outlet />
            </div>
        </div>
    );
};

export default PosLayout;
