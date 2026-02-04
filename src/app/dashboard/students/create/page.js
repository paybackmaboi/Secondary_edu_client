'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../layout.module.css';

const gradeOptions = [
    { value: 'K', label: 'Kindergarten' },
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
];

export default function CreateStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        lrn: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gradeLevel: '',
        section: '',
        schoolYear: '2024-2025',
        gender: '',
        birthDate: '',
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
            if (!formData.firstName || !formData.lastName || !formData.lrn) {
                throw new Error('First name, last name, and LRN are required');
            }
            await studentsAPI.create(formData);
            router.push('/dashboard/students');
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
                    <Link href="/dashboard/students">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
                            Back to Students
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Add New Student</h1>
                </div>
            </div>

            <Card title="Student Information" icon={<User size={20} />}>
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
                            label="LRN (Learner Reference Number)"
                            name="lrn"
                            value={formData.lrn}
                            onChange={handleChange}
                            required
                            placeholder="Enter 12-digit LRN"
                        />
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                        />
                        <Input
                            label="Middle Name"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            placeholder="Enter middle name"
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                        />
                        <Select
                            label="Grade Level"
                            name="gradeLevel"
                            value={formData.gradeLevel}
                            onChange={handleChange}
                            options={gradeOptions}
                            required
                        />
                        <Input
                            label="Section"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            placeholder="e.g., Section A"
                        />
                        <Input
                            label="School Year"
                            name="schoolYear"
                            value={formData.schoolYear}
                            onChange={handleChange}
                            placeholder="e.g., 2024-2025"
                        />
                        <Select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                            ]}
                        />
                        <Input
                            label="Birth Date"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/students">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Save Student
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
