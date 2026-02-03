"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function CreateSubjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        code: ''
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
            await api.subjects.create(formData);
            router.push('/subjects');
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
                    <Link href="/subjects" className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Add Subject</h1>
                        <p className={styles.subtitle}>Create a new subject.</p>
                    </div>
                </div>
            </header>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <Input label="Subject Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Filipino" required />
                        <Input label="Subject Code" name="code" value={formData.code} onChange={handleChange} placeholder="e.g. FIL" required />
                    </div>
                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}><Save size={18} /> Save Subject</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
