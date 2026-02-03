"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = () => {
        api.subjects.list().then(data => {
            setSubjects(Array.isArray(data) ? data : (data.data || []));
            setLoading(false);
        }).catch(e => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this subject?")) {
            try {
                await api.subjects.delete(id);
                loadSubjects();
            } catch (e) {
                alert("Failed to delete subject");
            }
        }
    };

    const headers = ['Code', 'Name', 'Actions'];

    const renderRow = (subject) => (
        <>
            <td>{subject.code}</td>
            <td>{subject.name}</td>
            <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(subject.id)}>
                    <Trash2 size={16} /> Delete
                </Button>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Subjects</h1>
                    <p className={styles.subtitle}>Manage academic subjects.</p>
                </div>
                <Link href="/subjects/create">
                    <Button><Plus size={20} /> Add Subject</Button>
                </Link>
            </header>
            <Card padding="none">
                {loading ? <div className={styles.loading}>Loading...</div> : <Table headers={headers} data={subjects} renderRow={renderRow} />}
            </Card>
        </div>
    );
}
