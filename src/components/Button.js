'use client';
import styles from './Button.module.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    fullWidth = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    ...props
}) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        iconOnly && styles.iconOnly,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className={styles.loader} />
            ) : (
                <>
                    {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
                </>
            )}
        </button>
    );
}
