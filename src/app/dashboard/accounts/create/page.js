'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { accountsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../layout.module.css';

const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'user', label: 'User' },
];

export default function CreateAccountPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        isActive: true,
    });

    if (user?.role !== 'superadmin') {
        router.push('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.username || !formData.password) {
                throw new Error('Username and password are required');
            }
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            if (formData.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const { confirmPassword, ...dataToSend } = formData;
            await accountsAPI.create(dataToSend);
            router.push('/dashboard/accounts');
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
                    <Link href="/dashboard/accounts">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Accounts
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Create New Account</h1>
                </div>
            </div>

            <Card title="Account Information" icon={<UserPlus size={20} />}>
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
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter username"
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                        />
                        <Input
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm password"
                        />
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            options={roleOptions}
                            required
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <label htmlFor="isActive" style={{ color: 'var(--text-secondary)' }}>
                                Account is active
                            </label>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/accounts">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
