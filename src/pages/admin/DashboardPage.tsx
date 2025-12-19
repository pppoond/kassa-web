import React from 'react';

const DashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Total Orders</div>
                    <div className="stat-value">0</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Total Sales</div>
                    <div className="stat-value">฿0</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
