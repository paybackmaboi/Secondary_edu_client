'use client';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';
import Button from '../ui/Button';

export default function Navbar() {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                            <FaGraduationCap className="text-xl text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">EduManage</span>
                    </div>
                </Link>

                <div className="hidden md:flex gap-4">
                    <Link href="/login">
                        <Button variant="outline" size="sm">Login</Button>
                    </Link>
                    <Link href="/login">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
