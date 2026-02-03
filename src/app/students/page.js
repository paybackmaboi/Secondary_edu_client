"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        try {
            setLoading(true);
            const data = await api.students.list();
            // Handle response if it's nested (e.g. data.data) or array
            setStudents(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Filter students
    const filteredStudents = students.filter(s =>
        s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        s.lrn?.includes(search)
    );

    const headers = ['LRN', 'Name', 'Grade', 'Section', 'Actions'];

    const renderRow = (student) => (
        <>
            <td>{student.lrn}</td>
            <td>
                <div className={styles.studentName}>
                    {student.lastName}, {student.firstName} {student.middleName}
                </div>
            </td>
            <td>{student.gradeLevel}</td>
            <td>{student.section}</td>
            <td className={styles.actions}>
                <Link href={`/students/${student.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye size={16} /> View
                    </Button>
                </Link>
                <Link href={`/students/${student.id}/report-card`}>
                    <Button variant="secondary" size="sm">
                        <FileText size={16} /> Report
                    </Button>
                </Link>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Students</h1>
                    <p className={styles.subtitle}>Manage student records and grades.</p>
                </div>
                <Link href="/students/create">
                    <Button>
                        <Plus size={20} /> Add Student
                    </Button>
                </Link>
            </header>

            {error && (
                <div className={styles.errorBanner}>
                    Error loading students: {error}
                </div>
            )}

            <Card padding="none" className={styles.card}>
                <div className={styles.toolbar}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <Input
                            placeholder="Search by name or LRN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                            wrapperClassName={styles.searchInputWrapper}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading students...</div>
                ) : (
                    <Table
                        headers={headers}
                        data={filteredStudents}
                        renderRow={renderRow}
                        keyExtractor={(s) => s.id}
                    />
                )}
            </Card>
        </div>
    );
}
