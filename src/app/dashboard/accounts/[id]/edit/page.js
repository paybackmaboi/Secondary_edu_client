'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Shield, User, Mail, Key } from 'lucide-react';
import { accountsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../../layout.module.css';

export default function AccountEditPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        isActive: true
    });

    useEffect(() => {
        if (user?.role !== 'superadmin') {
            router.push('/dashboard');
            return;
        }
        if (params.id) {
            loadAccount();
        }
    }, [params.id, user]);

    const loadAccount = async () => {
        try {
            setLoading(true);
            const response = await accountsAPI.getById(params.id);
            const data = response.data?.data || response.data;
            setFormData({
                username: data.username || '',
                email: data.email || '',
                password: '',
                role: data.role || '',
                isActive: data.isActive !== undefined ? data.isActive : true
            });
        } catch (error) {
            console.error('Error loading account:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
                role: formData.role,
                isActive: formData.isActive
            };
            // Only include password if it was changed
            if (formData.password) {
                updateData.password = formData.password;
            }
            await accountsAPI.update(params.id, updateData);
            router.push(`/dashboard/accounts/${params.id}`);
        } catch (error) {
            console.error('Error updating account:', error);
            alert('Failed to update account. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const roleOptions = [
        { value: 'superadmin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'user', label: 'User' }
    ];

    const statusOptions = [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading account...</p>
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
                    <h1 className={styles.title}>Edit Account</h1>
                    <span className={styles.greeting}>Update account information</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <Card title="Account Details" icon={<Shield size={20} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            leftIcon={<User size={18} />}
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail size={18} />}
                        />
                        <Input
                            label="New Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                            leftIcon={<Key size={18} />}
                        />
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            options={roleOptions}
                            required
                        />
                        <Select
                            label="Status"
                            name="isActive"
                            value={formData.isActive.toString()}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                            options={statusOptions}
                        />
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
