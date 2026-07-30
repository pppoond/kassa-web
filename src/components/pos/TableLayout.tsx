import { TableProperties } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PosTableItem {
    id: string;
    code: string;
    name: string;
    status: 'free' | 'occupied';
    isActive: boolean;
}

interface TableLayoutProps {
    tables: PosTableItem[];
    loading?: boolean;
    onTableClick: (table: PosTableItem) => void;
}

const TableLayout = ({ tables, loading, onTableClick }: TableLayoutProps) => {
    if (loading) {
        return (
            <div className="p-6 h-full flex items-center justify-center bg-base-200/50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (tables.length === 0) {
        return (
            <div className="p-6 h-full flex flex-col items-center justify-center bg-base-200/50 text-base-content/30">
                <TableProperties size={64} strokeWidth={1} />
                <p className="text-xl font-bold mt-4">No tables found</p>
                <p className="text-sm mt-1">Add tables in admin settings</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto bg-base-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Tables</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {tables.map((table) => (
                    <button
                        key={table.id}
                        onClick={() => onTableClick(table)}
                        disabled={!table.isActive}
                        className={cn(
                            "relative aspect-square rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center gap-1 md:gap-2 transition-all hover:scale-105 shadow-md",
                            table.status === 'free' && table.isActive && "bg-base-100 border-2 border-success/20 hover:border-success",
                            table.status === 'occupied' && "bg-error/10 border-2 border-error text-error",
                            !table.isActive && "bg-base-200 border-2 border-base-300 opacity-50 cursor-not-allowed"
                        )}
                    >
                        <span className="text-xl md:text-3xl font-black">{table.code}</span>

                        <span className="text-xs md:text-sm font-medium opacity-70 truncate max-w-full px-1">
                            {table.name}
                        </span>

                        <div className={cn(
                            "absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full",
                            table.status === 'free' && table.isActive && "bg-success",
                            table.status === 'occupied' && "bg-error animate-pulse",
                            !table.isActive && "bg-base-content/20"
                        )} />

                        <div className="absolute bottom-2 md:bottom-3 text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-60">
                            {!table.isActive ? 'inactive' : table.status}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TableLayout;
