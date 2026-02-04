'use client';
import { Inbox } from 'lucide-react';
import styles from './Table.module.css';

export default function Table({
    headers,
    data,
    renderRow,
    keyExtractor,
    className = '',
    striped = false,
    compact = false,
    loading = false,
    emptyMessage = 'No records found.',
    emptySubtext = 'Try adjusting your search or filters.'
}) {
    const tableClassNames = [
        styles.table,
        striped && styles.striped,
        compact && styles.compact
    ].filter(Boolean).join(' ');

    if (loading) {
        return (
            <div className={`${styles.tableWrapper} ${styles.loading}`}>
                <div className={styles.loadingOverlay}>
                    <div className="shimmer" style={{ width: '100%', height: '100%', position: 'absolute' }} />
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Inbox className={styles.emptyIcon} />
                <p>{emptyMessage}</p>
                <span>{emptySubtext}</span>
            </div>
        );
    }

    return (
        <div className={`${styles.tableWrapper} ${className}`}>
            <table className={tableClassNames}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={keyExtractor ? keyExtractor(item) : index}>
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Helper component for status badges in tables
export function TableBadge({ status, children }) {
    const statusClass = {
        success: styles.badgeSuccess,
        warning: styles.badgeWarning,
        danger: styles.badgeDanger,
        info: styles.badgeInfo
    }[status] || '';

    return (
        <span className={`${styles.badge} ${statusClass}`}>
            {children}
        </span>
    );
}

// Helper component for action buttons in tables
export function TableActions({ children }) {
    return <div className={styles.actions}>{children}</div>;
}
