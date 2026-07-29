import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Input, Toggle } from '../common/FormField';
import type { Option, CreateOptionRequest, UpdateOptionRequest } from '../../types';

interface OptionFormProps {
    initialData?: Option | null;
    onSubmit: (data: CreateOptionRequest | UpdateOptionRequest) => void;
    onClose: () => void;
    isOpen: boolean;
}

interface FormData {
    name: string;
    description: string;
    additionalPrice: number;
    isDefault: boolean;
    displayOrder: number;
    isActive: boolean;
}

const OptionForm = ({ initialData, onSubmit, onClose, isOpen }: OptionFormProps) => {
    const { register, handleSubmit, reset, setValue } = useForm<FormData>();

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('description', initialData.description || '');
                setValue('additionalPrice', initialData.additionalPrice);
                setValue('isDefault', initialData.isDefault);
                setValue('displayOrder', initialData.displayOrder);
                setValue('isActive', initialData.isActive);
            } else {
                reset({
                    name: '',
                    description: '',
                    additionalPrice: 0,
                    isDefault: false,
                    displayOrder: 0,
                    isActive: true,
                });
            }
        }
    }, [initialData, isOpen, reset, setValue]);

    const handleFormSubmit = (data: FormData) => {
        if (initialData) {
            const updateData: UpdateOptionRequest = {
                name: data.name,
                description: data.description || undefined,
                additionalPrice: Number(data.additionalPrice),
                isDefault: data.isDefault,
                displayOrder: Number(data.displayOrder),
                isActive: data.isActive,
            };
            onSubmit(updateData);
        } else {
            const createData: CreateOptionRequest = {
                name: data.name,
                description: data.description || undefined,
                additionalPrice: Number(data.additionalPrice),
                isDefault: data.isDefault,
                displayOrder: Number(data.displayOrder),
            };
            onSubmit(createData);
        }
    };

    return (
        <div
            className={`overlay modal fixed inset-0 z-[90] transition-all duration-300 ${isOpen ? 'overlay-open opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
            role="dialog"
            tabIndex={-1}
        >
            <div className={`modal-dialog transition-all duration-300 w-full max-w-md mx-auto my-10 ${isOpen ? 'overlay-open:opacity-100 translate-y-0' : 'translate-y-10'}`}>
                <div className="modal-content border-0 rounded-3xl shadow-2xl relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
                    <div className="modal-header flex items-center justify-between p-6 border-b border-base-200">
                        <h3 className="modal-title text-xl font-bold text-base-content">
                            {initialData ? 'Edit Option' : 'Add New Option'}
                        </h3>
                        <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="modal-body p-6 space-y-5">
                            <Input
                                label="Name"
                                placeholder="e.g. Less Sweet"
                                registration={register('name', { required: true })}
                            />

                            <Input
                                label="Description"
                                placeholder="Optional"
                                registration={register('description')}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Additional Price (฿)"
                                    type="number"
                                    step="0.01"
                                    registration={register('additionalPrice', { valueAsNumber: true })}
                                />
                                <Input
                                    label="Display Order"
                                    type="number"
                                    registration={register('displayOrder', { valueAsNumber: true })}
                                />
                            </div>

                            <div className="flex gap-6">
                                <Toggle label="Default" registration={register('isDefault')} />
                                {initialData && (
                                    <Toggle label="Active" color="success" registration={register('isActive')} />
                                )}
                            </div>
                        </div>

                        <div className="modal-footer flex items-center justify-end p-6 border-t border-base-200 gap-3">
                            <button className="btn btn-ghost" type="button" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="btn btn-primary px-8 shadow-lg shadow-primary/20" type="submit">
                                {initialData ? 'Update' : 'Add Option'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[-1] ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
        </div>
    );
};

export default OptionForm;
