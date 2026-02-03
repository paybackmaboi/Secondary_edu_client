'use client';
import { FaGraduationCap, FaGithub, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                                <FaGraduationCap className="text-xl text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">EduManage</span>
                        </div>
                        <p className="text-slate-400">
                            Complete school management solution for the Philippine K-12 curriculum.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition">Login</Link></li>
                            <li><Link href="#features" className="text-slate-400 hover:text-indigo-400 transition">Features</Link></li>
                            <li><Link href="#about" className="text-slate-400 hover:text-indigo-400 transition">About</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-indigo-400 transition">
                                <FaGithub className="text-2xl" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-400 transition">
                                <FaEnvelope className="text-2xl" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
                    © {new Date().getFullYear()} EduManage. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
