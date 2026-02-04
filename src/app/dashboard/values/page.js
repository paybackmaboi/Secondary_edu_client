'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, Plus } from 'lucide-react';
import { studentsAPI, observedValuesAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Select from '@/components/Select';
import styles from '../layout.module.css';

const valueLabels = {
    AO: 'Always Observed',
    SO: 'Sometimes Observed',
    RO: 'Rarely Observed',
    NO: 'Not Observed'
};

export default function ValuesPage() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [values, setValues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [valuesLoading, setValuesLoading] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            loadValues(selectedStudent);
        }
    }, [selectedStudent]);

    const loadStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setStudents(data);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadValues = async (studentId) => {
        try {
            setValuesLoading(true);
            const response = await observedValuesAPI.getByStudent(studentId);
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setValues(data);
        } catch (error) {
            console.error('Error loading values:', error);
            setValues([]);
        } finally {
            setValuesLoading(false);
        }
    };

    const studentOptions = students.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName} (${s.lrn || 'No LRN'})`
    }));

    const getRatingBadge = (rating) => {
        const colors = {
            AO: 'var(--success)',
            SO: 'var(--primary)',
            RO: 'var(--warning)',
            NO: 'var(--danger)'
        };
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: `${colors[rating]}20`,
                color: colors[rating],
                fontSize: '0.75rem',
                fontWeight: '600'
            }}>
                {valueLabels[rating] || rating}
            </span>
        );
    };

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Observed Values</h1>
                    <span className={styles.greeting}>Track student behavior and core values</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/dashboard/values/create">
                        <Button variant="primary" leftIcon={<Plus size={18} />}>
                            Record Values
                        </Button>
                    </Link>
                </div>
            </div>

            <Card title="View Values by Student" icon={<HeartHandshake size={20} />}>
                <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
                    <Select
                        label="Select Student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        options={studentOptions}
                        placeholder="Choose a student..."
                    />
                </div>

                {selectedStudent && (
                    <div>
                        {valuesLoading ? (
                            <p style={{ color: 'var(--text-muted)' }}>Loading values...</p>
                        ) : values.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)' }}>Core Value</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)' }}>Behavior Statement</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q1</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q2</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q3</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>Q4</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values.map((value, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                                    {value.coreValue}
                                                </td>
                                                <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                    {value.behaviorStatement}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{value.q1 ? getRatingBadge(value.q1) : '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{value.q2 ? getRatingBadge(value.q2) : '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{value.q3 ? getRatingBadge(value.q3) : '-'}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{value.q4 ? getRatingBadge(value.q4) : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No observed values found for this student.</p>
                        )}
                    </div>
                )}

                {!selectedStudent && !loading && (
                    <p style={{ color: 'var(--text-muted)' }}>Select a student to view their observed values.</p>
                )}
            </Card>
        </div>
    );
}
