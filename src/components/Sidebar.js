'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CalendarCheck,
    HeartHandshake,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Sidebar.module.css';

const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Grades', href: '/grades', icon: GraduationCap },
    { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
    { name: 'Values', href: '/observed-values', icon: HeartHandshake },
    { name: 'Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Accounts', href: '/accounts', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <button
                className={styles.toggleBtn}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={styles.logo}>
                <div className={styles.logoIcon}>🎓</div>
                <span>EduTrack</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                            title={collapsed ? item.name : undefined}
                        >
                            <span className={styles.linkIcon}>
                                <Icon size={20} />
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                {user && (
                    <div className={styles.userSection}>
                        <div className={styles.avatar}>
                            {getInitials(user.username)}
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user.username}</div>
                            <div className={styles.userRole}>{user.role}</div>
                        </div>
                    </div>
                )}
                <button className={styles.logoutBtn} onClick={logout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
