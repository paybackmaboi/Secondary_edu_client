'use client';
import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import Button from './Button';

export default function Modal({
    isOpen,
    onClose,
    title,
    icon,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true,
    closeOnEsc = true,
    showCloseButton = true
}) {
    const handleEsc = useCallback((e) => {
        if (e.key === 'Escape' && closeOnEsc) {
            onClose();
        }
    }, [onClose, closeOnEsc]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlay) {
            onClose();
        }
    };

    const modalSizeClass = styles[size] || '';

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={`${styles.modal} ${modalSizeClass}`} role="dialog" aria-modal="true">
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {icon}
                        {title}
                    </h3>
                    {showCloseButton && (
                        <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                            <X size={18} />
                        </button>
                    )}
                </div>

                <div className={styles.content}>
                    {children}
                </div>

                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// Confirmation Modal Helper
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
    icon
}) {
    const iconClasses = {
        danger: styles.confirmIconDanger,
        warning: styles.confirmIconWarning,
        success: styles.confirmIconSuccess,
        info: styles.confirmIconInfo
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="sm"
            showCloseButton={false}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} isLoading={loading}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            {icon && (
                <div className={`${styles.confirmIcon} ${iconClasses[variant]}`}>
                    {icon}
                </div>
            )}
            <h4 className={styles.confirmTitle}>{title}</h4>
            <p className={styles.confirmMessage}>{message}</p>
        </Modal>
    );
}
