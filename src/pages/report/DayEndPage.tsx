import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDayEnd } from '../../hooks/useDayEnd';
import { ArrowLeft, Printer, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const DayEndPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { summary, loading, fetchDayEndSummary, closeDay } = useDayEnd();

    useEffect(() => {
        fetchDayEndSummary();
    }, []);

    const handleCloseDay = async () => {
        if (window.confirm(t('report.confirmClose'))) {
            await closeDay();
        }
    };

    if (loading || !summary) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 transition-colors duration-300">
            <header className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="btn btn-circle btn-ghost">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-base-content">{t('report.title')}</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Card */}
                <div className="card bg-base-100 shadow-xl col-span-full">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">{t('report.summary')}</h2>
                        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                            <div className="stat">
                                <div className="stat-title">{t('report.totalSales')}</div>
                                <div className="stat-value text-primary">฿{summary.totalSales.toLocaleString()}</div>
                                <div className="stat-desc">{summary.totalOrders} {t('report.orders')}</div>
                            </div>
                            
                            <div className="stat">
                                <div className="stat-title">{t('report.openedAt')}</div>
                                <div className="stat-value text-lg">{new Date(summary.openedAt).toLocaleTimeString()}</div>
                                <div className="stat-desc">{new Date(summary.openedAt).toLocaleDateString()}</div>
                            </div>

                            <div className="stat">
                                <div className="stat-title">{t('report.status')}</div>
                                <div className={`stat-value text-lg ${summary.closedAt ? 'text-success' : 'text-warning'}`}>
                                    {summary.closedAt ? t('report.closed') : t('report.open')}
                                </div>
                                {summary.closedAt && (
                                    <div className="stat-desc">{new Date(summary.closedAt).toLocaleTimeString()}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">{t('report.paymentMethods')}</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{t('report.method')}</th>
                                        <th className="text-right">{t('report.count')}</th>
                                        <th className="text-right">{t('report.amount')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.paymentMethods.map((pm) => (
                                        <tr key={pm.method}>
                                            <td>{pm.method}</td>
                                            <td className="text-right">{pm.count}</td>
                                            <td className="text-right">฿{pm.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Category Sales */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">{t('report.categorySales')}</h2>
                         <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{t('report.category')}</th>
                                        <th className="text-right">{t('report.count')}</th>
                                        <th className="text-right">{t('report.amount')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.categorySales.map((cat) => (
                                        <tr key={cat.category}>
                                            <td>{cat.category}</td>
                                            <td className="text-right">{cat.count}</td>
                                            <td className="text-right">฿{cat.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-full flex justify-end gap-4 mt-4">
                    <button className="btn btn-outline gap-2">
                        <Printer size={20} />
                        {t('report.print')}
                    </button>
                    {!summary.closedAt && (
                        <button 
                            className="btn btn-error gap-2 text-white"
                            onClick={handleCloseDay}
                        >
                            <Lock size={20} />
                            {t('report.closeDay')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayEndPage;
