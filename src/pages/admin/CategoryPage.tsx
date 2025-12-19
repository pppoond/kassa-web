import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Trash2, Edit, Plus } from 'lucide-react';
import CategoryForm from '../../components/admin/CategoryForm';
import type { Category } from '../../types';

const CategoryPage = () => {
    const { categories, deleteCategory, addCategory, updateCategory } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleAddClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleSubmit = (data: Omit<Category, 'id'>) => {
        if (editingCategory) {
            updateCategory(editingCategory.id, data);
        } else {
            addCategory(data);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Categories</h1>
                <button className="btn btn-primary gap-2" onClick={handleAddClick}>
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td className="font-bold">{category.name}</td>
                                <td>{category.description || '-'}</td>
                                <td className="text-right space-x-2">
                                    <button
                                        className="btn btn-sm btn-square btn-ghost"
                                        onClick={() => handleEditClick(category)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-square btn-error btn-outline"
                                        onClick={() => confirm('Delete?') && deleteCategory(category.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-base-content/50">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CategoryForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingCategory}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default CategoryPage;
