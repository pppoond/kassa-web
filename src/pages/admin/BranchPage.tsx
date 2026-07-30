import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, MapPin, X } from 'lucide-react';
import { getBranches } from '../../api/branch';
import apiClient from '../../api/client';
import { Input, Textarea } from '../../components/common/FormField';
import { useForm } from 'react-hook-form';
import type { Branch, ApiResponse } from '../../types';
import { useTranslation } from 'react-i18next';

interface FormData {
    name: string;
    address: string;
    phone: string;
}

const BranchPage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: branches = [], isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: () => getBranches(),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm<FormData>();

    const createMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const res = await apiClient.post<ApiResponse<{ id: string }>>('/branches', data);
            return res.data.data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }); setIsModalOpen(false); },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            await apiClient.put(`/branches/${id}`, data);
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }); setIsModalOpen(false); },
    });

    const handleAdd = () => {
        setEditingBranch(null);
        reset({ name: '', address: '', phone: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setValue('name', branch.name);
        setValue('address', branch.address || '');
        setValue('phone', branch.phone || '');
        setIsModalOpen(true);
    };

    const onSubmit = (data: FormData) => {
        if (editingBranch) {
            updateMutation.mutate({ id: editingBranch.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{t('branches.title')}</h1>
                    <p className="text-base-content/60 text-sm md:text-base">{t('branches.subtitle')}</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 w-full md:w-auto" onClick={handleAdd}>
                    <Plus size={20} />
                    {t('branches.addNew')}
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : branches.length === 0 ? (
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-base-content/30">
                        <MapPin size={48} strokeWidth={1} />
                        <p className="text-xl font-medium">{t('branches.noBranches')}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branches.map((branch) => (
                        <div key={branch.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all">
                            <div className="card-body p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{branch.name}</h3>
                                            <div className={`badge badge-xs ${branch.isActive ? 'badge-success' : 'badge-error'}`}>
                                                {branch.isActive ? t('common.active') : t('common.inactive')}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary"
                                        onClick={() => handleEdit(branch)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                </div>
                                {branch.address && (
                                    <p className="text-sm text-base-content/60 mt-3">{branch.address}</p>
                                )}
                                {branch.phone && (
                                    <p className="text-sm text-base-content/50 font-mono">{branch.phone}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <div
                className={`overlay modal fixed inset-0 z-[80] transition-all duration-300 ${isModalOpen ? 'overlay-open opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
                role="dialog"
                tabIndex={-1}
            >
                <div className={`modal-dialog transition-all duration-300 w-full max-w-lg mx-4 md:mx-auto my-4 md:my-10 ${isModalOpen ? 'translate-y-0' : 'translate-y-10'}`}>
                    <div className="modal-content border-0 rounded-3xl shadow-2xl bg-base-100">
                        <div className="modal-header flex items-center justify-between p-6 border-b border-base-200">
                            <h3 className="text-2xl font-bold">{editingBranch ? t('branches.editBranch') : t('branches.addBranch')}</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-6 space-y-5">
                                <Input label={t('branches.name')} placeholder="e.g. Main Branch, Siam Square" registration={register('name', { required: true })} />
                                <Textarea label={t('branches.address')} placeholder="Full address..." rows={3} registration={register('address')} />
                                <Input label={t('branches.phone')} placeholder="e.g. 02-xxx-xxxx" registration={register('phone')} />
                            </div>
                            <div className="flex justify-end p-6 border-t border-base-200 gap-3">
                                <button className="btn btn-ghost" type="button" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</button>
                                <button className="btn btn-primary px-8 shadow-lg shadow-primary/20" type="submit">
                                    {editingBranch ? t('common.update') : t('common.create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] ${isModalOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsModalOpen(false)}></div>
            </div>
        </div>
    );
};

export default BranchPage;
