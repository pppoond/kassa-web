import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, User, Mail, UserPlus, Plus, Users, X, Upload, ImageIcon, Eye } from 'lucide-react';
import { InputWithIcon } from '../../components/common/FormField';
import { register as registerUser } from '../../api/auth';
import { getStaffList, resetStaffPassword } from '../../api/staff';
import { uploadFile } from '../../api/upload';
import type { StaffMember } from '../../api/staff';

const StaffPage = () => {
    const queryClient = useQueryClient();
    const { data: staffList = [], isLoading } = useQuery<StaffMember[]>({
        queryKey: ['staff'],
        queryFn: getStaffList,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
    const [resetPasswordFor, setResetPasswordFor] = useState<string | null>(null);
    const [newStaffPassword, setNewStaffPassword] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        setSelectedFile(null);
        setAvatarPreview(null);
        setError('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        // Preview local
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Upload avatar ถ้ามี
            let avatarUrl: string | undefined;
            if (selectedFile) {
                avatarUrl = await uploadFile(selectedFile, 'users');
            }

            await registerUser({ username, password, fullName, email, avatarUrl });
            setSuccess(`Staff "${fullName}" created successfully!`);
            resetForm();
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create staff account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Staff Management</h1>
                    <p className="text-base-content/60">Add and manage your team members</p>
                </div>
                <button
                    className="btn btn-primary gap-2 shadow-lg shadow-primary/20"
                    onClick={() => { resetForm(); setSuccess(''); setIsModalOpen(true); }}
                >
                    <Plus size={20} />
                    Add Staff
                </button>
            </div>

            {success && (
                <div className="alert alert-success rounded-xl">
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Staff List */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
                <table className="table table-lg">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="rounded-tl-2xl">Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th className="text-right rounded-tr-2xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10">
                                    <span className="loading loading-spinner loading-md text-primary"></span>
                                </td>
                            </tr>
                        ) : staffList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-base-content/30">
                                        <Users size={48} strokeWidth={1} />
                                        <p className="text-xl font-medium">No staff members yet</p>
                                        <p className="text-sm">Click "Add Staff" to create the first account</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-base-200/30 transition-colors">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden shrink-0">
                                                {staff.avatarUrl ? (
                                                    <img src={staff.avatarUrl} alt={staff.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold">
                                                        {staff.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="font-bold">{staff.fullName}</div>
                                        </div>
                                    </td>
                                    <td className="font-mono text-sm">{staff.username}</td>
                                    <td className="text-base-content/60">{staff.email || '—'}</td>
                                    <td>
                                        <div className={`badge badge-sm ${staff.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {staff.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </td>
                                    <td className="text-sm text-base-content/50">
                                        {new Date(staff.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="text-right">
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary"
                                            onClick={() => setViewingStaff(staff)}
                                            title="View Info"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Staff Modal */}
            <div
                className={`overlay modal fixed inset-0 z-[80] transition-all duration-300 ${isModalOpen ? 'overlay-open opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
                role="dialog"
                tabIndex={-1}
            >
                <div className={`modal-dialog transition-all duration-300 w-full max-w-lg mx-auto my-10 ${isModalOpen ? 'overlay-open:opacity-100 translate-y-0' : 'translate-y-10'}`}>
                    <div className="modal-content border-0 rounded-3xl shadow-2xl relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
                        <div className="modal-header flex items-center justify-between p-6 border-b border-base-200">
                            <h3 className="modal-title text-2xl font-bold text-base-content">New Staff Account</h3>
                            <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-6 space-y-5">
                                {error && (
                                    <div className="alert alert-error py-3 rounded-xl">
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                {/* Avatar Upload */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border border-base-300 bg-base-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={24} className="text-base-content/20" />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload size={14} />
                                            {selectedFile ? 'Change Photo' : 'Upload Photo'}
                                        </button>
                                        <p className="text-xs text-base-content/40 mt-1">Optional</p>
                                    </div>
                                </div>

                                <InputWithIcon
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    icon={<UserPlus size={20} />}
                                    required
                                />
                                <InputWithIcon
                                    label="Email (Optional)"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail size={20} />}
                                />
                                <InputWithIcon
                                    label="Username"
                                    placeholder="choose_username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    icon={<User size={20} />}
                                    required
                                />
                                <InputWithIcon
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock size={20} />}
                                    required
                                />
                            </div>

                            <div className="modal-footer flex items-center justify-end p-6 border-t border-base-200 gap-3">
                                <button className="btn btn-ghost" type="button" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary px-8 shadow-lg shadow-primary/20 ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[-1] ${isModalOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsModalOpen(false)}></div>
            </div>

            {/* View Staff Info Modal */}
            <div
                className={`overlay modal fixed inset-0 z-[80] transition-all duration-300 ${viewingStaff ? 'overlay-open opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
                role="dialog"
                tabIndex={-1}
            >
                <div className={`modal-dialog transition-all duration-300 w-full max-w-md mx-auto my-10 ${viewingStaff ? 'overlay-open:opacity-100 translate-y-0' : 'translate-y-10'}`}>
                    <div className="modal-content border-0 rounded-3xl shadow-2xl relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
                        <div className="modal-header flex items-center justify-between p-6 border-b border-base-200">
                            <h3 className="modal-title text-2xl font-bold text-base-content">Staff Info</h3>
                            <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={() => setViewingStaff(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        {viewingStaff && (
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden shrink-0">
                                        {viewingStaff.avatarUrl ? (
                                            <img src={viewingStaff.avatarUrl} alt={viewingStaff.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold">
                                                {viewingStaff.fullName.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold">{viewingStaff.fullName}</h4>
                                        <p className="text-sm text-base-content/50 font-mono">@{viewingStaff.username}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                                        <span className="text-sm text-base-content/50">Email</span>
                                        <span className="text-sm font-medium">{viewingStaff.email || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                                        <span className="text-sm text-base-content/50">Status</span>
                                        <div className={`badge badge-sm ${viewingStaff.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {viewingStaff.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                                        <span className="text-sm text-base-content/50">Joined</span>
                                        <span className="text-sm font-medium">{new Date(viewingStaff.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-base-content/50">ID</span>
                                        <span className="text-xs font-mono text-base-content/40">{viewingStaff.id}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2 gap-2">
                                    {resetPasswordFor === viewingStaff.username ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                className="input input-bordered input-sm flex-1"
                                                value={newStaffPassword}
                                                onChange={(e) => setNewStaffPassword(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={async () => {
                                                    if (newStaffPassword.length < 4) return;
                                                    try {
                                                        await resetStaffPassword(viewingStaff.username, newStaffPassword);
                                                        setResetPasswordFor(null);
                                                        setNewStaffPassword('');
                                                        setSuccess('Password reset successfully!');
                                                        setViewingStaff(null);
                                                    } catch {
                                                        setError('Failed to reset password');
                                                    }
                                                }}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => { setResetPasswordFor(null); setNewStaffPassword(''); }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-sm btn-warning btn-outline"
                                                onClick={() => setResetPasswordFor(viewingStaff.username)}
                                            >
                                                Reset Password
                                            </button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => setViewingStaff(null)}>Close</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[-1] ${viewingStaff ? 'opacity-100' : 'opacity-0'}`} onClick={() => setViewingStaff(null)}></div>
            </div>
        </div>
    );
};

export default StaffPage;
