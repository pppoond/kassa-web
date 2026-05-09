import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, UserPlus, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { registerUser } from '../../api/auth';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await registerUser({
                username,
                password,
                fullName,
                email
            });
            // Success!
            alert('Registration successful! Please sign in.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-6 transition-colors duration-400">
             {/* Header Actions */}
             <div className="absolute top-8 left-8">
                <button 
                    onClick={() => navigate('/login')}
                    className="btn btn-circle btn-ghost hover:bg-base-300"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>
             <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[480px]">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black tracking-tight text-primary">KINDEE</h1>
                    <p className="text-base-content/50 mt-2 font-medium uppercase tracking-[0.2em] text-xs">Join our platform</p>
                </div>

                <div className="card bg-base-100 shadow-2xl shadow-primary/5 border border-base-300">
                    <div className="card-body p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">Create Account</h2>
                            <p className="text-base-content/60 text-sm mt-1">Start managing your restaurant professionally</p>
                        </div>

                        {error && (
                            <div className="alert alert-error mb-6 py-3 rounded-xl shadow-sm">
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-bold text-xs uppercase opacity-50">Full Name</span>
                                </label>
                                <label className="input input-lg input-bordered flex items-center gap-3 bg-base-200/50 border-base-300 focus-within:border-primary transition-all">
                                    <UserPlus size={20} className="opacity-40" />
                                    <input 
                                        type="text" 
                                        className="grow font-medium" 
                                        placeholder="John Doe" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-bold text-xs uppercase opacity-50">Email (Optional)</span>
                                </label>
                                <label className="input input-lg input-bordered flex items-center gap-3 bg-base-200/50 border-base-300 focus-within:border-primary transition-all">
                                    <Mail size={20} className="opacity-40" />
                                    <input 
                                        type="email" 
                                        className="grow font-medium" 
                                        placeholder="john@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="divider my-2 opacity-30">Account Details</div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-bold text-xs uppercase opacity-50">Username</span>
                                </label>
                                <label className="input input-lg input-bordered flex items-center gap-3 bg-base-200/50 border-base-300 focus-within:border-primary transition-all">
                                    <User size={20} className="opacity-40" />
                                    <input 
                                        type="text" 
                                        className="grow font-medium" 
                                        placeholder="choose_username" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-bold text-xs uppercase opacity-50">Password</span>
                                </label>
                                <label className="input input-lg input-bordered flex items-center gap-3 bg-base-200/50 border-base-300 focus-within:border-primary transition-all">
                                    <Lock size={20} className="opacity-40" />
                                    <input 
                                        type="password" 
                                        className="grow font-medium" 
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-control mt-8">
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary btn-lg h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
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

export default RegisterPage;
