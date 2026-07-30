

import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();
    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('admin.dashboard')}</h1>
            <div className="stats stats-vertical sm:stats-horizontal shadow w-full">
                <div className="stat">
                    <div className="stat-title">{t('admin.totalOrders')}</div>
                    <div className="stat-value">0</div>
                </div>

                <div className="stat">
                    <div className="stat-title">{t('admin.totalSales')}</div>
                    <div className="stat-value">฿0</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
