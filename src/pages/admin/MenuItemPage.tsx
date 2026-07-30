import { useState, useEffect, useMemo, Fragment } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Trash2, Edit, Plus, Search, Filter, ToggleLeft, ToggleRight, ChevronDown, Check } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import MenuItemForm from '../../components/admin/MenuItemForm';
import { toggleMenuItemActive } from '../../api/menuItem';
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

    const { selectedBranchId, fetchCategories } = useAdminStore();

    useEffect(() => {
        if (selectedBranchId) {
            fetchCategories(selectedBranchId);
        }
    }, [selectedBranchId, fetchCategories]);

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
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Menu Items</h1>
                    <p className="text-base-content/60 text-sm md:text-base">Manage your product list and pricing</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 w-full md:w-auto" onClick={handleAddClick}>
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
                    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 py-3 pl-4 pr-10 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                <span className="flex items-center gap-2 font-medium">
                                    <Filter size={14} className="opacity-50" />
                                    {selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name || 'Select'}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronDown size={16} className="opacity-40" />
                                </span>
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-base-100 py-1 shadow-xl ring-1 ring-base-300 focus:outline-none">
                                    <Listbox.Option
                                        value="all"
                                        className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-bold' : ''}`}>All Categories</span>
                                                {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={16} /></span>}
                                            </>
                                        )}
                                    </Listbox.Option>
                                    {categories.map(cat => (
                                        <Listbox.Option
                                            key={cat.id}
                                            value={cat.id}
                                            className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-bold' : ''}`}>{cat.name}</span>
                                                    {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={16} /></span>}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
                <table className="table table-sm md:table-lg">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="rounded-tl-2xl">Product</th>
                            <th className="hidden sm:table-cell">Category</th>
                            <th>Price</th>
                            <th className="hidden md:table-cell">Status</th>
                            <th className="text-right rounded-tr-2xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-base-200/30 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="avatar hidden sm:block">
                                            <div className="mask mask-squircle w-10 h-10 md:w-14 md:h-14 bg-base-200 ring ring-base-100">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-base-content/20 bg-base-200">
                                                        <Search size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm md:text-lg">{item.name}</div>
                                            <div className="text-xs text-base-content/50 uppercase tracking-wider font-semibold hidden md:block">ID: {item.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell">
                                    <span className="badge badge-outline badge-sm md:badge-md py-2 md:py-3">{item.categoryName || 'Unknown'}</span>
                                </td>
                                <td className="font-bold text-sm md:text-lg text-primary">
                                    ฿{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="hidden md:table-cell">
                                    <div className={`badge ${item.isAvailable ? 'badge-success' : 'badge-error'} badge-sm gap-1.5`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-success-content' : 'bg-error-content'}`} />
                                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                                    </div>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            className={`btn btn-sm btn-circle btn-ghost ${item.isAvailable ? 'hover:bg-warning/10 hover:text-warning' : 'hover:bg-success/10 hover:text-success'}`}
                                            onClick={async () => { await toggleMenuItemActive(item.id); fetchMenuItems(); }}
                                            title={item.isAvailable ? 'Deactivate' : 'Activate'}
                                        >
                                            {item.isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                        </button>
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
