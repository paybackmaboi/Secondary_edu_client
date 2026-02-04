'use client';
import styles from './Select.module.css';

export default function Select({
    label,
    error,
    helperText,
    options = [],
    className = '',
    wrapperClassName = '',
    placeholder = 'Select an option',
    required = false,
    size = 'md',
    ...props
}) {
    const selectClassNames = [
        styles.select,
        error && styles.errorInput,
        className
    ].filter(Boolean).join(' ');

    const wrapperClassNames = [
        styles.wrapper,
        styles[size],
        wrapperClassName
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClassNames}>
            {label && (
                <label className={`${styles.label} ${required ? styles.required : ''}`}>
                    {label}
                </label>
            )}
            <div className={styles.selectWrapper}>
                <select
                    className={selectClassNames}
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
            {!error && helperText && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
}
