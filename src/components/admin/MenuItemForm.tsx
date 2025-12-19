import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { MenuItem, Category } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';

interface MenuItemFormProps {
    initialData?: MenuItem | null;
    onSubmit: (data: Omit<MenuItem, 'id'>) => void;
    onClose: () => void;
    isOpen: boolean;
}

const MenuItemForm = ({ initialData, onSubmit, onClose, isOpen }: MenuItemFormProps) => {
    const { register, handleSubmit, reset, setValue } = useForm<Omit<MenuItem, 'id'>>();
    const modalRef = useRef<HTMLDialogElement>(null);
    const categories = useAdminStore((state) => state.categories);

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('description', initialData.description);
            setValue('price', initialData.price);
            setValue('categoryId', initialData.categoryId);
            setValue('imageUrl', initialData.imageUrl);
            setValue('isAvailable', initialData.isAvailable);
        } else {
            reset({
                isAvailable: true
            });
        }
    }, [initialData, reset, setValue]);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    const handleFormSubmit = (data: Omit<MenuItem, 'id'>) => {
        onSubmit({
            ...data,
            price: Number(data.price) // Ensure price is number
        });
        onClose();
        reset();
    };

    return (
        <dialog ref={modalRef} className="modal" onClose={onClose}>
            <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg mb-4">{initialData ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Item Name"
                                className="input input-bordered w-full"
                                {...register('name', { required: true })}
                            />
                        </div>

                        {/* Category */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                {...register('categoryId', { required: true })}
                            >
                                <option value="" disabled selected>Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price (฿)</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="input input-bordered w-full"
                                {...register('price', { required: true, min: 0 })}
                            />
                        </div>

                        {/* Status */}
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <span className="label-text">Available</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    {...register('isAvailable')}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Image URL</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="input input-bordered w-full"
                            {...register('imageUrl')}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="Item description..."
                            {...register('description')}
                        ></textarea>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default MenuItemForm;
