'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { subjectsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import styles from '../../layout.module.css';

export default function CreateSubjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.name) {
                throw new Error('Subject name is required');
            }
            await subjectsAPI.create(formData);
            router.push('/dashboard/subjects');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard/subjects">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Subjects
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Add New Subject</h1>
                </div>
            </div>

            <Card title="Subject Information" icon={<BookOpen size={20} />}>
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
                        <Input
                            label="Subject Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g., MATH101"
                        />
                        <Input
                            label="Subject Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Mathematics"
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <Input
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the subject"
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/subjects">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Save Subject
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
