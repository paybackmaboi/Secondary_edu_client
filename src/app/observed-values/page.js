"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function ObservedValuesPage() {
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
                    <Link href={`/students/${student.id}?tab=values`}>
                        <Button variant="outline" size="sm">View Values</Button>
                    </Link>
                    <Link href={`/observed-values/create?studentId=${student.id}`}>
                        <Button variant="primary" size="sm">Add Value</Button>
                    </Link>
                </div>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Observed Values</h1>
                    <p className={styles.subtitle}>Manage learner's observed core values.</p>
                </div>
            </header>
            <Card padding="none">
                {loading ? <div className={styles.loading}>Loading...</div> : <Table headers={headers} data={students} renderRow={renderRow} />}
            </Card>
        </div>
    );
}
