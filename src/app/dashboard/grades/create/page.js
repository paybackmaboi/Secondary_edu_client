'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, subjectsAPI, gradesAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../layout.module.css';

export default function CreateGradePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        subjectId: '',
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        schoolYear: '2024-2025',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsRes, subjectsRes] = await Promise.all([
                studentsAPI.getAll(),
                subjectsAPI.getAll()
            ]);
            setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data?.data || []));
            setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : (subjectsRes.data?.data || []));
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.studentId || !formData.subjectId) {
                throw new Error('Student and subject are required');
            }
            await gradesAPI.create({
                ...formData,
                q1: formData.q1 ? parseFloat(formData.q1) : null,
                q2: formData.q2 ? parseFloat(formData.q2) : null,
                q3: formData.q3 ? parseFloat(formData.q3) : null,
                q4: formData.q4 ? parseFloat(formData.q4) : null,
            });
            router.push('/dashboard/grades');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const studentOptions = students.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName}`
    }));

    const subjectOptions = subjects.map(s => ({
        value: s.id.toString(),
        label: s.name
    }));

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard/grades">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Grades
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Record Grades</h1>
                </div>
            </div>

            <Card title="Grade Information" icon={<GraduationCap size={20} />}>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--danger)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--danger)',
                            marginBottom: '1.5rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <Select
                            label="Student"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            options={studentOptions}
                            required
                        />
                        <Select
                            label="Subject"
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            options={subjectOptions}
                            required
                        />
                        <Input
                            label="School Year"
                            name="schoolYear"
                            value={formData.schoolYear}
                            onChange={handleChange}
                        />
                    </div>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Quarterly Grades</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <Input
                            label="Quarter 1"
                            name="q1"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.q1}
                            onChange={handleChange}
                            placeholder="0-100"
                        />
                        <Input
                            label="Quarter 2"
                            name="q2"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.q2}
                            onChange={handleChange}
                            placeholder="0-100"
                        />
                        <Input
                            label="Quarter 3"
                            name="q3"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.q3}
                            onChange={handleChange}
                            placeholder="0-100"
                        />
                        <Input
                            label="Quarter 4"
                            name="q4"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.q4}
                            onChange={handleChange}
                            placeholder="0-100"
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/grades">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Save Grades
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
