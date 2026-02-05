'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Plus, Eye, Trash2, Search, FileText, Edit } from 'lucide-react';
import { studentsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import { ConfirmModal } from '@/components/Modal';
import styles from '../layout.module.css';

export default function StudentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
    const [deleting, setDeleting] = useState(false);

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

    // Filter students based on search query AND user role
    const filteredStudents = students.filter(student => {
        // Role-based restriction: 'user' role can only see their own record
        if (user?.role === 'user') {
            // Match by LRN (assuming username is LRN) or Name if username matches
            const isLinked = student.lrn === user.username ||
                student.firstName.toLowerCase() === user.username.toLowerCase();
            if (!isLinked) return false;
        }

        const query = searchQuery.toLowerCase();
        return (
            student.firstName?.toLowerCase().includes(query) ||
            student.lastName?.toLowerCase().includes(query) ||
            student.lrn?.toLowerCase().includes(query)
        );
    });

    const handleDelete = async () => {
        if (!deleteModal.student) return;
        setDeleting(true);
        try {
            await studentsAPI.delete(deleteModal.student.id);
            setDeleteModal({ open: false, student: null });
            loadStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const headers = ['LRN', 'Name', 'Grade Level', 'Section', 'Actions'];
    const isStudentUser = user?.role === 'user';

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
                    {!isStudentUser && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                iconOnly
                                onClick={() => router.push(`/dashboard/students/${student.id}/edit`)}
                                title="Edit Student"
                            >
                                <Edit size={16} />
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
                        </>
                    )}
                    {isStudentUser && (
                        <Button
                            variant="ghost"
                            size="sm"
                            iconOnly
                            onClick={() => router.push(`/dashboard/students/${student.id}/report-card`)}
                            title="My Report Card"
                        >
                            <FileText size={16} />
                        </Button>
                    )}
                </div>
            </td>
        </>
    );

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Students</h1>
                    <span className={styles.greeting}>
                        {isStudentUser ? 'My Record' : `${students.length} total students`}
                    </span>
                </div>
                {!isStudentUser && (
                    <div className={styles.headerRight}>
                        <Link href="/dashboard/students/create">
                            <Button variant="primary" leftIcon={<Plus size={18} />}>
                                Add Student
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <Card>
                <div style={{ marginBottom: '1rem' }}>
                    {!isStudentUser && (
                        <Input
                            placeholder="Search by name or LRN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search size={18} />}
                        />
                    )}
                    {isStudentUser && filteredStudents.length === 0 && !loading && (
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                            No student record linked to your account. Please contact an administrator to link your account (Username must match your LRN).
                        </div>
                    )}
                </div>

                <Table
                    headers={headers}
                    data={filteredStudents}
                    renderRow={renderRow}
                    keyExtractor={(student) => student.id}
                    loading={loading}
                    emptyMessage="No students found"
                    emptySubtext={isStudentUser ? "Contact admin to link your record" : "Add your first student to get started"}
                />
            </Card>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, student: null })}
                onConfirm={handleDelete}
                title="Delete Student"
                message={`Are you sure you want to delete ${deleteModal.student?.firstName} ${deleteModal.student?.lastName}? This will also delete all associated grades, attendance, and observed values.`}
                variant="danger"
                icon={<Trash2 size={28} />}
                loading={deleting}
            />
        </div>
    );
}
