import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, User, Building, MapPin, UserPlus } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { InputWithIcon } from '../../components/common/FormField';
import { getSystemStatus, setupSystem } from '../../api/system';
import { login as loginApi } from '../../api/auth';

const LoginPage: React.FC = () => {
    const [isSetupNeeded, setIsSetupNeeded] = useState<boolean | null>(null);
    const [setupStep, setSetupStep] = useState(1);
    
    // Login State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Setup State
    const [setupData, setSetupData] = useState({
        organizationName: '',
        branchName: '',
        branchAddress: '',
        adminUsername: 'admin',
        adminPassword: '',
        adminFullName: '',
        adminEmail: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await getSystemStatus();
                setIsSetupNeeded(!status.isSetupCompleted);
            } catch (err) {
                console.error('Failed to check system status', err);
                setIsSetupNeeded(false);
            }
        };
        checkStatus();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await loginApi({ username, password });
            login(response.user, response.token);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await setupSystem(setupData);
            setIsSetupNeeded(false);
            alert('System setup completed! Please login with your new admin account.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Setup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isSetupNeeded === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (isSetupNeeded) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-6 transition-colors duration-400">
                <div className="absolute top-8 right-8">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-[500px]">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-black tracking-tight text-primary">KINDEE</h1>
                        <p className="text-base-content/50 mt-2 font-medium uppercase tracking-[0.2em] text-xs font-bold">First Time Setup</p>
                    </div>

                    <div className="card bg-base-100 shadow-2xl border border-base-300">
                        <div className="card-body p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold">Initial Configuration</h2>
                                <div className="text-xs font-bold opacity-40">STEP {setupStep} OF 2</div>
                            </div>

                            {error && (
                                <div className="alert alert-error mb-6 py-3 rounded-xl">
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            <form onSubmit={setupStep === 1 ? (e) => { e.preventDefault(); setSetupStep(2); } : handleSetup} className="space-y-5">
                                {setupStep === 1 ? (
                                    <>
                                        <InputWithIcon
                                            label="Business Name"
                                            placeholder="My Awesome Restaurant"
                                            value={setupData.organizationName}
                                            onChange={(e) => setSetupData({...setupData, organizationName: e.target.value})}
                                            icon={<Building size={20} />}
                                            required
                                        />
                                        <InputWithIcon
                                            label="Main Branch Name"
                                            placeholder="HQ / Main Branch"
                                            value={setupData.branchName}
                                            onChange={(e) => setSetupData({...setupData, branchName: e.target.value})}
                                            icon={<MapPin size={20} />}
                                            required
                                        />
                                        <button type="submit" className="btn btn-primary btn-lg w-full h-14 rounded-xl font-bold mt-6">
                                            Next: Admin Account
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <InputWithIcon
                                            label="Admin Username"
                                            value={setupData.adminUsername}
                                            onChange={(e) => setSetupData({...setupData, adminUsername: e.target.value})}
                                            icon={<User size={20} />}
                                            required
                                        />
                                        <InputWithIcon
                                            label="Admin Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={setupData.adminPassword}
                                            onChange={(e) => setSetupData({...setupData, adminPassword: e.target.value})}
                                            icon={<Lock size={20} />}
                                            required
                                        />
                                        <InputWithIcon
                                            label="Admin Full Name"
                                            placeholder="System Administrator"
                                            value={setupData.adminFullName}
                                            onChange={(e) => setSetupData({...setupData, adminFullName: e.target.value})}
                                            icon={<UserPlus size={20} />}
                                            required
                                        />
                                        <div className="flex gap-3 mt-6">
                                            <button type="button" onClick={() => setSetupStep(1)} className="btn btn-ghost btn-lg flex-1 h-14 rounded-xl font-bold">Back</button>
                                            <button 
                                                type="submit" 
                                                className={`btn btn-primary btn-lg flex-[2] h-14 rounded-xl font-bold shadow-lg shadow-primary/20 ${loading ? 'loading' : ''}`}
                                                disabled={loading}
                                            >
                                                {loading ? 'Setting up...' : 'Complete Setup'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-6 transition-colors duration-400">
             <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[440px]">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black tracking-tight text-primary">KINDEE</h1>
                    <p className="text-base-content/50 mt-2 font-medium uppercase tracking-[0.2em] text-xs">Management System</p>
                </div>

                <div className="card bg-base-100 shadow-2xl shadow-primary/5 border border-base-300">
                    <div className="card-body p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">Welcome Back</h2>
                            <p className="text-base-content/60 text-sm mt-1">Please enter your credentials to continue</p>
                        </div>

                        {error && (
                            <div className="alert alert-error mb-6 py-3 rounded-xl">
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <InputWithIcon
                                label="Username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                icon={<User size={20} />}
                                required
                            />
                            <div>
                                <InputWithIcon
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock size={20} />}
                                    required
                                />
                                <div className="flex justify-end mt-2">
                                    <button type="button" onClick={() => navigate('/god-reset')} className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
                                </div>
                            </div>
                            <div className="form-control mt-8">
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary btn-lg h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className="divider opacity-50 my-6">OR</div>

                        <div className="text-center">
                            <p className="text-sm text-base-content/60">
                                Contact your administrator to get an account
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 text-center">
                    <p className="text-sm text-base-content/40 font-medium">
                        &copy; 2026 Kindee POS Technologies. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
