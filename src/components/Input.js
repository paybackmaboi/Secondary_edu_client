import styles from './Input.module.css';

export default function Input({
    label,
    error,
    className = '',
    wrapperClassName = '',
    ...props
}) {
    return (
        <div className={`${styles.wrapper} ${wrapperClassName}`}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={`${styles.input} ${error ? styles.errorInput : ''} ${className}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}
