"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, observedValuesAPI } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Card from '@/components/Card';
import styles from './page.module.css';

function ValuesForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const studentIdParam = searchParams.get('studentId');

    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        studentId: studentIdParam || '',
        coreValue: '',
        behaviorStatement: '',
        q1: '',
        q2: '',
        q3: '',
        q4: ''
    });

    useEffect(() => {
        if (!studentIdParam) fetchStudents();
    }, [studentIdParam]);

    async function fetchStudents() {
        try {
            const response = await studentsAPI.getAll();
            const data = response.data;
            setStudents(Array.isArray(data) ? data : (data.data || []));
        } catch (e) { }
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
            await observedValuesAPI.create(formData);
            router.push(`/students/${formData.studentId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const ratingOptions = [
        { value: '', label: 'Select Rating' },
        { value: 'AO', label: 'Always Observed (AO)' },
        { value: 'SO', label: 'Sometimes Observed (SO)' },
        { value: 'RO', label: 'Rarely Observed (RO)' },
        { value: 'NO', label: 'Not Observed (NO)' },
        { value: 'VS', label: 'Very Satisfactory (VS)' },
        { value: 'S', label: 'Satisfactory (S)' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href={studentIdParam ? `/students/${studentIdParam}` : '/observed-values'} className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Add Observed Value</h1>
                        <p className={styles.subtitle}>Record behavior and values.</p>
                    </div>
                </div>
            </header>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {!studentIdParam && (
                        <Select
                            label="Student"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            options={students.map(s => ({ value: s.id, label: `${s.lastName}, ${s.firstName}` }))}
                            required
                        />
                    )}
                    <div className={styles.grid}>
                        <div className={styles.fullWidth}>
                            <Input label="Core Value" name="coreValue" value={formData.coreValue} onChange={handleChange} placeholder="e.g. Maka-Diyos" required />
                        </div>
                        <div className={styles.fullWidth}>
                            <Input label="Behavior Statement" name="behaviorStatement" value={formData.behaviorStatement} onChange={handleChange} placeholder="e.g. Observes simplicity and modesty" required />
                        </div>
                    </div>

                    <div className={styles.divider}>Quarterly Ratings</div>
                    <div className={styles.grid4}>
                        <Select label="Q1" name="q1" value={formData.q1} onChange={handleChange} options={ratingOptions} />
                        <Select label="Q2" name="q2" value={formData.q2} onChange={handleChange} options={ratingOptions} />
                        <Select label="Q3" name="q3" value={formData.q3} onChange={handleChange} options={ratingOptions} />
                        <Select label="Q4" name="q4" value={formData.q4} onChange={handleChange} options={ratingOptions} />
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}><Save size={18} /> Save Value</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function CreateValuesPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <ValuesForm />
        </Suspense>
    );
}
