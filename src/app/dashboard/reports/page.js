'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Users, GraduationCap, CalendarCheck, BarChart3 } from 'lucide-react';
import { studentsAPI, subjectsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import styles from '../layout.module.css';

export default function ReportsPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setStudents(data);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    const studentOptions = students.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName} (${s.lrn || 'No LRN'})`
    }));

    const reportTypes = [
        {
            title: 'Student Report Card',
            description: 'Generate individual report cards with grades, attendance, and observed values',
            icon: FileText,
            color: 'Blue',
            action: 'Generate',
            requiresStudent: true,
            href: selectedStudent ? `/dashboard/students/${selectedStudent}/report-card` : null
        },
        {
            title: 'Class Summary',
            description: 'Overview of all students performance in a class',
            icon: Users,
            color: 'Green',
            action: 'Generate',
            requiresStudent: false,
            href: null // TODO: Implement
        },
        {
            title: 'Grade Analytics',
            description: 'Statistical analysis of grades across subjects',
            icon: BarChart3,
            color: 'Purple',
            action: 'Generate',
            requiresStudent: false,
            href: null // TODO: Implement
        },
        {
            title: 'Attendance Summary',
            description: 'Monthly and quarterly attendance reports',
            icon: CalendarCheck,
            color: 'Orange',
            action: 'Generate',
            requiresStudent: false,
            href: null // TODO: Implement
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Reports</h1>
                    <span className={styles.greeting}>Generate and download reports</span>
                </div>
            </div>

            {/* Student Selection for Report Card */}
            <Card title="Generate Report Card" icon={<FileText size={20} />} padding="lg">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Select a student to generate their complete report card with grades, attendance, and observed values.
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                        <Select
                            label="Select Student"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            options={studentOptions}
                            placeholder="Choose a student..."
                        />
                    </div>
                    {selectedStudent && (
                        <Link href={`/dashboard/students/${selectedStudent}/report-card`}>
                            <Button variant="primary" leftIcon={<FileText size={18} />}>
                                View Report Card
                            </Button>
                        </Link>
                    )}
                </div>
            </Card>

            {/* Report Types Grid */}
            <div style={{ marginTop: '1.5rem' }}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Available Reports</h2>
                <div className={styles.statsGrid}>
                    {reportTypes.map((report, index) => {
                        const Icon = report.icon;
                        return (
                            <div key={index} className={styles.statCard}>
                                <div className={`${styles.statIcon} ${styles['statIcon' + report.color]}`}>
                                    <Icon size={28} />
                                </div>
                                <div className={styles.statContent}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                        {report.title}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        {report.description}
                                    </div>
                                    {report.href ? (
                                        <Link href={report.href}>
                                            <Button variant="outline" size="sm">
                                                {report.action}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            Coming Soon
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
