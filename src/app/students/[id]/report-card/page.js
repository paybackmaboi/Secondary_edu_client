"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function ReportCardPage() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) fetchReport();
    }, [id]);

    async function fetchReport() {
        try {
            setLoading(true);
            const data = await api.students.getReportCard(id);
            setReport(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className={styles.loading}>Generating report card...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!report) return <div className={styles.error}>No data available.</div>;

    const { student, grades, attendance, coreValues } = report;

    return (
        <div className={styles.container}>
            {/* No-Print Header */}
            <div className={styles.toolbar}>
                <Link href={`/students/${id}`} className={styles.backLink}>
                    <ArrowLeft size={20} /> Back to Profile
                </Link>
                <Button onClick={handlePrint}>
                    <Printer size={20} /> Print Report
                </Button>
            </div>

            {/* Printable Area */}
            <div className={styles.reportCard}>
                <div className={styles.schoolHeader}>
                    <h2>DEPARTMENT OF EDUCATION</h2>
                    <h1>ELEMENTARY SCHOOL PROGRESS REPORT CARD</h1>
                    <h3>School Year: {student.schoolYear}</h3>
                </div>

                <div className={styles.studentInfo}>
                    <div className={styles.infoRow}>
                        <span><strong>Name:</strong> {student.lastName}, {student.firstName} {student.middleName}</span>
                        <span><strong>LRN:</strong> {student.lrn}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span><strong>Grade:</strong> {student.gradeLevel}</span>
                        <span><strong>Section:</strong> {student.section}</span>
                        <span><strong>Sex:</strong> {student.sex}</span>
                        <span><strong>Age:</strong> {student.age}</span>
                    </div>
                </div>

                <div className={styles.gridContainer}>
                    {/* Left Column: Grades */}
                    <div className={styles.gradesSection}>
                        <h3>REPORT ON LEARNING PROGRESS AND ACHIEVEMENT</h3>
                        <table className={styles.reportTable}>
                            <thead>
                                <tr>
                                    <th>Learning Areas</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>Final</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades && grades.map((g, i) => (
                                    <tr key={i}>
                                        <td className={styles.subjectName}>{g.subjectName}</td>
                                        <td>{g.q1}</td>
                                        <td>{g.q2}</td>
                                        <td>{g.q3}</td>
                                        <td>{g.q4}</td>
                                        <td><strong>{g.finalRating || g.semFinalGrade}</strong></td>
                                        <td>{g.remarks}</td>
                                    </tr>
                                ))}
                                {!grades?.length && <tr><td colSpan="7">No grades recorded.</td></tr>}
                                {/* General Average Row could go here if calculated */}
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column: Values & Attendance */}
                    <div className={styles.sideSection}>
                        <h3>REPORT ON LEARNER'S OBSERVED VALUES</h3>
                        <table className={styles.reportTable}>
                            <thead>
                                <tr>
                                    <th>Core Values</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coreValues && coreValues.map((v, i) => (
                                    <tr key={i}>
                                        <td className={styles.subjectName}>
                                            <div className={styles.coreValueTitle}>{v.coreValue}</div>
                                            <div className={styles.behavior}>{v.behaviorStatement}</div>
                                        </td>
                                        <td>{v.q1}</td>
                                        <td>{v.q2}</td>
                                        <td>{v.q3}</td>
                                        <td>{v.q4}</td>
                                    </tr>
                                ))}
                                {!coreValues?.length && <tr><td colSpan="5">No values observed.</td></tr>}
                            </tbody>
                        </table>

                        <h3>ATTENDANCE RECORD</h3>
                        <table className={styles.reportTable}>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Days</th>
                                    <th>Pres</th>
                                    <th>Abs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance && attendance.map((a, i) => (
                                    <tr key={i}>
                                        <td>{a.month}</td>
                                        <td>{a.daysOfSchool}</td>
                                        <td>{a.daysPresent}</td>
                                        <td>{a.daysAbsent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.signatures}>
                    <div className={styles.sigBlock}>
                        <div className={styles.line}></div>
                        <p>Teacher</p>
                    </div>
                    <div className={styles.sigBlock}>
                        <div className={styles.line}></div>
                        <p>Principal</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
