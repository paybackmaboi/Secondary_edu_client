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
    ChevronRight,
    UserCog,
    FileText,
    BarChart3,
    Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './DashboardSidebar.module.css';

// Role-based menu configuration
const menuConfig = {
    superadmin: [
        {
            section: 'Overview', items: [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            ]
        },
        {
            section: 'Management', items: [
                { name: 'Accounts', href: '/dashboard/accounts', icon: UserCog },
                { name: 'Students', href: '/dashboard/students', icon: Users },
                { name: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
            ]
        },
        {
            section: 'Academic', items: [
                { name: 'Grades', href: '/dashboard/grades', icon: GraduationCap },
                { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck },
                { name: 'Values', href: '/dashboard/values', icon: HeartHandshake },
            ]
        },
        {
            section: 'Reports', items: [
                { name: 'Reports', href: '/dashboard/reports', icon: FileText },
            ]
        },
    ],
    admin: [
        {
            section: 'Overview', items: [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            ]
        },
        {
            section: 'Management', items: [
                { name: 'Students', href: '/dashboard/students', icon: Users },
                { name: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
            ]
        },
        {
            section: 'Academic', items: [
                { name: 'Grades', href: '/dashboard/grades', icon: GraduationCap },
                { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck },
                { name: 'Values', href: '/dashboard/values', icon: HeartHandshake },
            ]
        },
        {
            section: 'Reports', items: [
                { name: 'Reports', href: '/dashboard/reports', icon: FileText },
            ]
        },
    ],
    teacher: [
        {
            section: 'Overview', items: [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            ]
        },
        {
            section: 'My Classes', items: [
                { name: 'Students', href: '/dashboard/students', icon: Users },
                { name: 'Grades', href: '/dashboard/grades', icon: GraduationCap },
                { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck },
                { name: 'Values', href: '/dashboard/values', icon: HeartHandshake },
            ]
        },
    ],
    user: [
        {
            section: 'Overview', items: [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            ]
        },
        {
            section: 'View Only', items: [
                { name: 'Students', href: '/dashboard/students', icon: Users },
            ]
        },
    ],
};

const roleLabels = {
    superadmin: { label: 'Super Admin', icon: Shield, color: '#ef4444' },
    admin: { label: 'Administrator', icon: UserCog, color: '#8b5cf6' },
    teacher: { label: 'Teacher', icon: GraduationCap, color: '#10b981' },
    user: { label: 'User', icon: Users, color: '#6366f1' },
};

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const role = user?.role || 'user';
    const menuSections = menuConfig[role] || menuConfig.user;
    const roleInfo = roleLabels[role] || roleLabels.user;
    const RoleIcon = roleInfo.icon;

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const isActive = (href) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
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

            <div className={styles.roleTag} style={{ '--role-color': roleInfo.color }}>
                <RoleIcon size={14} />
                <span>{roleInfo.label}</span>
            </div>

            <nav className={styles.nav}>
                {menuSections.map((section, sIdx) => (
                    <div key={sIdx} className={styles.section}>
                        <div className={styles.sectionTitle}>{section.section}</div>
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.link} ${active ? styles.active : ''}`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <span className={styles.linkIcon}>
                                        <Icon size={20} />
                                    </span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className={styles.footer}>
                {user && (
                    <div className={styles.userSection}>
                        <div className={styles.avatar} style={{ background: roleInfo.color }}>
                            {getInitials(user.username)}
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user.username}</div>
                            <div className={styles.userRole}>{roleInfo.label}</div>
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
