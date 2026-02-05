'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { subjectsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import styles from '../../../layout.module.css';

export default function SubjectEditPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });

    useEffect(() => {
        if (params.id) {
            loadSubject();
        }
    }, [params.id]);

    const loadSubject = async () => {
        try {
            setLoading(true);
            const response = await subjectsAPI.getById(params.id);
            const data = response.data?.data || response.data;
            setFormData({
                name: data.name || '',
                code: data.code || '',
                description: data.description || ''
            });
        } catch (error) {
            console.error('Error loading subject:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await subjectsAPI.update(params.id, formData);
            router.push('/dashboard/subjects');
        } catch (error) {
            console.error('Error updating subject:', error);
            alert('Failed to update subject. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading subject...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button variant="ghost" onClick={() => router.back()} style={{ marginBottom: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </Button>
                    <h1 className={styles.title}>Edit Subject</h1>
                    <span className={styles.greeting}>Update subject information</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <Card title="Subject Details" icon={<BookOpen size={20} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Input
                            label="Subject Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Mathematics"
                            required
                        />
                        <Input
                            label="Subject Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g., MATH"
                        />
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: 'var(--text-secondary)'
                            }}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter subject description..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9375rem',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>
                </Card>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
