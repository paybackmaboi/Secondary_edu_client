'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
    FaHome, FaUsers, FaUserGraduate, FaChartBar,
    FaCalendarCheck, FaBook, FaClipboardList, FaSignOutAlt,
    FaGraduationCap
} from 'react-icons/fa';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout, hasRole } = useAuth();

    const menuItems = [
        { icon: FaHome, label: 'Dashboard', href: user ? `/${user.role}` : '/', roles: ['superadmin', 'admin', 'teacher', 'user'] },
        { icon: FaUsers, label: 'Accounts', href: '/superadmin/accounts', roles: ['superadmin'] },
        { icon: FaUserGraduate, label: 'Students', href: '/admin/students', roles: ['superadmin', 'admin', 'teacher'] },
        { icon: FaChartBar, label: 'Grades', href: '/admin/grades', roles: ['superadmin', 'admin', 'teacher'] },
        { icon: FaCalendarCheck, label: 'Attendance', href: '/admin/attendance', roles: ['superadmin', 'admin', 'teacher'] },
        { icon: FaBook, label: 'Subjects', href: '/admin/subjects', roles: ['superadmin', 'admin'] },
        { icon: FaClipboardList, label: 'Report Cards', href: '/admin/reports', roles: ['superadmin', 'admin', 'teacher'] },
    ];

    return (
        <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 p-6 z-50"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                    <FaGraduationCap className="text-xl text-white" />
                </div>
                <span className="text-xl font-bold text-white">EduManage</span>
            </div>

            {/* User Info */}
            <div className="mb-8 p-4 rounded-xl bg-slate-700/50">
                <p className="text-white font-semibold">{user?.username || 'Guest'}</p>
                <p className="text-xs text-indigo-400 capitalize">{user?.role || 'Visitor'}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {menuItems
                    .filter(item => !user || item.roles.includes(user.role))
                    .map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={idx} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                            : 'text-slate-400 hover:bg-slate-700'
                                        }
                  `}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
            </nav>

            {/* Logout */}
            <button
                onClick={logout}
                className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
            >
                <FaSignOutAlt />
                <span>Logout</span>
            </button>
        </motion.aside>
    );
}
