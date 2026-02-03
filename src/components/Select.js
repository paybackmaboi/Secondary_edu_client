import styles from './Select.module.css';

export default function Select({
    label,
    error,
    options = [],
    className = '',
    wrapperClassName = '',
    placeholder = 'Select an option',
    ...props
}) {
    return (
        <div className={`${styles.wrapper} ${wrapperClassName}`}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.selectWrapper}>
                <select
                    className={`${styles.select} ${error ? styles.errorInput : ''} ${className}`}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className={styles.arrow} />
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}
