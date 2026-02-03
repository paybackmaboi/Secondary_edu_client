'use client';
import { motion } from 'framer-motion';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) {
    const variants = {
        primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600',
        outline: 'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-xl font-semibold 
        transition-all duration-300 
        shadow-lg hover:shadow-xl
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.button>
    );
}
