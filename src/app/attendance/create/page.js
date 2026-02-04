"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI, attendanceAPI } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Card from '@/components/Card';
import styles from './page.module.css';

function AttendanceForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const studentIdParam = searchParams.get('studentId');

    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        studentId: studentIdParam || '',
        month: '',
        daysOfSchool: '',
        daysPresent: '',
        daysAbsent: '',
        timesTardy: 0
    });

    useEffect(() => {
        if (!studentIdParam) fetchStudents();
    }, [studentIdParam]);

    async function fetchStudents() {
        try {
            const response = await studentsAPI.getAll();
            const data = response.data;
            setStudents(Array.isArray(data) ? data : (data.data || []));
        } catch (e) { console.error(e); }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await attendanceAPI.create(formData);
            router.push(`/students/${formData.studentId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const months = ["August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July"];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href={studentIdParam ? `/students/${studentIdParam}` : '/attendance'} className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Add Attendance</h1>
                        <p className={styles.subtitle}>Record monthly attendance.</p>
                    </div>
                </div>
            </header>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {!studentIdParam && (
                        <Select
                            label="Student"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            options={students.map(s => ({ value: s.id, label: `${s.lastName}, ${s.firstName}` }))}
                            required
                        />
                    )}
                    <div className={styles.grid}>
                        <Select
                            label="Month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            options={months.map(m => ({ value: m, label: m }))}
                            required
                        />
                        <Input label="Days of School" name="daysOfSchool" type="number" value={formData.daysOfSchool} onChange={handleChange} required />
                        <Input label="Days Present" name="daysPresent" type="number" value={formData.daysPresent} onChange={handleChange} required />
                        <Input label="Days Absent" name="daysAbsent" type="number" value={formData.daysAbsent} onChange={handleChange} required />
                        <Input label="Times Tardy" name="timesTardy" type="number" value={formData.timesTardy} onChange={handleChange} />
                    </div>
                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}><Save size={18} /> Save Record</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function CreateAttendancePage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <AttendanceForm />
        </Suspense>
    );
}
