'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Plus, Search } from 'lucide-react';
import { studentsAPI, gradesAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../layout.module.css';

export default function GradesPage() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradesLoading, setGradesLoading] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            loadGrades(selectedStudent);
        }
    }, [selectedStudent]);

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

    const loadGrades = async (studentId) => {
        try {
            setGradesLoading(true);
            const response = await gradesAPI.getByStudent(studentId);
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setGrades(data);
        } catch (error) {
            console.error('Error loading grades:', error);
            setGrades([]);
        } finally {
            setGradesLoading(false);
        }
    };

    const studentOptions = students.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName} (${s.lrn || 'No LRN'})`
    }));

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Grade Management</h1>
                    <span className={styles.greeting}>Record and manage student grades</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/dashboard/grades/create">
                        <Button variant="primary" leftIcon={<Plus size={18} />}>
                            Record Grades
                        </Button>
                    </Link>
                </div>
            </div>

            <Card title="View Grades by Student" icon={<GraduationCap size={20} />}>
                <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
                    <Select
                        label="Select Student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        options={studentOptions}
                        placeholder="Choose a student..."
                    />
                </div>

                {selectedStudent && (
                    <div>
                        {gradesLoading ? (
                            <p style={{ color: 'var(--text-muted)' }}>Loading grades...</p>
                        ) : grades.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)' }}>Subject</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q1</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q2</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q3</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q4</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Final</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.map((grade, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>
                                                    {grade.Subject?.name || grade.subjectId}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-primary)' }}>{grade.q1 || '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-primary)' }}>{grade.q2 || '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-primary)' }}>{grade.q3 || '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-primary)' }}>{grade.q4 || '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', color: 'var(--primary)' }}>
                                                    {grade.finalRating || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No grades found for this student.</p>
                        )}
                    </div>
                )}

                {!selectedStudent && !loading && (
                    <p style={{ color: 'var(--text-muted)' }}>Select a student to view their grades.</p>
                )}
            </Card>
        </div>
    );
}
