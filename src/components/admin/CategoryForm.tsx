import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Category } from '../../types';
import { X } from 'lucide-react';

interface CategoryFormProps {
    initialData?: Category | null;
    onSubmit: (data: Omit<Category, 'id'>) => void;
    onClose: () => void;
    isOpen: boolean;
}

const CategoryForm = ({ initialData, onSubmit, onClose, isOpen }: CategoryFormProps) => {
    const { register, handleSubmit, reset, setValue } = useForm<Omit<Category, 'id'>>();

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('description', initialData.description || '');
            } else {
                reset({
                    name: '',
                    description: ''
                });
            }
        }
    }, [initialData, isOpen, reset, setValue]);

    const handleFormSubmit = (data: Omit<Category, 'id'>) => {
        onSubmit(data);
    };

    return (
        <div 
            className={`overlay modal fixed inset-0 z-[80] transition-all duration-300 ${isOpen ? 'overlay-open opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
            role="dialog"
            tabIndex={-1}
        >
            <div className={`modal-dialog transition-all duration-300 w-full max-w-lg mx-auto my-10 ${isOpen ? 'overlay-open:opacity-100 translate-y-0' : 'translate-y-10'}`}>
                <div className="modal-content border-0 rounded-3xl shadow-2xl relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
                    {/* Header */}
                    <div className="modal-header flex items-center justify-between p-6 border-b border-base-200">
                        <h3 className="modal-title text-2xl font-bold text-base-content">
                            {initialData ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="modal-body p-6 space-y-6">
                            <div className="form-control">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Category Name"
                                        className="input input-floating input-bordered w-full peer"
                                        id="catNameInput"
                                        {...register('name', { required: true })}
                                    />
                                    <label htmlFor="catNameInput" className="input-floating-label">Name</label>
                                </div>
                            </div>
                            
                            <div className="form-control">
                                <div className="relative">
                                    <textarea
                                        className="textarea textarea-floating textarea-bordered h-32 w-full peer"
                                        placeholder="Category description..."
                                        id="catDescriptionTextarea"
                                        {...register('description')}
                                    ></textarea>
                                    <label htmlFor="catDescriptionTextarea" className="textarea-floating-label">Description</label>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer flex items-center justify-end p-6 border-t border-base-200 gap-3">
                            <button
                                className="btn btn-ghost"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary px-8 shadow-lg shadow-primary/20"
                                type="submit"
                            >
                                {initialData ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Backdrop */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[-1] ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
        </div>
    );
};

export default CategoryForm;
