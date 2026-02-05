'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, ArrowLeft, Edit, FileText, Mail, Phone, MapPin, Calendar, Hash } from 'lucide-react';
import { studentsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from '../../layout.module.css';

export default function StudentViewPage() {
    const router = useRouter();
    const params = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadStudent();
        }
    }, [params.id]);

    const loadStudent = async () => {
        try {
            setLoading(true);
            const response = await studentsAPI.getById(params.id);
            const data = response.data?.data || response.data;
            setStudent(data);
        } catch (error) {
            console.error('Error loading student:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading student...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div>
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft size={18} /> Back
                </Button>
                <Card style={{ marginTop: '1rem', textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Student not found.</p>
                </Card>
            </div>
        );
    }

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>{value || '-'}</div>
            </div>
        </div>
    );

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button variant="ghost" onClick={() => router.back()} style={{ marginBottom: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </Button>
                    <h1 className={styles.title}>{student.firstName} {student.lastName}</h1>
                    <span className={styles.greeting}>Student Details</span>
                </div>
                <div className={styles.headerRight} style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="outline" onClick={() => router.push(`/dashboard/students/${params.id}/edit`)}>
                        <Edit size={18} /> Edit
                    </Button>
                    <Button variant="primary" onClick={() => router.push(`/dashboard/students/${params.id}/report-card`)}>
                        <FileText size={18} /> Report Card
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <Card title="Personal Information" icon={<User size={20} />}>
                    <InfoRow icon={Hash} label="LRN (Learner Reference Number)" value={student.lrn} />
                    <InfoRow icon={User} label="Full Name" value={`${student.firstName} ${student.middleName || ''} ${student.lastName}`} />
                    <InfoRow icon={Calendar} label="Birth Date" value={student.birthDate ? new Date(student.birthDate).toLocaleDateString() : null} />
                    <InfoRow icon={User} label="Gender" value={student.gender} />
                </Card>

                <Card title="Academic Information">
                    <InfoRow icon={Hash} label="Grade Level" value={student.gradeLevel ? `Grade ${student.gradeLevel}` : null} />
                    <InfoRow icon={Hash} label="Section" value={student.section} />
                    <InfoRow icon={Calendar} label="School Year" value={student.schoolYear} />
                </Card>

                <Card title="Contact Information">
                    <InfoRow icon={User} label="Parent/Guardian" value={student.parentName} />
                    <InfoRow icon={Phone} label="Contact Number" value={student.contactNumber} />
                    <InfoRow icon={MapPin} label="Address" value={student.address} />
                </Card>
            </div>
        </div>
    );
}
