import { Link } from 'react-router-dom';
import { MapPin, Palette, Info } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const PosSettingsPage = () => {
    const { branches, selectedBranchId } = useAdminStore();
    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-base-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Settings</h2>

            <div className="max-w-lg space-y-4">
                {/* Branch Info */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-5">
                        <h3 className="font-bold flex items-center gap-2 mb-3">
                            <MapPin size={18} className="text-primary" />
                            สาขาที่ใช้งาน
                        </h3>
                        <div className="bg-base-200 rounded-xl p-4">
                            <p className="font-bold text-lg">{selectedBranch?.name || '-'}</p>
                            {selectedBranch?.address && (
                                <p className="text-sm text-base-content/60 mt-1">{selectedBranch.address}</p>
                            )}
                        </div>
                        <Link
                            to="/pos/select-branch"
                            className="btn btn-primary btn-sm mt-3 text-white"
                        >
                            เปลี่ยนสาขา
                        </Link>
                    </div>
                </div>

                {/* Appearance */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-5">
                        <h3 className="font-bold flex items-center gap-2 mb-3">
                            <Palette size={18} className="text-primary" />
                            หน้าตา & ภาษา
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">ธีม</span>
                            <ThemeToggle />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-sm font-medium">ภาษา</span>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-5">
                        <h3 className="font-bold flex items-center gap-2 mb-3">
                            <Info size={18} className="text-primary" />
                            ข้อมูลระบบ
                        </h3>
                        <div className="text-sm space-y-1 text-base-content/70">
                            <p>Version: <span className="font-mono">0.1.0</span></p>
                            <p>Branch ID: <span className="font-mono text-xs">{selectedBranchId?.slice(0, 8) || '-'}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosSettingsPage;
