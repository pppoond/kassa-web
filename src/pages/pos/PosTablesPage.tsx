import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TableLayout from '../../components/pos/TableLayout';
import { getTables } from '../../api/table';
import { getOrders } from '../../api/order';
import { useAdminStore } from '../../store/useAdminStore';
import type { PosTableItem } from '../../components/pos/TableLayout';

const PosTablesPage = () => {
    const navigate = useNavigate();
    const { selectedBranchId } = useAdminStore();

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
        refetchInterval: 15000, // refresh ทุก 15 วินาที
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

    const handleTableClick = (tableId: string) => {
        // Navigate ไปหน้า counter พร้อม pre-select table
        navigate(`/pos/home?table=${tableId}`);
    };

    return (
        <TableLayout
            tables={posTableItems}
            loading={tablesLoading}
            onTableClick={handleTableClick}
        />
    );
};

export default PosTablesPage;
