import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Trash2, Edit, Plus } from 'lucide-react';
import MenuItemForm from '../../components/admin/MenuItemForm';
import type { MenuItem } from '../../types';

const MenuItemPage = () => {
    const { menuItems, categories, deleteMenuItem, addMenuItem, updateMenuItem } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    const handleAddClick = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSubmit = (data: Omit<MenuItem, 'id'>) => {
        if (editingItem) {
            updateMenuItem(editingItem.id, data);
        } else {
            addMenuItem(data);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Menu Items</h1>
                <button className="btn btn-primary gap-2" onClick={handleAddClick}>
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12 bg-base-300">
                                            {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                                        </div>
                                    </div>
                                </td>
                                <td className="font-bold">{item.name}</td>
                                <td>{getCategoryName(item.categoryId)}</td>
                                <td>฿{item.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-error'}`}>
                                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="text-right space-x-2">
                                    <button
                                        className="btn btn-sm btn-square btn-ghost"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-square btn-error btn-outline"
                                        onClick={() => confirm('Delete?') && deleteMenuItem(item.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {menuItems.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-base-content/50">
                                    No menu items found.
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
