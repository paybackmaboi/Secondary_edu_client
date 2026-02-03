"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function GradesPage() {
    // For now, let's just list students again but with a focus on "Manage Grades"
    // Effectively similar to students list, but maybe with a "Add Grade" direct action.
    // Or we could list *recent* grades if we had an endpoint.
    // I'll reuse the student list logic for simplicity but title it "Grades Management"

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.students.list().then(data => {
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
                    <Link href={`/students/${student.id}?tab=grades`}>
                        <Button variant="outline" size="sm">View Grades</Button>
                    </Link>
                    <Link href={`/grades/create?studentId=${student.id}`}>
                        <Button variant="primary" size="sm">Add Grade</Button>
                    </Link>
                </div>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Grades Management</h1>
                    <p className={styles.subtitle}>Select a student to view or record grades.</p>
                </div>
            </header>

            <Card padding="none">
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <Table headers={headers} data={students} renderRow={renderRow} />
                )}
            </Card>
        </div>
    );
}
