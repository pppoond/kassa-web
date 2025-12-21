import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const CustomerLayout: React.FC = () => {
    const { orderId } = useParams();

    useEffect(() => {
        // Optional: Force a specific theme or language for mobile if needed
        // For now, we respect user choice or browser default
    }, []);

    return (
        <div className="min-h-screen bg-base-100 transition-colors duration-300 font-sans pb-20"> {/* pb-20 for bottom safe area/drawer */}
            {/* Customer Header */}
            <header className="navbar bg-base-100 shadow-sm sticky top-0 z-40 px-4">
                <div className="flex-1">
                    <h1 className="text-xl font-bold truncate">
                        {orderId ? `Order #${orderId.substring(0, 8)}...` : 'Menu'}
                    </h1>
                </div>
                <div className="flex-none gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            <main className="container mx-auto p-4 max-w-md">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
