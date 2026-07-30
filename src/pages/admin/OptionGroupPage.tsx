import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Settings2, ChevronDown, ChevronRight } from 'lucide-react';
import OptionGroupForm from '../../components/admin/OptionGroupForm';
import OptionList from '../../components/admin/OptionList';
import { useOptionGroups, useCreateOptionGroup, useUpdateOptionGroup } from '../../hooks/useOptionGroups';
import type { OptionGroup, CreateOptionGroupRequest, UpdateOptionGroupRequest } from '../../types';
import { useTranslation } from 'react-i18next';

const OptionGroupPage = () => {
    const { t } = useTranslation();
    const { data: optionGroups = [], isLoading } = useOptionGroups();
    const createMutation = useCreateOptionGroup();
    const updateMutation = useUpdateOptionGroup();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingGroup(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (group: OptionGroup) => {
        setEditingGroup(group);
        setIsModalOpen(true);
    };

    const handleToggleExpand = (groupId: string) => {
        setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
    };

    const handleSubmit = async (data: CreateOptionGroupRequest | UpdateOptionGroupRequest) => {
        if (editingGroup) {
            await updateMutation.mutateAsync({ id: editingGroup.id, data: data as UpdateOptionGroupRequest });
        } else {
            await createMutation.mutateAsync(data as CreateOptionGroupRequest);
        }
        setIsModalOpen(false);
    };

    const filteredGroups = useMemo(() => {
        return optionGroups.filter(group =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [optionGroups, searchQuery]);

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{t('optionGroups.title')}</h1>
                    <p className="text-base-content/60 text-sm md:text-base">{t('optionGroups.subtitle')}</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 w-full md:w-auto" onClick={handleAddClick}>
                    <Plus size={20} />
                    {t('optionGroups.addNew')}
                </button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 items-end bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
                <div className="form-control flex-1 w-full">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                        <input
                            type="text"
                            placeholder={`${t('common.search')}...`}
                            className="input input-bordered pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Option Groups Cards */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-base-content/30">
                        <Settings2 size={48} strokeWidth={1} />
                        <p className="text-xl font-medium">{t('optionGroups.noGroups')}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredGroups.map((group) => (
                        <div
                            key={group.id}
                            className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden transition-all"
                        >
                            {/* Group Header */}
                            <div className="flex items-center gap-2 md:gap-4 p-3 md:p-5">
                                <button
                                    className="btn btn-sm btn-circle btn-ghost"
                                    onClick={() => handleToggleExpand(group.id)}
                                >
                                    {expandedGroupId === group.id ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronRight size={18} />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <h3 className="font-bold text-base md:text-lg truncate">{group.name}</h3>
                                        <div className={`badge badge-xs md:badge-sm ${group.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {group.isActive ? t('common.active') : t('common.inactive')}
                                        </div>
                                        {group.isRequired && (
                                            <div className="badge badge-xs md:badge-sm badge-warning">{t('optionGroups.required')}</div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 text-xs md:text-sm text-base-content/50">
                                        {group.description && (
                                            <span className="truncate max-w-[150px] md:max-w-none">{group.description}</span>
                                        )}
                                        <span>{t('optionGroups.minSelections')}: {group.minSelections} - {t('optionGroups.maxSelections')}: {group.maxSelections}</span>
                                        <span>{group.options.length} {t('optionGroups.options')}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleEditClick(group)}
                                    title={t('common.edit')}
                                >
                                    <Edit size={18} />
                                </button>
                            </div>

                            {/* Expanded Options */}
                            {expandedGroupId === group.id && (
                                <div className="px-5 pb-5 pt-0 border-t border-base-200 bg-base-50">
                                    <OptionList optionGroupId={group.id} options={group.options} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <OptionGroupForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingGroup}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default OptionGroupPage;
