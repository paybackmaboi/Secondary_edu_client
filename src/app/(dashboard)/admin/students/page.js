'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import api, { studentsAPI } from '../../../../services/api';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Table from '../../../../components/ui/Table';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            setStudents(Array.isArray(response.data) ? response.data : (response.data.data || []));
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'LRN', accessor: 'lrn' },
        { header: 'Name', render: (row) => `${row.lastName}, ${row.firstName}` },
        { header: 'Grade Level', accessor: 'gradeLevel' },
        { header: 'Section', accessor: 'section' },
        { header: 'School Year', accessor: 'schoolYear' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg">
                        <FaEye />
                    </button>
                    <button className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg">
                        <FaEdit />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Students</h1>
                    <p className="text-slate-400">Manage student records</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <FaPlus className="mr-2" /> Add Student
                </Button>
            </div>

            <Card>
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
                    </div>
                ) : (
                    <Table columns={columns} data={students} />
                )}
            </Card>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <Card className="max-w-md w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Add Student</h2>
                        <p className="text-slate-400 mb-4">Form implementation pending...</p>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Card>
                </div>
            )}
        </div>
    );
}
