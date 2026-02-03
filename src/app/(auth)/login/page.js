'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [particles, setParticles] = useState([]);
    const { login } = useAuth();

    useEffect(() => {
        // Generate particles on client side to avoid hydration mismatch
        setParticles([...Array(20)].map(() => ({
            left: Math.random() * 100,
            delay: Math.random() * 20,
            duration: 15 + Math.random() * 10
        })));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(username, password);
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen live-bg flex items-center justify-center p-4">
            {/* Floating Particles */}
            <div className="particles">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${p.left}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass rounded-3xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="inline-block p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4"
                        >
                            <FaGraduationCap className="text-4xl text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-slate-400 mt-2">Sign in to your account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-300 mb-2">Username</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="text-center text-slate-400 mt-6">
                        Default: <code className="text-indigo-400">superadmin / SuperAdmin@123</code>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
