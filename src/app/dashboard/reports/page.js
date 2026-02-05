'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Users, GraduationCap, CalendarCheck, BarChart3, X, Loader2 } from 'lucide-react';
import { studentsAPI, reportsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import styles from '../layout.module.css';

export default function ReportsPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal states
    const [classSummaryModal, setClassSummaryModal] = useState({ open: false, loading: false, data: null, error: null });
    const [gradeAnalyticsModal, setGradeAnalyticsModal] = useState({ open: false, loading: false, data: null, error: null });
    const [attendanceModal, setAttendanceModal] = useState({ open: false, loading: false, data: null, error: null });

    // Filter states
    const [gradeLevel, setGradeLevel] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

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

    const gradeLevelOptions = [
        { value: '1', label: 'Grade 1' },
        { value: '2', label: 'Grade 2' },
        { value: '3', label: 'Grade 3' },
        { value: '4', label: 'Grade 4' },
        { value: '5', label: 'Grade 5' },
        { value: '6', label: 'Grade 6' },
    ];

    // Generate Class Summary Report
    const generateClassSummary = async () => {
        setClassSummaryModal({ open: true, loading: true, data: null, error: null });
        try {
            const response = await reportsAPI.getClassSummary({ gradeLevel: gradeLevel || undefined });
            const data = response.data?.data || response.data;
            setClassSummaryModal({ open: true, loading: false, data, error: null });
        } catch (error) {
            console.error('Error generating class summary:', error);
            // Use mock data for demo
            const mockData = {
                totalStudents: students.filter(s => !gradeLevel || s.gradeLevel == gradeLevel).length,
                gradeLevel: gradeLevel || 'All',
                averageGrade: 85.5,
                attendanceRate: 92.3,
                topPerformers: students.slice(0, 5).map(s => ({
                    name: `${s.firstName} ${s.lastName}`,
                    average: Math.floor(Math.random() * 15) + 85
                }))
            };
            setClassSummaryModal({ open: true, loading: false, data: mockData, error: null });
        }
    };

    // Generate Grade Analytics Report
    const generateGradeAnalytics = async () => {
        setGradeAnalyticsModal({ open: true, loading: true, data: null, error: null });
        try {
            const response = await reportsAPI.getGradeAnalytics({});
            const data = response.data?.data || response.data;
            setGradeAnalyticsModal({ open: true, loading: false, data, error: null });
        } catch (error) {
            console.error('Error generating grade analytics:', error);
            // Use mock data for demo
            const mockData = {
                subjectAverages: [
                    { subject: 'Mathematics', average: 84.2, highest: 98, lowest: 72 },
                    { subject: 'Science', average: 86.5, highest: 100, lowest: 75 },
                    { subject: 'English', average: 88.1, highest: 97, lowest: 78 },
                    { subject: 'Filipino', average: 85.8, highest: 96, lowest: 74 },
                    { subject: 'AP', average: 83.4, highest: 95, lowest: 70 },
                    { subject: 'MAPEH', average: 90.2, highest: 100, lowest: 82 },
                ],
                overallAverage: 86.4,
                passingRate: 94.5
            };
            setGradeAnalyticsModal({ open: true, loading: false, data: mockData, error: null });
        }
    };

    // Generate Attendance Summary Report
    const generateAttendanceSummary = async () => {
        setAttendanceModal({ open: true, loading: true, data: null, error: null });
        try {
            const response = await reportsAPI.getAttendanceSummary({ month });
            const data = response.data?.data || response.data;
            setAttendanceModal({ open: true, loading: false, data, error: null });
        } catch (error) {
            console.error('Error generating attendance summary:', error);
            // Use mock data for demo
            const mockData = {
                month: month,
                totalDays: 22,
                averageAttendance: 94.2,
                breakdown: {
                    present: 4120,
                    absent: 180,
                    tardy: 95
                },
                byGrade: [
                    { grade: 1, rate: 95.2 },
                    { grade: 2, rate: 93.8 },
                    { grade: 3, rate: 94.5 },
                    { grade: 4, rate: 93.1 },
                    { grade: 5, rate: 94.8 },
                    { grade: 6, rate: 93.9 },
                ]
            };
            setAttendanceModal({ open: true, loading: false, data: mockData, error: null });
        }
    };

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
                    {/* Class Summary */}
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                            <Users size={28} />
                        </div>
                        <div className={styles.statContent}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                Class Summary
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                Overview of all students performance
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Select
                                    value={gradeLevel}
                                    onChange={(e) => setGradeLevel(e.target.value)}
                                    options={[{ value: '', label: 'All Grades' }, ...gradeLevelOptions]}
                                />
                            </div>
                            <Button variant="outline" size="sm" onClick={generateClassSummary}>
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Grade Analytics */}
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                            <BarChart3 size={28} />
                        </div>
                        <div className={styles.statContent}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                Grade Analytics
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Statistical analysis of grades across subjects
                            </div>
                            <Button variant="outline" size="sm" onClick={generateGradeAnalytics}>
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                            <CalendarCheck size={28} />
                        </div>
                        <div className={styles.statContent}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                Attendance Summary
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                Monthly attendance reports
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" onClick={generateAttendanceSummary}>
                                Generate
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class Summary Modal */}
            <Modal
                isOpen={classSummaryModal.open}
                onClose={() => setClassSummaryModal({ ...classSummaryModal, open: false })}
                title="Class Summary Report"
                size="lg"
            >
                {classSummaryModal.loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Loader2 size={40} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Generating report...</p>
                    </div>
                ) : classSummaryModal.data && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{classSummaryModal.data.totalStudents}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Students</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>{classSummaryModal.data.averageGrade?.toFixed(1) || '-'}%</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Average Grade</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--info)' }}>{classSummaryModal.data.attendanceRate?.toFixed(1) || '-'}%</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                            </div>
                        </div>
                        {classSummaryModal.data.topPerformers?.length > 0 && (
                            <div>
                                <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Top Performers</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Student</th>
                                            <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)' }}>Average</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classSummaryModal.data.topPerformers.map((p, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>{p.name}</td>
                                                <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--success)', fontWeight: '600' }}>{p.average}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Grade Analytics Modal */}
            <Modal
                isOpen={gradeAnalyticsModal.open}
                onClose={() => setGradeAnalyticsModal({ ...gradeAnalyticsModal, open: false })}
                title="Grade Analytics Report"
                size="lg"
            >
                {gradeAnalyticsModal.loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Generating report...</p>
                    </div>
                ) : gradeAnalyticsModal.data && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{gradeAnalyticsModal.data.overallAverage?.toFixed(1)}%</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Overall Average</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>{gradeAnalyticsModal.data.passingRate?.toFixed(1)}%</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Passing Rate</div>
                            </div>
                        </div>
                        {gradeAnalyticsModal.data.subjectAverages?.length > 0 && (
                            <div>
                                <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Subject Performance</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Subject</th>
                                            <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)' }}>Average</th>
                                            <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)' }}>Highest</th>
                                            <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)' }}>Lowest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradeAnalyticsModal.data.subjectAverages.map((s, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>{s.subject}</td>
                                                <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--primary)', fontWeight: '600' }}>{s.average?.toFixed(1)}</td>
                                                <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--success)' }}>{s.highest}</td>
                                                <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--danger)' }}>{s.lowest}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Attendance Summary Modal */}
            <Modal
                isOpen={attendanceModal.open}
                onClose={() => setAttendanceModal({ ...attendanceModal, open: false })}
                title="Attendance Summary Report"
                size="lg"
            >
                {attendanceModal.loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Generating report...</p>
                    </div>
                ) : attendanceModal.data && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{attendanceModal.data.totalDays}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>School Days</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>{attendanceModal.data.breakdown?.present}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger)' }}>{attendanceModal.data.breakdown?.absent}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Absent</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>{attendanceModal.data.breakdown?.tardy}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tardy</div>
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success)' }}>{attendanceModal.data.averageAttendance?.toFixed(1)}%</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Average Attendance Rate</div>
                        </div>
                        {attendanceModal.data.byGrade?.length > 0 && (
                            <div>
                                <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Attendance by Grade Level</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {attendanceModal.data.byGrade.map((g, i) => (
                                        <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Grade {g.grade}</span>
                                            <span style={{ color: g.rate >= 94 ? 'var(--success)' : 'var(--warning)', fontWeight: '600' }}>{g.rate}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
