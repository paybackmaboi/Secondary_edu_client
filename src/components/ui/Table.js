'use client';
import { motion } from 'framer-motion';

export default function Table({ columns, data, onRowClick }) {
    if (!data || data.length === 0) {
        return <div className="p-8 text-center text-slate-400">No records found.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full">
                <thead className="bg-slate-800">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {data.map((row, rowIdx) => (
                        <motion.tr
                            key={rowIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowIdx * 0.05 }}
                            onClick={() => onRowClick?.(row)}
                            className="bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-4 text-sm text-slate-300">
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
