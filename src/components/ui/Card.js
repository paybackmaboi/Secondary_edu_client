'use client';
import { motion } from 'framer-motion';

export default function Card({
    children,
    className = '',
    hover = true,
    glass = false
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -5, scale: 1.01 } : {}}
            className={`
        ${glass
                    ? 'bg-white/10 backdrop-blur-lg border border-white/20'
                    : 'bg-slate-800 border border-slate-700'
                }
        rounded-2xl p-6 shadow-xl
        transition-all duration-300
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}
