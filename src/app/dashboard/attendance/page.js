'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Plus } from 'lucide-react';
import { studentsAPI, attendanceAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import styles from '../layout.module.css';

export default function AttendancePage() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            loadAttendance(selectedStudent);
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

    const loadAttendance = async (studentId) => {
        try {
            setAttendanceLoading(true);
            const response = await attendanceAPI.getByStudent(studentId);
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setAttendance(data);
        } catch (error) {
            console.error('Error loading attendance:', error);
            setAttendance([]);
        } finally {
            setAttendanceLoading(false);
        }
    };

    const studentOptions = students.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName} (${s.lrn || 'No LRN'})`
    }));

    const months = ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Attendance Records</h1>
                    <span className={styles.greeting}>Track student attendance by month</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/dashboard/attendance/create">
                        <Button variant="primary" leftIcon={<Plus size={18} />}>
                            Record Attendance
                        </Button>
                    </Link>
                </div>
            </div>

            <Card title="View Attendance by Student" icon={<CalendarCheck size={20} />}>
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
                        {attendanceLoading ? (
                            <p style={{ color: 'var(--text-muted)' }}>Loading attendance...</p>
                        ) : attendance.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)' }}>Month</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Days Present</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Days Absent</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Days Tardy</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((record, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>{record.month}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--success)' }}>{record.daysPresent || 0}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--danger)' }}>{record.daysAbsent || 0}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--warning)' }}>{record.daysTardy || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No attendance records found for this student.</p>
                        )}
                    </div>
                )}

                {!selectedStudent && !loading && (
                    <p style={{ color: 'var(--text-muted)' }}>Select a student to view their attendance records.</p>
                )}
            </Card>
        </div>
    );
}
