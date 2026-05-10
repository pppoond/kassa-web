import { useState, useEffect, useMemo } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Trash2, Edit, Plus, Search, Tag } from 'lucide-react';
import CategoryForm from '../../components/admin/CategoryForm';
import type { Category } from '../../types';

const CategoryPage = () => {
    const { 
        categories, 
        selectedBranchId, 
        fetchCategories, 
        deleteCategory, 
        addCategory, 
        updateCategory,
        isLoading 
    } = useAdminStore();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (selectedBranchId) {
            fetchCategories(selectedBranchId);
        }
    }, [selectedBranchId, fetchCategories]);

    const handleAddClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Omit<Category, 'id'>) => {
        if (!selectedBranchId) return;
        
        if (editingCategory) {
            await updateCategory(editingCategory.id, data);
        } else {
            await addCategory(selectedBranchId, data);
        }
        setIsModalOpen(false);
    };

    const filteredCategories = useMemo(() => {
        return categories.filter(cat => 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [categories, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-base-content/60">Organize your menu items into logical groups</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20" onClick={handleAddClick}>
                    <Plus size={20} />
                    Add New Category
                </button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 items-end bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
                <div className="form-control flex-1 w-full">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search by category name or description..."
                            className="input input-bordered pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
                <table className="table table-lg">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="rounded-tl-2xl w-24">ID</th>
                            <th>Category Name</th>
                            <th>Description</th>
                            <th className="text-right rounded-tr-2xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-base-200/30 transition-colors">
                                <td className="text-xs font-mono text-base-content/40">
                                    {category.id.slice(0, 8)}
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                            <Tag size={18} />
                                        </div>
                                        <div className="font-bold text-lg">{category.name}</div>
                                    </div>
                                </td>
                                <td className="text-base-content/70 italic">
                                    {category.description || 'No description provided'}
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary"
                                            onClick={() => handleEditClick(category)}
                                            title="Edit Category"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error"
                                            onClick={() => confirm('Are you sure you want to delete this category?') && deleteCategory(category.id)}
                                            title="Delete Category"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-base-content/30">
                                        <Search size={48} strokeWidth={1} />
                                        <p className="text-xl font-medium">No categories found matching your search</p>
                                    </div>
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
