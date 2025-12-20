import { Users } from 'lucide-react';
import { cn } from '../../utils/cn';

// --- Mock Data ---
const MOCK_TABLES = [
    { id: 1, name: 'T-01', status: 'free', pax: 4 },
    { id: 2, name: 'T-02', status: 'occupied', pax: 2 },
    { id: 3, name: 'T-03', status: 'unpaid', pax: 4 },
    { id: 4, name: 'T-04', status: 'free', pax: 6 },
    { id: 5, name: 'T-05', status: 'free', pax: 2 },
    { id: 6, name: 'T-06', status: 'occupied', pax: 8 },
    { id: 7, name: 'T-07', status: 'free', pax: 4 },
    { id: 8, name: 'T-08', status: 'free', pax: 4 },
];

interface TableLayoutProps {
    onTableClick: (tableId: number) => void;
}

const TableLayout = ({ onTableClick }: TableLayoutProps) => {
    return (
        <div className="p-6 h-full overflow-y-auto bg-base-200/50">
            <h2 className="text-2xl font-bold mb-6">Table Management</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {MOCK_TABLES.map((table) => (
                    <button
                        key={table.id}
                        onClick={() => onTableClick(table.id)}
                        className={cn(
                            "relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 shadow-md",
                            table.status === 'free' && "bg-base-100 border-2 border-success/20 hover:border-success",
                            table.status === 'occupied' && "bg-error/10 border-2 border-error text-error",
                            table.status === 'unpaid' && "bg-warning/10 border-2 border-warning text-warning-content"
                        )}
                    >
                        <span className="text-3xl font-black">{table.name}</span>

                        <div className="flex items-center gap-1 text-sm font-medium opacity-70">
                            <Users className="w-4 h-4" />
                            <span>{table.pax} Pax</span>
                        </div>

                        <div className={cn(
                            "absolute top-3 right-3 w-3 h-3 rounded-full",
                            table.status === 'free' && "bg-success",
                            table.status === 'occupied' && "bg-error animate-pulse",
                            table.status === 'unpaid' && "bg-warning"
                        )} />

                        <div className="absolute bottom-3 text-xs font-bold uppercase tracking-wider opacity-60">
                            {table.status}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TableLayout;
