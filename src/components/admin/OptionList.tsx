import { useState } from 'react';
import { Plus, Edit, CircleDot } from 'lucide-react';
import OptionForm from './OptionForm';
import { useCreateOption, useUpdateOption } from '../../hooks/useOptionGroups';
import type { Option, CreateOptionRequest, UpdateOptionRequest } from '../../types';

interface OptionListProps {
    optionGroupId: string;
    options: Option[];
}

const OptionList = ({ optionGroupId, options }: OptionListProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<Option | null>(null);

    const createMutation = useCreateOption();
    const updateMutation = useUpdateOption();

    const handleAddClick = () => {
        setEditingOption(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (option: Option) => {
        setEditingOption(option);
        setIsFormOpen(true);
    };

    const handleSubmit = async (data: CreateOptionRequest | UpdateOptionRequest) => {
        if (editingOption) {
            await updateMutation.mutateAsync({
                optionGroupId,
                optionId: editingOption.id,
                data: data as UpdateOptionRequest,
            });
        } else {
            await createMutation.mutateAsync({
                optionGroupId,
                data: data as CreateOptionRequest,
            });
        }
        setIsFormOpen(false);
    };

    return (
        <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-base-content/40">
                    Options ({options.length})
                </span>
                <button
                    className="btn btn-xs btn-ghost btn-circle hover:bg-primary/10 hover:text-primary"
                    onClick={handleAddClick}
                    title="Add Option"
                >
                    <Plus size={14} />
                </button>
            </div>

            {options.length > 0 ? (
                <div className="space-y-1.5">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="flex items-center justify-between px-3 py-2 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <CircleDot size={14} className={option.isActive ? 'text-success' : 'text-base-content/20'} />
                                <span className="text-sm font-medium">{option.name}</span>
                                {option.isDefault && (
                                    <span className="badge badge-xs badge-primary">default</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {option.additionalPrice > 0 && (
                                    <span className="text-xs font-bold text-primary">+฿{option.additionalPrice.toFixed(2)}</span>
                                )}
                                <button
                                    className="btn btn-xs btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleEditClick(option)}
                                >
                                    <Edit size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-base-content/30 italic px-3">No options yet</p>
            )}

            <OptionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingOption}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default OptionList;
