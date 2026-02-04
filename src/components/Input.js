'use client';
import styles from './Input.module.css';

export default function Input({
    label,
    error,
    success,
    helperText,
    className = '',
    wrapperClassName = '',
    leftIcon,
    rightIcon,
    required = false,
    size = 'md',
    maxLength,
    showCounter = false,
    ...props
}) {
    const inputClassNames = [
        styles.input,
        leftIcon && styles.hasLeftIcon,
        rightIcon && styles.hasRightIcon,
        error && styles.errorInput,
        success && styles.successInput,
        className
    ].filter(Boolean).join(' ');

    const wrapperClassNames = [
        styles.wrapper,
        styles[size],
        wrapperClassName
    ].filter(Boolean).join(' ');

    const currentLength = props.value?.length || 0;
    const isNearLimit = maxLength && currentLength >= maxLength * 0.9;
    const isOverLimit = maxLength && currentLength > maxLength;

    return (
        <div className={wrapperClassNames}>
            {label && (
                <label className={`${styles.label} ${required ? styles.required : ''}`}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                <input
                    className={inputClassNames}
                    maxLength={maxLength}
                    {...props}
                />
                {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
            {!error && helperText && <span className={styles.helperText}>{helperText}</span>}
            {showCounter && maxLength && (
                <span className={`${styles.counter} ${isOverLimit ? styles.counterExceeded : isNearLimit ? styles.counterLimit : ''}`}>
                    {currentLength}/{maxLength}
                </span>
            )}
        </div>
    );
}
