import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowLeft, KeyRound } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { InputWithIcon } from '../../components/common/FormField';
import { godVerify, godResetPassword } from '../../api/god';

const GodResetPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'verify' | 'reset'>('verify');
    const [godPassword, setGodPassword] = useState('');
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const t = await godVerify(godPassword);
            setToken(t);
            setStep('reset');
        } catch {
            setError('Invalid god password');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');

        try {
            await godResetPassword({ token, username, newPassword, confirmPassword });
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-4 md:p-6 transition-colors duration-400">
            <div className="absolute top-4 left-4 md:top-8 md:left-8">
                <button onClick={() => navigate('/login')} className="btn btn-circle btn-sm md:btn-md btn-ghost hover:bg-base-300">
                    <ArrowLeft size={20} />
                </button>
            </div>
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[440px]">
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex p-3 md:p-4 rounded-2xl bg-warning/10 text-warning mb-4">
                        <Shield size={32} className="md:w-10 md:h-10" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">God Mode</h1>
                    <p className="text-base-content/50 mt-2 text-sm">Emergency password reset</p>
                </div>

                <div className="card bg-base-100 shadow-2xl border border-base-300">
                    <div className="card-body p-6 md:p-8">
                        {error && (
                            <div className="alert alert-error mb-4 py-3 rounded-xl">
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success mb-4 py-3 rounded-xl">
                                <span className="text-sm font-medium">{success}</span>
                            </div>
                        )}

                        {step === 'verify' ? (
                            <form onSubmit={handleVerify} className="space-y-5">
                                <p className="text-sm text-base-content/60 mb-4">
                                    Enter the god password from your server environment to proceed.
                                </p>
                                <InputWithIcon
                                    label="God Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={godPassword}
                                    onChange={(e) => setGodPassword(e.target.value)}
                                    icon={<KeyRound size={20} />}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={`btn btn-warning btn-lg w-full h-14 rounded-xl font-bold ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleReset} className="space-y-5">
                                <div className="badge badge-success badge-sm gap-1 mb-2">Verified — token expires in 5 min</div>
                                <InputWithIcon
                                    label="Username"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    icon={<User size={20} />}
                                    required
                                />
                                <InputWithIcon
                                    label="New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    icon={<Lock size={20} />}
                                    required
                                />
                                <InputWithIcon
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    icon={<Lock size={20} />}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={`btn btn-primary btn-lg w-full h-14 rounded-xl font-bold shadow-lg shadow-primary/20 ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GodResetPage;
