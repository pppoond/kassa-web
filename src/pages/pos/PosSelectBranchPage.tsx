import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const PosSelectBranchPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { branches, fetchBranches, setSelectedBranch } = useAdminStore();

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleSelect = (branchId: string) => {
        setSelectedBranch(branchId);
        navigate('/pos/home');
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-content font-bold text-2xl shadow-lg mx-auto mb-4">
                        K
                    </div>
                    <h1 className="text-2xl font-black text-primary">KINDEE POS</h1>
                    <p className="text-base-content/50 mt-1 text-sm">{t('pos.selectBranchTitle')}</p>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body p-6">
                        {branches.length === 0 ? (
                            <div className="text-center py-8 text-base-content/40">
                                <MapPin size={40} className="mx-auto mb-3" />
                                <p className="font-medium">{t('branches.noBranches')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => handleSelect(branch.id)}
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
                            ← {t('common.backToHome')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosSelectBranchPage;
