'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Plus, Eye, Trash2, Search, FileText } from 'lucide-react';
import { studentsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import { ConfirmModal } from '@/components/Modal';
import styles from '../layout.module.css';

export default function StudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, student: null });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const response = await studentsAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setStudents(data);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const query = searchQuery.toLowerCase();
        return (
            student.firstName?.toLowerCase().includes(query) ||
            student.lastName?.toLowerCase().includes(query) ||
            student.lrn?.toLowerCase().includes(query)
        );
    });

    const handleDelete = async () => {
        // TODO: Implement delete when API supports it
        setDeleteModal({ open: false, student: null });
        loadStudents();
    };

    const headers = ['LRN', 'Name', 'Grade Level', 'Section', 'Actions'];

    const renderRow = (student) => (
        <>
            <td>{student.lrn || '-'}</td>
            <td>{student.firstName} {student.lastName}</td>
            <td>Grade {student.gradeLevel || '-'}</td>
            <td>{student.section || '-'}</td>
            <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => router.push(`/dashboard/students/${student.id}`)}
                        title="View Student"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => router.push(`/dashboard/students/${student.id}/report-card`)}
                        title="Report Card"
                    >
                        <FileText size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => setDeleteModal({ open: true, student })}
                        title="Delete Student"
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
                    <h1 className={styles.title}>Students</h1>
                    <span className={styles.greeting}>{students.length} total students</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/dashboard/students/create">
                        <Button variant="primary" leftIcon={<Plus size={18} />}>
                            Add Student
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <div style={{ marginBottom: '1rem' }}>
                    <Input
                        placeholder="Search by name or LRN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search size={18} />}
                    />
                </div>

                <Table
                    headers={headers}
                    data={filteredStudents}
                    renderRow={renderRow}
                    keyExtractor={(student) => student.id}
                    loading={loading}
                    emptyMessage="No students found"
                    emptySubtext="Add your first student to get started"
                />
            </Card>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, student: null })}
                onConfirm={handleDelete}
                title="Delete Student"
                message={`Are you sure you want to delete ${deleteModal.student?.firstName} ${deleteModal.student?.lastName}?`}
                variant="danger"
                icon={<Trash2 size={28} />}
            />
        </div>
    );
}
