'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, User } from 'lucide-react';
import { studentsAPI } from '@/services/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import styles from '../../../layout.module.css';

export default function StudentEditPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        lrn: '',
        firstName: '',
        middleName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        gradeLevel: '',
        section: '',
        schoolYear: '',
        parentName: '',
        contactNumber: '',
        address: ''
    });

    useEffect(() => {
        if (params.id) {
            loadStudent();
        }
    }, [params.id]);

    const loadStudent = async () => {
        try {
            setLoading(true);
            const response = await studentsAPI.getById(params.id);
            const data = response.data?.data || response.data;
            setFormData({
                lrn: data.lrn || '',
                firstName: data.firstName || '',
                middleName: data.middleName || '',
                lastName: data.lastName || '',
                birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                gender: data.gender || '',
                gradeLevel: data.gradeLevel?.toString() || '',
                section: data.section || '',
                schoolYear: data.schoolYear || '',
                parentName: data.parentName || '',
                contactNumber: data.contactNumber || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error('Error loading student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await studentsAPI.update(params.id, {
                ...formData,
                gradeLevel: formData.gradeLevel ? parseInt(formData.gradeLevel) : null
            });
            router.push(`/dashboard/students/${params.id}`);
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const gradeLevelOptions = [
        { value: '1', label: 'Grade 1' },
        { value: '2', label: 'Grade 2' },
        { value: '3', label: 'Grade 3' },
        { value: '4', label: 'Grade 4' },
        { value: '5', label: 'Grade 5' },
        { value: '6', label: 'Grade 6' },
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading student...</p>
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
                    <h1 className={styles.title}>Edit Student</h1>
                    <span className={styles.greeting}>Update student information</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    <Card title="Personal Information" icon={<User size={20} />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="LRN (Learner Reference Number)"
                                name="lrn"
                                value={formData.lrn}
                                onChange={handleChange}
                                placeholder="Enter 12-digit LRN"
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Birth Date"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    options={genderOptions}
                                    placeholder="Select gender"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Academic Information">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Select
                                label="Grade Level"
                                name="gradeLevel"
                                value={formData.gradeLevel}
                                onChange={handleChange}
                                options={gradeLevelOptions}
                                placeholder="Select grade level"
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
                                placeholder="e.g., 2025-2026"
                            />
                        </div>
                    </Card>

                    <Card title="Contact Information">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="Parent/Guardian Name"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                            />
                            <Input
                                label="Contact Number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="e.g., 09123456789"
                            />
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Complete address"
                            />
                        </div>
                    </Card>
                </div>

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
