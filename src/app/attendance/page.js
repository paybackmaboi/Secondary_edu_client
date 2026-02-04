"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { studentsAPI } from '@/services/api';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function AttendancePage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentsAPI.getAll().then(response => {
            const data = response.data;
            setStudents(Array.isArray(data) ? data : (data.data || []));
            setLoading(false);
        }).catch(e => setLoading(false));
    }, []);

    const headers = ['LRN', 'Name', 'Grade', 'Actions'];

    const renderRow = (student) => (
        <>
            <td>{student.lrn}</td>
            <td>{student.lastName}, {student.firstName}</td>
            <td>{student.gradeLevel} - {student.section}</td>
            <td>
                <div className={styles.actions}>
                    <Link href={`/students/${student.id}?tab=attendance`}>
                        <Button variant="outline" size="sm">View Record</Button>
                    </Link>
                    <Link href={`/attendance/create?studentId=${student.id}`}>
                        <Button variant="primary" size="sm">Add Attendance</Button>
                    </Link>
                </div>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Attendance Management</h1>
                    <p className={styles.subtitle}>Track monthly attendance records.</p>
                </div>
            </header>
            <Card padding="none">
                {loading ? <div className={styles.loading}>Loading...</div> : <Table headers={headers} data={students} renderRow={renderRow} />}
            </Card>
        </div>
    );
}
