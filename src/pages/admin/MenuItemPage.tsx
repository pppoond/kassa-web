import { useState, useEffect, useMemo } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Trash2, Edit, Plus, Search, Filter } from 'lucide-react';
import MenuItemForm from '../../components/admin/MenuItemForm';
import type { MenuItem } from '../../types';

const MenuItemPage = () => {
    const { 
        menuItems, 
        categories, 
        fetchMenuItems, 
        deleteMenuItem, 
        addMenuItem, 
        updateMenuItem 
    } = useAdminStore();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    const handleAddClick = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Omit<MenuItem, 'id'>) => {
        if (editingItem) {
            await updateMenuItem(editingItem.id, data);
        } else {
            await addMenuItem(data);
        }
        setIsModalOpen(false);
    };

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [menuItems, searchQuery, selectedCategory]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Menu Items</h1>
                    <p className="text-base-content/60">Manage your product list and pricing</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20" onClick={handleAddClick}>
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 items-end bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
                <div className="form-control flex-1 w-full">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search by item name..."
                            className="input input-bordered pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="form-control w-full md:w-64">
                    <div className="relative">
                        <select 
                            className="select select-floating select-bordered w-full peer"
                            id="filterCategory"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <label htmlFor="filterCategory" className="select-floating-label flex items-center gap-2">
                            <Filter size={14} /> Category
                        </label>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
                <table className="table table-lg">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="rounded-tl-2xl">Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th className="text-right rounded-tr-2xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-base-200/30 transition-colors">
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-14 h-14 bg-base-200 ring ring-base-100">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-base-content/20 bg-base-200">
                                                        <Search size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{item.name}</div>
                                            <div className="text-xs text-base-content/50 uppercase tracking-wider font-semibold">ID: {item.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-outline badge-md py-3">{getCategoryName(item.categoryId)}</span>
                                </td>
                                <td className="font-bold text-lg text-primary">
                                    ฿{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td>
                                    <div className={`badge ${item.isAvailable ? 'badge-success' : 'badge-error'} badge-sm gap-1.5`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-success-content' : 'bg-error-content'}`} />
                                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                                    </div>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary"
                                            onClick={() => handleEditClick(item)}
                                            title="Edit Item"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error"
                                            onClick={() => confirm('Are you sure you want to delete this item?') && deleteMenuItem(item.id)}
                                            title="Delete Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-base-content/30">
                                        <Search size={48} strokeWidth={1} />
                                        <p className="text-xl font-medium">No items found matching your search</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <MenuItemForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingItem}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default MenuItemPage;
