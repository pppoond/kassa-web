import { useState, useRef, Fragment } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, User, Mail, UserPlus, Plus, Users, X, Upload, ImageIcon, Eye, Shield, ChevronDown, Check } from 'lucide-react';
import { InputWithIcon } from '../../components/common/FormField';
import { Listbox, Transition } from '@headlessui/react';
import { register as registerUser } from '../../api/auth';
import { getStaffList, resetStaffPassword } from '../../api/staff';
import { uploadFile } from '../../api/upload';
import { getRoles, getUserBranchPermissions, assignBranchPermission, revokeBranchPermission } from '../../api/roles';
import { getBranches } from '../../api/branch';
import type { StaffMember } from '../../api/staff';
import type { RoleDto, UserBranchDto } from '../../api/roles';
import type { Branch } from '../../types';
import { useTranslation } from 'react-i18next';

const StaffPage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: staffList = [], isLoading } = useQuery<StaffMember[]>({
        queryKey: ['staff'],
        queryFn: getStaffList,
    });
    const { data: roles = [] } = useQuery<RoleDto[]>({
        queryKey: ['roles'],
        queryFn: getRoles,
    });
    const { data: allBranches = [] } = useQuery<Branch[]>({
        queryKey: ['branches'],
        queryFn: () => getBranches(),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
    const [resetPasswordFor, setResetPasswordFor] = useState<string | null>(null);
    const [newStaffPassword, setNewStaffPassword] = useState('');
    const [userBranches, setUserBranches] = useState<UserBranchDto[]>([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState('');
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
        setSelectedRoleId('');
        setSelectedFile(null);
        setAvatarPreview(null);
        setError('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let avatarUrl: string | undefined;
            if (selectedFile) {
                avatarUrl = await uploadFile(selectedFile, 'users');
            }

            await registerUser({ username, password, fullName, email, avatarUrl, roleId: selectedRoleId || undefined });
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
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{t('staff.title')}</h1>
                    <p className="text-base-content/60 text-sm md:text-base">{t('staff.subtitle')}</p>
                </div>
                <button
                    className="btn btn-primary gap-2 shadow-lg shadow-primary/20 w-full md:w-auto"
                    onClick={() => { resetForm(); setSuccess(''); setIsModalOpen(true); }}
                >
                    <Plus size={20} />
                    {t('staff.addNew')}
                </button>
            </div>

            {success && (
                <div className="alert alert-success rounded-xl">
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Staff List */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
                <table className="table table-sm md:table-lg">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="rounded-tl-2xl">{t('common.name')}</th>
                            <th className="hidden sm:table-cell">{t('auth.username')}</th>
                            <th className="hidden md:table-cell">{t('staff.email')}</th>
                            <th>{t('common.status')}</th>
                            <th className="hidden lg:table-cell">{t('staff.joined')}</th>
                            <th className="text-right rounded-tr-2xl">{t('common.actions')}</th>
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
                                        <p className="text-xl font-medium">{t('staff.noStaff')}</p>
                                        <p className="text-sm">{t('staff.noStaffDesc')}</p>
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
                                    <td className="hidden sm:table-cell font-mono text-sm">{staff.username}</td>
                                    <td className="hidden md:table-cell text-base-content/60">{staff.email || '—'}</td>
                                    <td>
                                        <div className={`badge badge-sm ${staff.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {staff.isActive ? t('common.active') : t('common.inactive')}
                                        </div>
                                    </td>
                                    <td className="hidden lg:table-cell text-sm text-base-content/50">
                                        {new Date(staff.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="text-right">
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary"
                                            onClick={async () => {
                                                setViewingStaff(staff);
                                                try {
                                                    const bp = await getUserBranchPermissions(staff.id);
                                                    setUserBranches(bp);
                                                } catch { setUserBranches([]); }
                                            }}
                                            title={t('common.details')}
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
                            <h3 className="modal-title text-2xl font-bold text-base-content">{t('staff.newStaff')}</h3>
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
                                            {selectedFile ? t('staff.changePhoto') : t('staff.uploadPhoto')}
                                        </button>
                                    </div>
                                </div>

                                <InputWithIcon
                                    label={t('staff.fullName')}
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    icon={<UserPlus size={20} />}
                                    required
                                />
                                <InputWithIcon
                                    label={t('staff.email')}
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail size={20} />}
                                />
                                <InputWithIcon
                                    label={t('auth.username')}
                                    placeholder="choose_username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    icon={<User size={20} />}
                                    required
                                />
                                <InputWithIcon
                                    label={t('auth.password')}
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock size={20} />}
                                    required
                                />

                                {/* Role Selection */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text font-bold text-xs uppercase opacity-50">{t('staff.role')}</span>
                                    </label>
                                    <Listbox value={selectedRoleId} onChange={setSelectedRoleId}>
                                        <div className="relative">
                                            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 py-3 pl-4 pr-10 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                                <span className={`block truncate ${selectedRoleId ? 'font-medium' : 'opacity-50'}`}>
                                                    {roles.find(r => r.id === selectedRoleId)?.name || t('staff.selectRole')}
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown size={16} className="opacity-40" />
                                                </span>
                                            </Listbox.Button>
                                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <Listbox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-base-100 py-1 shadow-xl ring-1 ring-base-300 focus:outline-none">
                                                    {roles.map(role => (
                                                        <Listbox.Option
                                                            key={role.id}
                                                            value={role.id}
                                                            className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>{role.name}</span>
                                                                    {role.description && <span className="block text-xs opacity-50">{role.description}</span>}
                                                                    {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={16} /></span>}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>

                            <div className="modal-footer flex items-center justify-end p-6 border-t border-base-200 gap-3">
                                <button className="btn btn-ghost" type="button" onClick={() => setIsModalOpen(false)}>
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary px-8 shadow-lg shadow-primary/20 ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? t('staff.creating') : t('staff.createAccount')}
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
                            <h3 className="modal-title text-2xl font-bold text-base-content">{t('staff.staffInfo')}</h3>
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
                                        <span className="text-sm text-base-content/50">{t('staff.email')}</span>
                                        <span className="text-sm font-medium">{viewingStaff.email || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                                        <span className="text-sm text-base-content/50">{t('common.status')}</span>
                                        <div className={`badge badge-sm ${viewingStaff.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {viewingStaff.isActive ? t('common.active') : t('common.inactive')}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                                        <span className="text-sm text-base-content/50">{t('staff.joined')}</span>
                                        <span className="text-sm font-medium">{new Date(viewingStaff.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Branch Permissions */}
                                <div className="pt-2">
                                    <h4 className="font-bold text-xs uppercase opacity-50 mb-2 flex items-center gap-1">
                                        <Shield size={14} /> {t('staff.branchAccess')}
                                    </h4>
                                    <div className="space-y-2">
                                        {allBranches.map(branch => {
                                            const hasAccess = userBranches.some(ub => ub.branchId === branch.id && ub.canAccess);
                                            return (
                                                <label key={branch.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 cursor-pointer">
                                                    <span className="text-sm font-medium">{branch.name}</span>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-sm toggle-primary"
                                                        checked={hasAccess}
                                                        onChange={async (e) => {
                                                            if (e.target.checked) {
                                                                await assignBranchPermission(viewingStaff.id, branch.id, true);
                                                            } else {
                                                                await revokeBranchPermission(viewingStaff.id, branch.id);
                                                            }
                                                            const bp = await getUserBranchPermissions(viewingStaff.id);
                                                            setUserBranches(bp);
                                                        }}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2 gap-2">
                                    {resetPasswordFor === viewingStaff.username ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="password"
                                                placeholder={t('godReset.newPassword')}
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
                                                {t('common.confirm')}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => { setResetPasswordFor(null); setNewStaffPassword(''); }}
                                            >
                                                {t('common.cancel')}
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-sm btn-warning btn-outline"
                                                onClick={() => setResetPasswordFor(viewingStaff.username)}
                                            >
                                                {t('staff.resetPassword')}
                                            </button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => setViewingStaff(null)}>{t('common.close')}</button>
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
