import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Receipt, CheckCircle, Clock, XCircle, AlertTriangle, QrCode } from 'lucide-react';
import { getOrders, completeOrder, cancelOrder } from '../../api/order';
import { generateQrToken } from '../../api/customer';
import { useAdminStore } from '../../store/useAdminStore';
import { QRCodeSVG } from 'qrcode.react';

const PosOrdersPage = () => {
    const { selectedBranchId } = useAdminStore();
    const queryClient = useQueryClient();
    const [confirmOrder, setConfirmOrder] = useState<{ id: string; tableName: string; action: 'complete' | 'cancel' } | null>(null);
    const [processing, setProcessing] = useState(false);
    const [qrData, setQrData] = useState<{ token: string; tableName: string } | null>(null);

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders', 'open', selectedBranchId],
        queryFn: () => getOrders(selectedBranchId || undefined),
        enabled: !!selectedBranchId,
        refetchInterval: 10000,
    });

    const handleComplete = async () => {
        if (!confirmOrder) return;
        setProcessing(true);
        try {
            await completeOrder(confirmOrder.id);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setConfirmOrder(null);
        } catch {
            alert('ไม่สามารถปิดออเดอร์ได้');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (!confirmOrder) return;
        setProcessing(true);
        try {
            await cancelOrder(confirmOrder.id);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setConfirmOrder(null);
        } catch {
            alert('ไม่สามารถยกเลิกออเดอร์ได้');
        } finally {
            setProcessing(false);
        }
    };

    const handleGenerateQr = async (tableId: string, tableName: string) => {
        if (!selectedBranchId) return;
        try {
            const result = await generateQrToken(selectedBranchId, tableId);
            const baseUrl = window.location.origin;
            const qrUrl = `${baseUrl}/customer/order/${result.token}`;
            setQrData({ token: qrUrl, tableName });
        } catch {
            alert('ไม่สามารถสร้าง QR Code ได้');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return <span className="badge badge-warning badge-sm gap-1"><Clock size={12} />Open</span>;
            case 'completed':
            case 'paid':
                return <span className="badge badge-success badge-sm gap-1"><CheckCircle size={12} />Completed</span>;
            case 'cancelled':
                return <span className="badge badge-error badge-sm gap-1"><XCircle size={12} />Cancelled</span>;
            default:
                return <span className="badge badge-ghost badge-sm">{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-base-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Orders</h2>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-base-content/30">
                    <Receipt size={64} strokeWidth={1} />
                    <p className="text-xl font-bold mt-4">ไม่มีออเดอร์</p>
                    <p className="text-sm mt-1">ยังไม่มีออเดอร์ที่เปิดอยู่</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
                    <table className="table table-sm md:table-md w-full">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th>Order</th>
                                <th>Table</th>
                                <th>Status</th>
                                <th className="text-right">Amount</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-base-200/30">
                                    <td>
                                        <span className="font-mono text-xs text-base-content/60">
                                            #{order.id.slice(0, 8)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-bold">{order.tableName || 'N/A'}</span>
                                    </td>
                                    <td>
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="text-right">
                                        <span className="font-bold text-primary">
                                            ฿{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-1">
                                            {order.status.toLowerCase() === 'open' && (
                                                <>
                                                    <button
                                                        onClick={() => handleGenerateQr(order.tableId, order.tableName)}
                                                        className="btn btn-ghost btn-xs tooltip"
                                                        data-tip="QR Code"
                                                    >
                                                        <QrCode size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmOrder({ id: order.id, tableName: order.tableName, action: 'complete' })}
                                                        className="btn btn-success btn-xs text-white gap-1"
                                                    >
                                                        <CheckCircle size={14} />
                                                        ปิดบิล
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmOrder({ id: order.id, tableName: order.tableName, action: 'cancel' })}
                                                        className="btn btn-error btn-xs text-white gap-1"
                                                    >
                                                        <XCircle size={14} />
                                                        ยกเลิก
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmOrder && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOrder(null)}></div>
                    <div className="relative bg-base-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                        <div className="flex flex-col items-center text-center">
                            <div className={`p-3 rounded-full mb-4 ${confirmOrder.action === 'cancel' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">
                                {confirmOrder.action === 'cancel' ? 'ยืนยันยกเลิกออเดอร์' : 'ยืนยันปิดบิล'}
                            </h3>
                            <p className="text-base-content/60 text-sm">
                                {confirmOrder.action === 'cancel'
                                    ? <>คุณต้องการยกเลิกออเดอร์ของ <span className="font-bold text-base-content">{confirmOrder.tableName}</span> ใช่หรือไม่?</>
                                    : <>คุณต้องการปิดออเดอร์ของ <span className="font-bold text-base-content">{confirmOrder.tableName}</span> ใช่หรือไม่?</>
                                }
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                className="btn btn-ghost flex-1"
                                onClick={() => setConfirmOrder(null)}
                                disabled={processing}
                            >
                                ปิด
                            </button>
                            <button
                                className={`btn flex-1 text-white ${confirmOrder.action === 'cancel' ? 'btn-error' : 'btn-success'} ${processing ? 'loading' : ''}`}
                                onClick={confirmOrder.action === 'cancel' ? handleCancel : handleComplete}
                                disabled={processing}
                            >
                                {!processing && (confirmOrder.action === 'cancel' ? <XCircle size={16} /> : <CheckCircle size={16} />)}
                                {processing ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {qrData && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center" role="dialog">
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
        </div>
    );
};

export default PosOrdersPage;
