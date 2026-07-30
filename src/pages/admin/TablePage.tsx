import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, ToggleLeft, ToggleRight, X, TableProperties, QrCode } from 'lucide-react';
import { getTables, createTable, updateTable, toggleTableActive } from '../../api/table';
import { generateQrToken } from '../../api/customer';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '../../components/common/FormField';
import { useForm } from 'react-hook-form';
import { useAdminStore } from '../../store/useAdminStore';
import type { Table } from '../../api/table';

interface FormData {
    code: string;
    name: string;
}

const TablePage = () => {
    const queryClient = useQueryClient();
    const { selectedBranchId } = useAdminStore();
    const { data: tables = [], isLoading } = useQuery({
        queryKey: ['tables', selectedBranchId],
        queryFn: () => getTables(selectedBranchId || undefined),
        enabled: !!selectedBranchId,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [qrData, setQrData] = useState<{ token: string; tableName: string } | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm<FormData>();

    const createMutation = useMutation({
        mutationFn: (data: FormData) => createTable({ branchId: selectedBranchId!, code: data.code, name: data.name }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tables'] }); setIsModalOpen(false); },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateTable(id, data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tables'] }); setIsModalOpen(false); },
    });

    const handleAdd = () => {
        setEditingTable(null);
        reset({ code: '', name: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (table: Table) => {
        setEditingTable(table);
        setValue('code', table.code);
        setValue('name', table.name);
        setIsModalOpen(true);
    };

    const handleToggle = async (id: string) => {
        await toggleTableActive(id);
        queryClient.invalidateQueries({ queryKey: ['tables'] });
    };

    const handleGenerateQr = async (table: Table) => {
        if (!selectedBranchId) return;
        try {
            const result = await generateQrToken(selectedBranchId, table.id);
            const baseUrl = window.location.origin;
            const qrUrl = `${baseUrl}/customer/order/${result.token}`;
            setQrData({ token: qrUrl, tableName: table.name });
        } catch {
            alert('Failed to generate QR code');
        }
    };

    const onSubmit = (data: FormData) => {
        if (editingTable) {
            updateMutation.mutate({ id: editingTable.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const filtered = tables.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Tables</h1>
                    <p className="text-base-content/60 text-sm md:text-base">Manage restaurant tables for this branch</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 w-full md:w-auto" onClick={handleAdd}>
                    <Plus size={20} />
                    Add Table
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
                <div className="form-control flex-1 w-full">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or code..."
                            className="input input-bordered pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-base-content/30">
                        <TableProperties size={48} strokeWidth={1} />
                        <p className="text-xl font-medium">No tables found</p>
                        <p className="text-sm">Add tables for your branch</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filtered.map((table) => (
                        <div
                            key={table.id}
                            className={`card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all ${!table.isActive ? 'opacity-50' : ''}`}
                        >
                            <div className="card-body p-5 items-center text-center">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${table.isActive ? 'bg-primary/10 text-primary' : 'bg-base-200 text-base-content/30'}`}>
                                    {table.code}
                                </div>
                                <h3 className="font-bold mt-2">{table.name}</h3>
                                <div className={`badge badge-xs ${table.isActive ? 'badge-success' : 'badge-error'}`}>
                                    {table.isActive ? 'Active' : 'Inactive'}
                                </div>
                                <div className="flex gap-1 mt-2">
                                    <button
                                        className={`btn btn-xs btn-ghost ${table.isActive ? 'hover:text-warning' : 'hover:text-success'}`}
                                        onClick={() => handleToggle(table.id)}
                                        title={table.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {table.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    </button>
                                    <button
                                        className="btn btn-xs btn-ghost hover:text-primary"
                                        onClick={() => handleEdit(table)}
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-xs btn-ghost hover:text-secondary"
                                        onClick={() => handleGenerateQr(table)}
                                        title="Generate QR"
                                    >
                                        <QrCode size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <div
                className={`overlay modal fixed inset-0 z-[80] transition-all duration-300 ${isModalOpen ? 'overlay-open opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
                role="dialog"
                tabIndex={-1}
            >
                <div className={`modal-dialog transition-all duration-300 w-full max-w-md mx-4 md:mx-auto my-4 md:my-10 ${isModalOpen ? 'translate-y-0' : 'translate-y-10'}`}>
                    <div className="modal-content border-0 rounded-3xl shadow-2xl bg-base-100">
                        <div className="modal-header flex items-center justify-between p-6 border-b border-base-200">
                            <h3 className="text-2xl font-bold">{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-6 space-y-5">
                                <Input label="Code" placeholder="e.g. A1, B2" registration={register('code', { required: true })} />
                                <Input label="Name" placeholder="e.g. Table A1, VIP Room" registration={register('name', { required: true })} />
                            </div>
                            <div className="flex justify-end p-6 border-t border-base-200 gap-3">
                                <button className="btn btn-ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="btn btn-primary px-8 shadow-lg shadow-primary/20" type="submit">
                                    {editingTable ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] ${isModalOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsModalOpen(false)}></div>
            </div>

            {/* QR Code Modal */}
            {qrData && (
                <div className="overlay modal fixed inset-0 z-[80] overlay-open opacity-100" role="dialog">
                    <div className="modal-dialog w-full max-w-sm mx-auto my-10">
                        <div className="modal-content border-0 rounded-3xl shadow-2xl bg-base-100 p-8 text-center">
                            <h3 className="text-xl font-bold mb-2">{qrData.tableName}</h3>
                            <p className="text-sm text-base-content/50 mb-6">Scan to order</p>
                            <div className="flex justify-center mb-6">
                                <QRCodeSVG value={qrData.token} size={240} />
                            </div>
                            <p className="text-xs text-base-content/40 mb-4 break-all">{qrData.token}</p>
                            <button className="btn btn-ghost w-full" onClick={() => setQrData(null)}>Close</button>
                        </div>
                    </div>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]" onClick={() => setQrData(null)}></div>
                </div>
            )}
        </div>
    );
};

export default TablePage;
