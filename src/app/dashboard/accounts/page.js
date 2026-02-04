'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCog, Plus, Eye, Trash2, Search, Shield, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { accountsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table, { TableBadge } from '@/components/Table';
import { ConfirmModal } from '@/components/Modal';
import styles from '../layout.module.css';

export default function AccountsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, account: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (user?.role !== 'superadmin') {
            router.push('/dashboard');
            return;
        }
        loadAccounts();
    }, [user, router]);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const response = await accountsAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setAccounts(data);
        } catch (error) {
            console.error('Error loading accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAccounts = accounts.filter(account => {
        const query = searchQuery.toLowerCase();
        return (
            account.username?.toLowerCase().includes(query) ||
            account.email?.toLowerCase().includes(query) ||
            account.role?.toLowerCase().includes(query)
        );
    });

    const handleDelete = async () => {
        if (!deleteModal.account) return;
        setDeleting(true);
        try {
            await accountsAPI.delete(deleteModal.account.id);
            setDeleteModal({ open: false, account: null });
            loadAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setDeleting(false);
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

    const headers = ['Username', 'Email', 'Role', 'Status', 'Actions'];

    const renderRow = (account) => (
        <>
            <td>{account.username}</td>
            <td>{account.email || '-'}</td>
            <td>{getRoleBadge(account.role)}</td>
            <td>
                <TableBadge status={account.isActive ? 'success' : 'danger'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                </TableBadge>
            </td>
            <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                        title="View Account"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => router.push(`/dashboard/accounts/${account.id}/edit`)}
                        title="Edit Account"
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => setDeleteModal({ open: true, account })}
                        title="Delete Account"
                        disabled={account.role === 'superadmin'}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </td>
        </>
    );

    if (user?.role !== 'superadmin') {
        return null;
    }

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Account Management</h1>
                    <span className={styles.greeting}>{accounts.length} total accounts</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/dashboard/accounts/create">
                        <Button variant="primary" leftIcon={<Plus size={18} />}>
                            Add Account
                        </Button>
                    </Link>
                </div>
            </div>

            <Card icon={<Shield size={20} />} title="User Accounts">
                <div style={{ marginBottom: '1rem' }}>
                    <Input
                        placeholder="Search by username, email, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search size={18} />}
                    />
                </div>

                <Table
                    headers={headers}
                    data={filteredAccounts}
                    renderRow={renderRow}
                    keyExtractor={(account) => account.id}
                    loading={loading}
                    emptyMessage="No accounts found"
                    emptySubtext="Add your first account to get started"
                />
            </Card>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, account: null })}
                onConfirm={handleDelete}
                title="Delete Account"
                message={`Are you sure you want to delete the account "${deleteModal.account?.username}"? This action cannot be undone.`}
                variant="danger"
                icon={<Trash2 size={28} />}
                loading={deleting}
            />
        </div>
    );
}
