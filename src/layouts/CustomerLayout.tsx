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
        <div className="min-h-screen bg-base-200 transition-colors duration-400 font-sans pb-20">
            {/* Customer Header */}
            <header className="navbar bg-base-100/80 backdrop-blur-md shadow-sm sticky top-0 z-40 px-6 border-b border-base-300">
                <div className="flex-1">
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-primary leading-none">KINDEE</span>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
                            {orderId ? `Order #${orderId.substring(0, 6)}` : 'Digital Menu'}
                        </span>
                    </div>
                </div>
                <div className="flex-none gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            <main className="container mx-auto p-4 max-w-lg">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
