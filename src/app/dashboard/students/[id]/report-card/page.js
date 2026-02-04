'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, User } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from '../../../layout.module.css';
import reportStyles from './report.module.css';

export default function ReportCardPage() {
    const params = useParams();
    const router = useRouter();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (params.id) {
            loadReportCard(params.id);
        }
    }, [params.id]);

    const loadReportCard = async (studentId) => {
        try {
            setLoading(true);
            const response = await studentsAPI.getReportCard(studentId);
            const data = response.data?.data || response.data;
            setReportData(data);
        } catch (err) {
            console.error('Error loading report card:', err);
            setError(err.response?.data?.message || 'Failed to load report card');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading report card...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className={styles.header}>
                    <Link href="/dashboard/students">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Students
                        </Button>
                    </Link>
                </div>
                <Card>
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
                        {error}
                    </div>
                </Card>
            </div>
        );
    }

    const student = reportData?.student;
    const grades = reportData?.grades || [];
    const attendance = reportData?.attendance || [];
    const observedValues = reportData?.observedValues || [];

    const totalPresent = attendance.reduce((sum, a) => sum + (a.daysPresent || 0), 0);
    const totalAbsent = attendance.reduce((sum, a) => sum + (a.daysAbsent || 0), 0);
    const totalTardy = attendance.reduce((sum, a) => sum + (a.daysTardy || 0), 0);

    return (
        <div>
            <div className={`${styles.header} ${reportStyles.noPrint}`}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard/students">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Students
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Report Card</h1>
                </div>
                <div className={styles.headerRight}>
                    <Button variant="secondary" leftIcon={<Printer size={18} />} onClick={handlePrint}>
                        Print
                    </Button>
                </div>
            </div>

            <div className={reportStyles.reportCard}>
                {/* Header */}
                <div className={reportStyles.reportHeader}>
                    <h1>Republic of the Philippines</h1>
                    <h2>Department of Education</h2>
                    <h3>LEARNER'S PROGRESS REPORT CARD</h3>
                </div>

                {/* Student Info */}
                <Card title="Learner Information" icon={<User size={20} />} padding="lg">
                    <div className={reportStyles.infoGrid}>
                        <div className={reportStyles.infoItem}>
                            <span className={reportStyles.infoLabel}>Name:</span>
                            <span className={reportStyles.infoValue}>
                                {student?.lastName}, {student?.firstName} {student?.middleName || ''}
                            </span>
                        </div>
                        <div className={reportStyles.infoItem}>
                            <span className={reportStyles.infoLabel}>LRN:</span>
                            <span className={reportStyles.infoValue}>{student?.lrn || 'N/A'}</span>
                        </div>
                        <div className={reportStyles.infoItem}>
                            <span className={reportStyles.infoLabel}>Grade Level:</span>
                            <span className={reportStyles.infoValue}>Grade {student?.gradeLevel || 'N/A'}</span>
                        </div>
                        <div className={reportStyles.infoItem}>
                            <span className={reportStyles.infoLabel}>Section:</span>
                            <span className={reportStyles.infoValue}>{student?.section || 'N/A'}</span>
                        </div>
                        <div className={reportStyles.infoItem}>
                            <span className={reportStyles.infoLabel}>School Year:</span>
                            <span className={reportStyles.infoValue}>{student?.schoolYear || '2024-2025'}</span>
                        </div>
                    </div>
                </Card>

                {/* Grades */}
                <Card title="Report on Learning Progress and Achievement" padding="none" style={{ marginTop: '1.5rem' }}>
                    <div className={reportStyles.tableWrapper}>
                        <table className={reportStyles.gradeTable}>
                            <thead>
                                <tr>
                                    <th>Learning Areas</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>Final Rating</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.length > 0 ? grades.map((grade, index) => {
                                    const final = grade.finalRating || (
                                        grade.q1 && grade.q2 && grade.q3 && grade.q4
                                            ? Math.round((grade.q1 + grade.q2 + grade.q3 + grade.q4) / 4)
                                            : null
                                    );
                                    const remarks = final ? (final >= 75 ? 'Passed' : 'Failed') : '-';
                                    return (
                                        <tr key={index}>
                                            <td>{grade.Subject?.name || `Subject ${grade.subjectId}`}</td>
                                            <td>{grade.q1 || '-'}</td>
                                            <td>{grade.q2 || '-'}</td>
                                            <td>{grade.q3 || '-'}</td>
                                            <td>{grade.q4 || '-'}</td>
                                            <td className={reportStyles.finalGrade}>{final || '-'}</td>
                                            <td className={remarks === 'Passed' ? reportStyles.passed : reportStyles.failed}>
                                                {remarks}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No grades recorded yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Attendance */}
                <Card title="Report on Learner's Attendance" padding="none" style={{ marginTop: '1.5rem' }}>
                    <div className={reportStyles.tableWrapper}>
                        <table className={reportStyles.attendanceTable}>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Days Present</th>
                                    <th>Days Absent</th>
                                    <th>Times Tardy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.length > 0 ? attendance.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.month}</td>
                                        <td className={reportStyles.present}>{record.daysPresent || 0}</td>
                                        <td className={reportStyles.absent}>{record.daysAbsent || 0}</td>
                                        <td className={reportStyles.tardy}>{record.daysTardy || 0}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No attendance records yet
                                        </td>
                                    </tr>
                                )}
                                <tr className={reportStyles.totalRow}>
                                    <td><strong>Total</strong></td>
                                    <td className={reportStyles.present}><strong>{totalPresent}</strong></td>
                                    <td className={reportStyles.absent}><strong>{totalAbsent}</strong></td>
                                    <td className={reportStyles.tardy}><strong>{totalTardy}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Observed Values */}
                <Card title="Report on Learner's Observed Values" padding="none" style={{ marginTop: '1.5rem' }}>
                    <div className={reportStyles.tableWrapper}>
                        <table className={reportStyles.valuesTable}>
                            <thead>
                                <tr>
                                    <th>Core Values</th>
                                    <th>Behavior Statements</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {observedValues.length > 0 ? observedValues.map((value, index) => (
                                    <tr key={index}>
                                        <td className={reportStyles.coreValue}>{value.coreValue}</td>
                                        <td>{value.behaviorStatement}</td>
                                        <td>{value.q1 || '-'}</td>
                                        <td>{value.q2 || '-'}</td>
                                        <td>{value.q3 || '-'}</td>
                                        <td>{value.q4 || '-'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No observed values recorded yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className={reportStyles.legend}>
                        <strong>Marking:</strong> AO - Always Observed | SO - Sometimes Observed | RO - Rarely Observed | NO - Not Observed
                    </div>
                </Card>
            </div>
        </div>
    );
}
