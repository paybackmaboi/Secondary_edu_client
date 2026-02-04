'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    GraduationCap,
    CalendarCheck,
    HeartHandshake,
    BookOpen,
    UserPlus,
    ClipboardList,
    TrendingUp,
    TrendingDown,
    Clock,
    UserCog,
    FileText,
    Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { studentsAPI, subjectsAPI, accountsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './layout.module.css';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        subjects: 0,
        accounts: 0,
        loading: true
    });
    const [recentStudents, setRecentStudents] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [studentsRes, subjectsRes] = await Promise.all([
                studentsAPI.getAll(),
                subjectsAPI.getAll()
            ]);

            const students = Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data?.data || []);
            const subjects = Array.isArray(subjectsRes.data) ? subjectsRes.data : (subjectsRes.data?.data || []);

            let accounts = [];
            if (user?.role === 'superadmin') {
                try {
                    const accountsRes = await accountsAPI.getAll();
                    accounts = Array.isArray(accountsRes.data) ? accountsRes.data : (accountsRes.data?.data || []);
                } catch (e) { /* ignore */ }
            }

            setStats({
                students: students.length,
                subjects: subjects.length,
                accounts: accounts.length,
                loading: false
            });

            setRecentStudents(students.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const roleConfig = {
        superadmin: {
            title: 'Super Admin Dashboard',
            stats: [
                { label: 'Total Accounts', value: stats.accounts, icon: UserCog, color: 'Red', change: null },
                { label: 'Total Students', value: stats.students, icon: Users, color: 'Blue', change: '+12%' },
                { label: 'Total Subjects', value: stats.subjects, icon: BookOpen, color: 'Purple', change: null },
                { label: 'System Health', value: '100%', icon: TrendingUp, color: 'Green', change: null },
            ],
            quickActions: [
                { label: 'Add Account', href: '/dashboard/accounts/create', icon: UserPlus },
                { label: 'Add Student', href: '/dashboard/students/create', icon: UserPlus },
                { label: 'Add Subject', href: '/dashboard/subjects/create', icon: Plus },
                { label: 'View Reports', href: '/dashboard/reports', icon: FileText },
            ]
        },
        admin: {
            title: 'Admin Dashboard',
            stats: [
                { label: 'Total Students', value: stats.students, icon: Users, color: 'Blue', change: '+5%' },
                { label: 'Total Subjects', value: stats.subjects, icon: BookOpen, color: 'Purple', change: null },
                { label: 'Grades Recorded', value: '-', icon: GraduationCap, color: 'Green', change: null },
                { label: 'Attendance Today', value: '-', icon: CalendarCheck, color: 'Orange', change: null },
            ],
            quickActions: [
                { label: 'Add Student', href: '/dashboard/students/create', icon: UserPlus },
                { label: 'Record Grades', href: '/dashboard/grades/create', icon: ClipboardList },
                { label: 'Take Attendance', href: '/dashboard/attendance/create', icon: CalendarCheck },
                { label: 'View Reports', href: '/dashboard/reports', icon: FileText },
            ]
        },
        teacher: {
            title: 'Teacher Dashboard',
            stats: [
                { label: 'My Students', value: stats.students, icon: Users, color: 'Blue', change: null },
                { label: 'Pending Grades', value: '-', icon: GraduationCap, color: 'Orange', change: null },
                { label: 'Attendance Today', value: '-', icon: CalendarCheck, color: 'Green', change: null },
                { label: 'Values to Record', value: '-', icon: HeartHandshake, color: 'Purple', change: null },
            ],
            quickActions: [
                { label: 'Record Grades', href: '/dashboard/grades/create', icon: ClipboardList },
                { label: 'Take Attendance', href: '/dashboard/attendance/create', icon: CalendarCheck },
                { label: 'Record Values', href: '/dashboard/values/create', icon: HeartHandshake },
            ]
        },
        user: {
            title: 'Dashboard',
            stats: [
                { label: 'Students', value: stats.students, icon: Users, color: 'Blue', change: null },
            ],
            quickActions: []
        }
    };

    const config = roleConfig[user?.role] || roleConfig.user;

    if (stats.loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={styles.greeting}>{getGreeting()}, {user?.username}!</span>
                    <h1 className={styles.title}>{config.title}</h1>
                </div>
                <div className={styles.headerRight}>
                    <Button variant="primary" leftIcon={<Plus size={18} />}>
                        Quick Add
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {config.stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles['statIcon' + stat.color]}`}>
                                <Icon size={28} />
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>{stat.label}</div>
                                <div className={styles.statValue}>{stat.value}</div>
                                {stat.change && (
                                    <div className={`${styles.statChange} ${stat.change.startsWith('+') ? styles.statChangeUp : styles.statChangeDown}`}>
                                        {stat.change.startsWith('+') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {stat.change} from last month
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            {config.quickActions.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Quick Actions</h2>
                    </div>
                    <div className={styles.quickActions}>
                        {config.quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Link key={index} href={action.href} className={styles.actionCard}>
                                    <div className={styles.actionIcon}>
                                        <Icon size={20} />
                                    </div>
                                    <span className={styles.actionText}>{action.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Two Column Layout */}
            <div className={styles.twoColumn}>
                {/* Recent Students */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Students</h2>
                        <Link href="/dashboard/students">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>
                    <Card padding="none">
                        <div className={styles.activityList}>
                            {recentStudents.length > 0 ? recentStudents.map((student, index) => (
                                <div key={student.id || index} className={styles.activityItem}>
                                    <div className={styles.activityIcon}>
                                        <Users size={18} />
                                    </div>
                                    <div className={styles.activityContent}>
                                        <div className={styles.activityTitle}>
                                            {student.firstName} {student.lastName}
                                        </div>
                                        <div className={styles.activityTime}>
                                            LRN: {student.lrn || 'N/A'} • Grade {student.gradeLevel || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className={styles.activityItem}>
                                    <div className={styles.activityContent}>
                                        <div className={styles.activityTitle}>No students found</div>
                                        <div className={styles.activityTime}>Add your first student to get started</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Activity Feed */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Activity</h2>
                    </div>
                    <Card padding="none">
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    <Clock size={18} />
                                </div>
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>Dashboard loaded</div>
                                    <div className={styles.activityTime}>Just now</div>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    <Users size={18} />
                                </div>
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>{stats.students} students in system</div>
                                    <div className={styles.activityTime}>Current count</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
