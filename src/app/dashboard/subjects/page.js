'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { subjectsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import { ConfirmModal } from '@/components/Modal';
import styles from '../layout.module.css';

export default function SubjectsPage() {
    const router = useRouter();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, subject: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const response = await subjectsAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setSubjects(data);
        } catch (error) {
            console.error('Error loading subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        const query = searchQuery.toLowerCase();
        return (
            subject.name?.toLowerCase().includes(query) ||
            subject.code?.toLowerCase().includes(query)
        );
    });

    const handleDelete = async () => {
        if (!deleteModal.subject) return;
        setDeleting(true);
        try {
            await subjectsAPI.delete(deleteModal.subject.id);
            setDeleteModal({ open: false, subject: null });
            loadSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
        } finally {
            setDeleting(false);
        }
    };

    const headers = ['Code', 'Name', 'Description', 'Actions'];

    const renderRow = (subject) => (
        <>
            <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{subject.code || '-'}</td>
            <td>{subject.name}</td>
            <td style={{ color: 'var(--text-secondary)' }}>{subject.description || '-'}</td>
            <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => router.push(`/dashboard/subjects/${subject.id}/edit`)}
                        title="Edit Subject"
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => setDeleteModal({ open: true, subject })}
                        title="Delete Subject"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </td>
        </>
    );

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Subject Management</h1>
                    <span className={styles.greeting}>{subjects.length} subjects registered</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/dashboard/subjects/create">
                        <Button variant="primary" leftIcon={<Plus size={18} />}>
                            Add Subject
                        </Button>
                    </Link>
                </div>
            </div>

            <Card icon={<BookOpen size={20} />} title="All Subjects">
                <div style={{ marginBottom: '1rem' }}>
                    <Input
                        placeholder="Search by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<BookOpen size={18} />}
                    />
                </div>

                <Table
                    headers={headers}
                    data={filteredSubjects}
                    renderRow={renderRow}
                    keyExtractor={(subject) => subject.id}
                    loading={loading}
                    emptyMessage="No subjects found"
                    emptySubtext="Add your first subject to get started"
                />
            </Card>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, subject: null })}
                onConfirm={handleDelete}
                title="Delete Subject"
                message={`Are you sure you want to delete "${deleteModal.subject?.name}"? This may affect existing grades.`}
                variant="danger"
                icon={<Trash2 size={28} />}
                loading={deleting}
            />
        </div>
    );
}
