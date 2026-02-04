'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, observedValuesAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../layout.module.css';

const ratingOptions = [
    { value: '', label: 'Select Rating' },
    { value: 'AO', label: 'Always Observed (AO)' },
    { value: 'SO', label: 'Sometimes Observed (SO)' },
    { value: 'RO', label: 'Rarely Observed (RO)' },
    { value: 'NO', label: 'Not Observed (NO)' },
];

const coreValueOptions = [
    { value: 'Maka-Diyos', label: 'Maka-Diyos' },
    { value: 'Makatao', label: 'Makatao' },
    { value: 'Makakalikasan', label: 'Makakalikasan' },
    { value: 'Makabansa', label: 'Makabansa' },
];

export default function CreateValuesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        coreValue: '',
        behaviorStatement: '',
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        schoolYear: '2024-2025',
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            setStudents(Array.isArray(response.data) ? response.data : (response.data?.data || []));
        } catch (error) {
            console.error('Error loading students:', error);
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
            if (!formData.studentId || !formData.coreValue || !formData.behaviorStatement) {
                throw new Error('Student, core value, and behavior statement are required');
            }
            await observedValuesAPI.create(formData);
            router.push('/dashboard/values');
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

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard/values">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Values
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Record Observed Values</h1>
                </div>
            </div>

            <Card title="Value Information" icon={<HeartHandshake size={20} />}>
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
                            label="Core Value"
                            name="coreValue"
                            value={formData.coreValue}
                            onChange={handleChange}
                            options={coreValueOptions}
                            required
                        />
                        <Input
                            label="School Year"
                            name="schoolYear"
                            value={formData.schoolYear}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <Input
                            label="Behavior Statement"
                            name="behaviorStatement"
                            value={formData.behaviorStatement}
                            onChange={handleChange}
                            placeholder="e.g., Expresses one's spiritual beliefs while respecting others"
                            required
                        />
                    </div>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Quarterly Ratings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <Select
                            label="Quarter 1"
                            name="q1"
                            value={formData.q1}
                            onChange={handleChange}
                            options={ratingOptions}
                        />
                        <Select
                            label="Quarter 2"
                            name="q2"
                            value={formData.q2}
                            onChange={handleChange}
                            options={ratingOptions}
                        />
                        <Select
                            label="Quarter 3"
                            name="q3"
                            value={formData.q3}
                            onChange={handleChange}
                            options={ratingOptions}
                        />
                        <Select
                            label="Quarter 4"
                            name="q4"
                            value={formData.q4}
                            onChange={handleChange}
                            options={ratingOptions}
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/values">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Save Values
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
