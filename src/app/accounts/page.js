"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, UserCog } from 'lucide-react';
import { api } from '@/lib/api';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = () => {
        api.accounts.list().then(data => {
            setAccounts(Array.isArray(data) ? data : (data.data || []));
            setLoading(false);
        }).catch(e => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this account?")) {
            try {
                await api.accounts.delete(id);
                loadAccounts();
            } catch (e) {
                alert("Failed to delete account");
            }
        }
    };

    const headers = ['Username', 'Email', 'Role', 'Actions'];

    const renderRow = (acc) => (
        <>
            <td>{acc.username}</td>
            <td>{acc.email}</td>
            <td>{acc.role}</td>
            <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(acc.id)}>
                    <Trash2 size={16} /> Delete
                </Button>
            </td>
        </>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Accounts</h1>
                    <p className={styles.subtitle}>Manage system users and access.</p>
                </div>
                <Link href="/accounts/create">
                    <Button><Plus size={20} /> Add Account</Button>
                </Link>
            </header>
            <Card padding="none">
                {loading ? <div className={styles.loading}>Loading...</div> : <Table headers={headers} data={accounts} renderRow={renderRow} />}
            </Card>
        </div>
    );
}
