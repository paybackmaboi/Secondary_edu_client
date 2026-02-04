"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Card from '@/components/Card';
import styles from './page.module.css';

export default function CreateStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        lrn: '',
        firstName: '',
        lastName: '',
        middleName: '',
        birthdate: '',
        sex: '',
        age: '',
        gradeLevel: '',
        section: '',
        schoolYear: '2023-2024',
        educationLevel: '',
        track: '',
        strand: ''
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
            // Basic Validation
            if (!formData.lrn || !formData.lastName || !formData.firstName) {
                throw new Error("Please fill in all required fields.");
            }

            await studentsAPI.create(formData);
            router.push('/students');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/students" className={styles.backLink}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Register Student</h1>
                        <p className={styles.subtitle}>Add a new student to the system.</p>
                    </div>
                </div>
            </header>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.sectionTitle}>Personal Information</div>
                    <div className={styles.grid}>
                        <Input
                            label="LRN (Learner Reference No.)"
                            name="lrn"
                            value={formData.lrn}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 120001090153"
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Middle Name"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                        />
                        <Input
                            label="Birthdate"
                            name="birthdate"
                            type="date"
                            value={formData.birthdate}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                        <Select
                            label="Sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            options={[
                                { value: 'M', label: 'Male' },
                                { value: 'F', label: 'Female' }
                            ]}
                            required
                        />
                    </div>

                    <div className={styles.sectionTitle}>Academic Information</div>
                    <div className={styles.grid}>
                        <Select
                            label="Education Level"
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            options={[
                                { value: 'kindergarten', label: 'Kindergarten' },
                                { value: 'elementary', label: 'Elementary' },
                                { value: 'junior_high', label: 'Junior High' },
                                { value: 'senior_high', label: 'Senior High' }
                            ]}
                            required
                        />
                        <Input
                            label="Grade Level"
                            name="gradeLevel"
                            type="number"
                            value={formData.gradeLevel}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Section"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="School Year"
                            name="schoolYear"
                            value={formData.schoolYear}
                            onChange={handleChange}
                            required
                        />

                        {formData.educationLevel === 'senior_high' && (
                            <>
                                <Input
                                    label="Track"
                                    name="track"
                                    value={formData.track}
                                    onChange={handleChange}
                                    placeholder="e.g. Academic"
                                />
                                <Input
                                    label="Strand"
                                    name="strand"
                                    value={formData.strand}
                                    onChange={handleChange}
                                    placeholder="e.g. HUMSS"
                                />
                            </>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <Link href="/students">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={loading}>
                            <Save size={18} /> Save Student
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
