import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, User } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle'; // Import ThemeToggle

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the return url from location state or default to home page
    const from = location.state?.from?.pathname || '/';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock validation - any non-empty username works
        if (username.trim()) {
            login(username);
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-4">
             {/* Theme Toggle Positioned Absolute */}
             <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <div className="avatar placeholder mb-4">
                            <div className="bg-primary text-primary-content rounded-full w-16">
                                <Lock size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">Kassa POS</h2>
                        <p className="text-base-content/60">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <User size={16} className="opacity-70" />
                                <input 
                                    type="text" 
                                    className="grow" 
                                    placeholder="admin" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Lock size={16} className="opacity-70" />
                                <input 
                                    type="password" 
                                    className="grow" 
                                    placeholder="••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <label className="label">
                                <span className="label-text-alt link link-hover">Forgot password?</span>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
