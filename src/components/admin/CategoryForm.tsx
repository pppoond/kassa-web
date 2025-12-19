import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { Category } from '../../types';
import Button from '../common/Button';

interface CategoryFormProps {
    initialData?: Category | null;
    onSubmit: (data: Omit<Category, 'id'>) => void;
    onClose: () => void;
    isOpen: boolean;
}

const CategoryForm = ({ initialData, onSubmit, onClose, isOpen }: CategoryFormProps) => {
    const { register, handleSubmit, reset, setValue } = useForm<Omit<Category, 'id'>>();
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('description', initialData.description);
        } else {
            reset();
        }
    }, [initialData, reset, setValue]);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    const handleFormSubmit = (data: Omit<Category, 'id'>) => {
        onSubmit(data);
        onClose();
        reset();
    };

    return (
        <dialog ref={modalRef} className="modal" onClose={onClose}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{initialData ? 'Edit Category' : 'Add Category'}</h3>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Beverages"
                            className="input input-bordered w-full"
                            {...register('name', { required: true })}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="Category description..."
                            {...register('description')}
                        ></textarea>
                    </div>

                    <div className="modal-action">
                        <Button type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default CategoryForm;
