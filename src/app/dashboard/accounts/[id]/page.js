'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, ArrowLeft, Edit, Shield, Mail, Calendar, Check, X } from 'lucide-react';
import { accountsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { TableBadge } from '@/components/Table';
import styles from '../../layout.module.css';

export default function AccountViewPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setAccount(data);
        } catch (error) {
            console.error('Error loading account:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const variants = {
            superadmin: 'danger',
            admin: 'info',
            teacher: 'success',
            user: 'warning'
        };
        return <TableBadge status={variants[role] || 'info'}>{role}</TableBadge>;
    };

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

    if (!account) {
        return (
            <div>
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft size={18} /> Back
                </Button>
                <Card style={{ marginTop: '1rem', textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Account not found.</p>
                </Card>
            </div>
        );
    }

    const InfoRow = ({ icon: Icon, label, value, badge }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500', marginTop: '0.25rem' }}>
                    {badge || value || '-'}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button variant="ghost" onClick={() => router.back()} style={{ marginBottom: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </Button>
                    <h1 className={styles.title}>{account.username}</h1>
                    <span className={styles.greeting}>Account Details</span>
                </div>
                <div className={styles.headerRight}>
                    <Button variant="outline" onClick={() => router.push(`/dashboard/accounts/${params.id}/edit`)}>
                        <Edit size={18} /> Edit Account
                    </Button>
                </div>
            </div>

            <div style={{ maxWidth: '600px' }}>
                <Card title="Account Information" icon={<Shield size={20} />}>
                    <InfoRow icon={User} label="Username" value={account.username} />
                    <InfoRow icon={Mail} label="Email" value={account.email} />
                    <InfoRow icon={Shield} label="Role" badge={getRoleBadge(account.role)} />
                    <InfoRow
                        icon={account.isActive ? Check : X}
                        label="Status"
                        badge={
                            <TableBadge status={account.isActive ? 'success' : 'danger'}>
                                {account.isActive ? 'Active' : 'Inactive'}
                            </TableBadge>
                        }
                    />
                    <InfoRow icon={Calendar} label="Created At" value={account.createdAt ? new Date(account.createdAt).toLocaleString() : null} />
                    <InfoRow icon={Calendar} label="Updated At" value={account.updatedAt ? new Date(account.updatedAt).toLocaleString() : null} />
                </Card>
            </div>
        </div>
    );
}
