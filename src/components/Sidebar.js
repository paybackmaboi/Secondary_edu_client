"use client";

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
    LogOut
} from 'lucide-react';
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

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>🎓</div>
                <span>EduTrack</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
