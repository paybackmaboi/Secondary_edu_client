'use client';
import styles from './Card.module.css';

export default function Card({
    children,
    className = '',
    title,
    icon,
    padding = 'lg',
    interactive = false,
    glass = false,
    gradientBorder = false,
    status,
    footer,
    headerActions
}) {
    const classNames = [
        styles.card,
        styles['p-' + padding],
        interactive && styles.interactive,
        glass && styles.glass,
        gradientBorder && styles.gradientBorder,
        status && styles[status],
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames}>
            {title && (
                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        {icon}
                        <span>{title}</span>
                    </div>
                    {headerActions}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
            {footer && (
                <div className={styles.footer}>
                    {footer}
                </div>
            )}
        </div>
    );
}
