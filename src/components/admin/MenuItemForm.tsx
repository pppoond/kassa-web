import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { MenuItem } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';
import { X } from 'lucide-react';

interface MenuItemFormProps {
    initialData?: MenuItem | null;
    onSubmit: (data: Omit<MenuItem, 'id'>) => void;
    onClose: () => void;
    isOpen: boolean;
}

const MenuItemForm = ({ initialData, onSubmit, onClose, isOpen }: MenuItemFormProps) => {
    const { register, handleSubmit, reset, setValue } = useForm<Omit<MenuItem, 'id'>>();
    const categories = useAdminStore((state) => state.categories);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('description', initialData.description || '');
                setValue('price', initialData.price);
                setValue('categoryId', initialData.categoryId);
                setValue('imageUrl', initialData.imageUrl || '');
                setValue('isAvailable', initialData.isAvailable);
            } else {
                reset({
                    name: '',
                    description: '',
                    price: 0,
                    categoryId: '',
                    imageUrl: '',
                    isAvailable: true
                });
            }
        }
    }, [initialData, isOpen, reset, setValue]);

    const handleFormSubmit = (data: Omit<MenuItem, 'id'>) => {
        onSubmit({
            ...data,
            price: Number(data.price)
        });
    };

    return (
        <div 
            className={`overlay modal fixed inset-0 z-[80] transition-all duration-300 ease-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            role="dialog"
            tabIndex={-1}
        >
            <div className={`modal-dialog transition-all duration-300 ease-out w-full max-w-2xl mx-auto my-10 ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0'}`}>
                <div className="modal-content border-0 rounded-3xl shadow-2xl relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
                    {/* Header */}
                    <div className="modal-header flex items-center justify-between p-6 border-b border-base-200 bg-base-200/30 rounded-t-3xl">
                        <h3 className="modal-title text-2xl font-bold text-base-content">
                            {initialData ? 'Edit Menu Item' : 'Add New Item'}
                        </h3>
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all duration-200"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Body */}
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="modal-body p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Item Name"
                                            className="input input-floating input-bordered w-full peer"
                                            id="nameInput"
                                            {...register('name', { required: true })}
                                        />
                                        <label htmlFor="nameInput" className="input-floating-label">Name</label>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <div className="relative">
                                        <select
                                            className="select select-floating select-bordered w-full peer"
                                            id="categorySelect"
                                            {...register('categoryId', { required: true })}
                                        >
                                            <option value="" disabled>Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="categorySelect" className="select-floating-label">Category</label>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="input input-floating input-bordered w-full peer"
                                            id="priceInput"
                                            {...register('price', { required: true, min: 0 })}
                                        />
                                        <label htmlFor="priceInput" className="input-floating-label">Price (฿)</label>
                                    </div>
                                </div>
                                <div className="form-control flex flex-row items-center gap-4 px-2">
                                    <span className="label-text font-medium">Available Status</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        {...register('isAvailable')}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <div className="relative">
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="input input-floating input-bordered w-full peer"
                                        id="imageUrlInput"
                                        {...register('imageUrl')}
                                    />
                                    <label htmlFor="imageUrlInput" className="input-floating-label">Image URL</label>
                                </div>
                            </div>

                            <div className="form-control">
                                <div className="relative">
                                    <textarea
                                        className="textarea textarea-floating textarea-bordered h-28 w-full peer"
                                        placeholder="Item description..."
                                        id="descriptionTextarea"
                                        {...register('description')}
                                    ></textarea>
                                    <label htmlFor="descriptionTextarea" className="textarea-floating-label">Description</label>
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
                                {initialData ? 'Update Item' : 'Create Item'}
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

export default MenuItemForm;
