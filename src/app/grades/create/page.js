"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, gradesAPI } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Card from '@/components/Card';
import styles from './page.module.css';

function GradeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const studentIdParam = searchParams.get('studentId');

    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        studentId: studentIdParam || '',
        subjectName: '',
        subjectType: 'core', // for SHS
        semester: '1',     // for SHS
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        finalRating: '',
        remarks: ''
    });

    useEffect(() => {
        // If no studentId provided, fetch students for dropdown
        if (!studentIdParam) {
            fetchStudents();
        }
    }, [studentIdParam]);

    async function fetchStudents() {
        try {
            const response = await studentsAPI.getAll();
            const data = response.data;
            setStudents(Array.isArray(data) ? data : (data.data || []));
        } catch (e) {
            console.error("Failed to load students", e);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.studentId || !formData.subjectName) {
                throw new Error("Student and Subject Name are required.");
            }

            // Clean up empty strings to null or leave as is depending on API
            // API expects numbers for grades usually, but Input text is string.
            // We should convert if needed, or rely on backend coercion.

            await gradesAPI.create(formData);

            // Redirect back to student profile or grades list
            router.push(`/students/${formData.studentId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href={studentIdParam ? `/students/${studentIdParam}` : '/grades'} className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Add Grade</h1>
                        <p className={styles.subtitle}>Record academic performance.</p>
                    </div>
                </div>
            </header>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Student Selection if not pre-filled */}
                    {!studentIdParam && (
                        <div className={styles.section}>
                            <Select
                                label="Student"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                options={students.map(s => ({
                                    value: s.id,
                                    label: `${s.lastName}, ${s.firstName} (${s.lrn})`
                                }))}
                                required
                            />
                        </div>
                    )}

                    <div className={styles.grid}>
                        <Input
                            label="Subject Name"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            placeholder="e.g. Mathematics"
                            required
                        />
                        <Select
                            label="Subject Type (Senior High)"
                            name="subjectType"
                            value={formData.subjectType}
                            onChange={handleChange}
                            options={[
                                { value: 'core', label: 'Core' },
                                { value: 'applied', label: 'Applied' },
                                { value: 'specialized', label: 'Specialized' },
                                { value: 'standard', label: 'Standard (K-10)' }
                            ]}
                        />
                    </div>

                    <div className={styles.divider}>Quarterly Ratings</div>
                    <div className={styles.grid4}>
                        <Input label="1st Quarter" name="q1" type="number" step="0.01" value={formData.q1} onChange={handleChange} />
                        <Input label="2nd Quarter" name="q2" type="number" step="0.01" value={formData.q2} onChange={handleChange} />
                        <Input label="3rd Quarter" name="q3" type="number" step="0.01" value={formData.q3} onChange={handleChange} />
                        <Input label="4th Quarter" name="q4" type="number" step="0.01" value={formData.q4} onChange={handleChange} />
                    </div>

                    <div className={styles.grid}>
                        <Input label="Final Rating" name="finalRating" type="number" step="0.01" value={formData.finalRating} onChange={handleChange} />
                        <Input label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="e.g. Passed" />
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            <Save size={18} /> Save Grade
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function CreateGradePage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <GradeForm />
        </Suspense>
    );
}
