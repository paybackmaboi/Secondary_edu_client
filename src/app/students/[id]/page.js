"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, BookOpen, Calendar, Star, FileText } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, gradesAPI } from '@/services/api';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Table from '@/components/Table';
import styles from './page.module.css';

export default function StudentDetailPage() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('grades'); // grades, attendance, values

    // Valid IDs are numbers, verify id exists
    useEffect(() => {
        if (id) fetchStudent();
    }, [id]);

    async function fetchStudent() {
        try {
            setLoading(true);
            const response = await studentsAPI.getById(id);
            setStudent(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className={styles.loading}>Loading student profile...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!student) return <div className={styles.error}>Student not found.</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/students" className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>
                            {student.lastName}, {student.firstName} {student.middleName}
                        </h1>
                        <p className={styles.subtitle}>LRN: {student.lrn} • {student.gradeLevel} - {student.section}</p>
                    </div>
                </div>
                <Link href={`/students/${id}/report-card`}>
                    <Button variant="primary">
                        <FileText size={18} /> View Report Card
                    </Button>
                </Link>
            </header>

            <div className={styles.contentGrid}>
                {/* Sidebar / Profile Card */}
                <aside className={styles.profileSidebar}>
                    <Card className={styles.profileCard} padding="md">
                        <div className={styles.avatarPlaceholder}>
                            <User size={48} />
                        </div>
                        <div className={styles.infoGroup}>
                            <label>Education Level</label>
                            <span>{student.educationLevel}</span>
                        </div>
                        <div className={styles.infoGroup}>
                            <label>School Year</label>
                            <span>{student.schoolYear}</span>
                        </div>
                        <div className={styles.infoGroup}>
                            <label>Sex</label>
                            <span>{student.sex}</span>
                        </div>
                        <div className={styles.infoGroup}>
                            <label>Birthdate</label>
                            <span>{new Date(student.birthdate).toLocaleDateString()}</span>
                        </div>
                        {student.track && (
                            <div className={styles.infoGroup}>
                                <label>Track/Strand</label>
                                <span>{student.track} / {student.strand}</span>
                            </div>
                        )}
                    </Card>
                </aside>

                {/* Main Content Areas */}
                <div className={styles.mainContent}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'grades' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('grades')}
                        >
                            <BookOpen size={18} /> Grades
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'attendance' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('attendance')}
                        >
                            <Calendar size={18} /> Attendance
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'values' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('values')}
                        >
                            <Star size={18} /> Observed Values
                        </button>
                    </div>

                    <Card className={styles.tabContent}>
                        {activeTab === 'grades' && <GradesTab studentId={id} />}
                        {activeTab === 'attendance' && <AttendanceTab studentId={id} />}
                        {activeTab === 'values' && <ValuesTab studentId={id} />}
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Sub-components for Tabs (Mocked for now or fetching their own data)
function GradesTab({ studentId }) {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In real app, fetch from api.grades.getByStudent(studentId)
        // For now, mock or empty
        async function load() {
            try {
                const response = await gradesAPI.getByStudent(studentId);
                const data = response.data;
                setGrades(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [studentId]);

    if (loading) return <div>Loading grades...</div>;

    const headers = ['Subject', 'Q1', 'Q2', 'Q3', 'Q4', 'Final', 'Remarks'];
    const renderRow = (g) => (
        <>
            <td>{g.subjectName}</td>
            <td>{g.q1}</td>
            <td>{g.q2}</td>
            <td>{g.q3}</td>
            <td>{g.q4}</td>
            <td style={{ fontWeight: 'bold' }}>{g.finalRating || g.semFinalGrade}</td>
            <td>{g.remarks}</td>
        </>
    );

    return (
        <div>
            <div className={styles.tabHeader}>
                <h3>Academic Performance</h3>
                <Button size="sm" variant="outline">Add Grade</Button>
            </div>
            <Table headers={headers} data={grades} renderRow={renderRow} />
        </div>
    );
}

function AttendanceTab({ studentId }) {
    const [attendance, setAttendance] = useState([]);
    // ... implement fetch
    return <div>Attendance Data (Coming Soon)</div>;
}

function ValuesTab({ studentId }) {
    // ... implement fetch
    return <div>Observed Values (Coming Soon)</div>;
}
