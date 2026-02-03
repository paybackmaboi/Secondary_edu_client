import styles from './Button.module.css';

export default function Button({
    children,
    variant = 'primary', // primary, secondary, outline, danger
    size = 'md', // sm, md, lg
    className = '',
    isLoading = false,
    ...props
}) {
    return (
        <button
            className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]} 
        ${className}
      `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className={styles.loader}></span> : children}
        </button>
    );
}
