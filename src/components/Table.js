import styles from './Table.module.css';

export default function Table({ headers, data, renderRow, keyExtractor, className = '' }) {
    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No records found.</p>
            </div>
        );
    }

    return (
        <div className={`${styles.tableWrapper} ${className}`}>
            <table className={styles.table}>
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
