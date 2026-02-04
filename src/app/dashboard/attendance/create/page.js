'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, attendanceAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../layout.module.css';

const monthOptions = [
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
];

export default function CreateAttendancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        month: '',
        daysPresent: '',
        daysAbsent: '',
        daysTardy: '',
        schoolYear: '2024-2025',
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            setStudents(Array.isArray(response.data) ? response.data : (response.data?.data || []));
        } catch (error) {
            console.error('Error loading students:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.studentId || !formData.month) {
                throw new Error('Student and month are required');
            }
            await attendanceAPI.create({
                ...formData,
                daysPresent: parseInt(formData.daysPresent) || 0,
                daysAbsent: parseInt(formData.daysAbsent) || 0,
                daysTardy: parseInt(formData.daysTardy) || 0,
            });
            router.push('/dashboard/attendance');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const studentOptions = students.map(s => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName}`
    }));

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard/attendance">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Attendance
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Record Attendance</h1>
                </div>
            </div>

            <Card title="Attendance Information" icon={<CalendarCheck size={20} />}>
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
                        <Select
                            label="Student"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            options={studentOptions}
                            required
                        />
                        <Select
                            label="Month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            options={monthOptions}
                            required
                        />
                        <Input
                            label="School Year"
                            name="schoolYear"
                            value={formData.schoolYear}
                            onChange={handleChange}
                        />
                        <Input
                            label="Days Present"
                            name="daysPresent"
                            type="number"
                            min="0"
                            value={formData.daysPresent}
                            onChange={handleChange}
                            placeholder="0"
                        />
                        <Input
                            label="Days Absent"
                            name="daysAbsent"
                            type="number"
                            min="0"
                            value={formData.daysAbsent}
                            onChange={handleChange}
                            placeholder="0"
                        />
                        <Input
                            label="Days Tardy"
                            name="daysTardy"
                            type="number"
                            min="0"
                            value={formData.daysTardy}
                            onChange={handleChange}
                            placeholder="0"
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/attendance">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Save Attendance
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
