'use client';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Button from '../ui/Button';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                        style={{
                            width: `${200 + i * 150}px`,
                            height: `${200 + i * 150}px`,
                            left: `${20 + i * 10}%`,
                            top: `${10 + i * 15}%`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="inline-block mb-8"
                    >
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl">
                            <FaGraduationCap className="text-6xl text-white" />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                            School Management
                        </span>
                        <br />
                        <span className="text-white">System</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        A comprehensive platform for managing students, grades, attendance,
                        and academic records with role-based access control.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg">
                                Get Started <FaArrowRight className="inline ml-2" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg">
                            Learn More
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
