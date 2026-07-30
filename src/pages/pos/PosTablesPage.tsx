import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, QrCode, Receipt, X } from 'lucide-react';
import TableLayout from '../../components/pos/TableLayout';
import { getTables } from '../../api/table';
import { getOrders } from '../../api/order';
import { generateQrToken } from '../../api/customer';
import { useAdminStore } from '../../store/useAdminStore';
import { QRCodeSVG } from 'qrcode.react';
import type { PosTableItem } from '../../components/pos/TableLayout';

const PosTablesPage = () => {
    const navigate = useNavigate();
    const { selectedBranchId } = useAdminStore();
    const [selectedTable, setSelectedTable] = useState<PosTableItem | null>(null);
    const [qrData, setQrData] = useState<{ token: string; tableName: string } | null>(null);

    const { data: tables = [], isLoading: tablesLoading } = useQuery({
        queryKey: ['tables', selectedBranchId],
        queryFn: () => getTables(selectedBranchId || undefined),
        enabled: !!selectedBranchId,
    });

    // Fetch open orders เพื่อดูว่าโต๊ะไหนมี order อยู่
    const { data: openOrders = [] } = useQuery({
        queryKey: ['orders', 'open', selectedBranchId],
        queryFn: () => getOrders(selectedBranchId || undefined),
        enabled: !!selectedBranchId,
        refetchInterval: 15000,
    });

    // สร้าง Set ของ tableId ที่มี open order
    const occupiedTableIds = useMemo(() => {
        return new Set(openOrders.map(o => o.tableId));
    }, [openOrders]);

    // Map tables + order status
    const posTableItems: PosTableItem[] = useMemo(() => {
        return tables.map(t => ({
            id: t.id,
            code: t.code,
            name: t.name,
            isActive: t.isActive,
            status: occupiedTableIds.has(t.id) ? 'occupied' as const : 'free' as const,
        }));
    }, [tables, occupiedTableIds]);

    const handleTableClick = (table: PosTableItem) => {
        setSelectedTable(table);
    };

    const handleNewOrder = () => {
        if (!selectedTable) return;
        navigate(`/pos/home?table=${selectedTable.id}`);
        setSelectedTable(null);
    };

    const handleViewOrder = () => {
        if (!selectedTable) return;
        navigate(`/pos/orders`);
        setSelectedTable(null);
    };

    const handleGenerateQr = async () => {
        if (!selectedTable || !selectedBranchId) return;
        try {
            const result = await generateQrToken(selectedBranchId, selectedTable.id);
            const baseUrl = window.location.origin;
            const qrUrl = `${baseUrl}/customer/order/${result.token}`;
            setQrData({ token: qrUrl, tableName: selectedTable.name });
            setSelectedTable(null);
        } catch {
            alert('ไม่สามารถสร้าง QR Code ได้');
        }
    };

    return (
        <>
            <TableLayout
                tables={posTableItems}
                loading={tablesLoading}
                onTableClick={handleTableClick}
            />

            {/* Action Modal */}
            {selectedTable && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center" role="dialog">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTable(null)}></div>
                    <div className="relative bg-base-100 rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-4">
                        <button
                            className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost"
                            onClick={() => setSelectedTable(null)}
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-5">
                            <h3 className="text-2xl font-black">{selectedTable.code}</h3>
                            <p className="text-sm text-base-content/60">{selectedTable.name}</p>
                            <span className={`badge badge-sm mt-2 ${selectedTable.status === 'occupied' ? 'badge-error' : 'badge-success'}`}>
                                {selectedTable.status === 'occupied' ? 'มีออเดอร์' : 'ว่าง'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleNewOrder}
                                className="btn btn-primary w-full gap-2 justify-start"
                            >
                                <ShoppingCart size={18} />
                                สั่งอาหาร
                            </button>

                            <button
                                onClick={handleGenerateQr}
                                className="btn btn-outline w-full gap-2 justify-start"
                            >
                                <QrCode size={18} />
                                เปิด QR Code
                            </button>

                            {selectedTable.status === 'occupied' && (
                                <button
                                    onClick={handleViewOrder}
                                    className="btn btn-outline btn-warning w-full gap-2 justify-start"
                                >
                                    <Receipt size={18} />
                                    ดูออเดอร์
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {qrData && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center" role="dialog">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQrData(null)}></div>
                    <div className="relative bg-base-100 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
                        <h3 className="text-xl font-bold mb-2">{qrData.tableName}</h3>
                        <p className="text-sm text-base-content/50 mb-6">Scan to order</p>
                        <div className="flex justify-center mb-6">
                            <QRCodeSVG value={qrData.token} size={240} />
                        </div>
                        <p className="text-xs text-base-content/40 mb-4 break-all">{qrData.token}</p>
                        <button className="btn btn-ghost w-full" onClick={() => setQrData(null)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PosTablesPage;
