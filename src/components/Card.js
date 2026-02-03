import styles from './Card.module.css';

export default function Card({ children, className = '', title, padding = 'lg' }) {
    return (
        <div className={`${styles.card} ${styles['p-' + padding]} ${className}`}>
            {title && <div className={styles.header}>{title}</div>}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
