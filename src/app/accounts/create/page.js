"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function CreateAccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'teacher'
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
            if (!formData.username || !formData.password || !formData.email) {
                throw new Error("All fields are required.");
            }
            await api.accounts.create(formData);
            router.push('/accounts');
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
                    <Link href="/accounts" className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Create Account</h1>
                        <p className={styles.subtitle}>Register a new user.</p>
                    </div>
                </div>
            </header>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            options={[
                                { value: 'teacher', label: 'Teacher' },
                                { value: 'admin', label: 'Admin' },
                                { value: 'superadmin', label: 'Super Admin' },
                                { value: 'user', label: 'User' }
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}><Save size={18} /> Create Account</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
