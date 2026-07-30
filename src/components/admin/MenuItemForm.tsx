import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { MenuItem } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';
import { X, Upload, ImageIcon } from 'lucide-react';
import { Input, Textarea, SelectListbox, Toggle } from '../common/FormField';
import { uploadFile } from '../../api/upload';

interface MenuItemFormProps {
    initialData?: MenuItem | null;
    onSubmit: (data: Omit<MenuItem, 'id'>) => void;
    onClose: () => void;
    isOpen: boolean;
}

interface FormData {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
    isAvailable: boolean;
}

const MenuItemForm = ({ initialData, onSubmit, onClose, isOpen }: MenuItemFormProps) => {
    const { register, handleSubmit, reset, setValue, control } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            categoryId: '',
            imageUrl: '',
            isAvailable: true
        }
    });
    const categories = useAdminStore((state) => state.categories);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setUploadError('');
            if (initialData) {
                reset({
                    name: initialData.name,
                    description: initialData.description || '',
                    price: initialData.price,
                    categoryId: initialData.categoryId,
                    imageUrl: initialData.imageUrl || '',
                    isAvailable: initialData.isAvailable
                });
                setPreviewUrl(initialData.imageUrl || null);
            } else {
                reset({
                    name: '',
                    description: '',
                    price: 0,
                    categoryId: '',
                    imageUrl: '',
                    isAvailable: true
                });
                setPreviewUrl(null);
            }
        }
    }, [initialData, isOpen, reset]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate client-side
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Only JPEG, PNG, WebP, and GIF are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size exceeds 5MB limit');
            return;
        }

        setUploadError('');
        setUploading(true);

        try {
            const url = await uploadFile(file, 'menus');
            setValue('imageUrl', url);
            setPreviewUrl(url);
        } catch (err: any) {
            setUploadError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = (data: FormData) => {
        onSubmit({
            ...data,
            price: Number(data.price)
        });
    };

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

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
                                <Input
                                    label="Name"
                                    placeholder="Item name"
                                    registration={register('name', { required: true })}
                                />
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <SelectListbox
                                            label="Category"
                                            placeholder="Select Category"
                                            options={categoryOptions}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <Input
                                    label="Price (฿)"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    registration={register('price', { required: true, min: 0 })}
                                />
                                <div className="form-control justify-end pb-2">
                                    <Toggle label="Available" color="primary" registration={register('isAvailable')} />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-bold text-xs uppercase opacity-50">Image</span>
                                </label>
                                <div className="flex items-start gap-4">
                                    {/* Preview */}
                                    <div className="w-24 h-24 rounded-xl border border-base-300 bg-base-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={32} className="text-base-content/20" />
                                        )}
                                    </div>
                                    {/* Upload Button */}
                                    <div className="flex-1 space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            type="button"
                                            className={`btn btn-sm btn-outline gap-2 ${uploading ? 'loading' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                        >
                                            {!uploading && <Upload size={16} />}
                                            {uploading ? 'Uploading...' : 'Choose Image'}
                                        </button>
                                        <p className="text-xs text-base-content/40">
                                            JPEG, PNG, WebP, GIF — max 5MB
                                        </p>
                                        {uploadError && (
                                            <p className="text-xs text-error font-medium">{uploadError}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Hidden field to store the URL */}
                                <input type="hidden" {...register('imageUrl')} />
                            </div>

                            <Textarea
                                label="Description"
                                placeholder="Item description..."
                                rows={3}
                                registration={register('description')}
                            />
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
                                disabled={uploading}
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
