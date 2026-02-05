'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { analyticsAPI } from '@/services/api';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function StudentDistributionChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await analyticsAPI.getStudentDistribution();
            const apiData = response.data?.data || response.data || [];

            if (Array.isArray(apiData) && apiData.length > 0) {
                setData(apiData.map(item => ({
                    name: `Grade ${item.gradeLevel}`,
                    value: item.count
                })));
            } else {
                // Mock data fallback
                setData([
                    { name: 'Grade 1', value: 25 },
                    { name: 'Grade 2', value: 30 },
                    { name: 'Grade 3', value: 28 },
                    { name: 'Grade 4', value: 32 },
                    { name: 'Grade 5', value: 27 },
                    { name: 'Grade 6', value: 29 },
                ]);
            }
        } catch (error) {
            console.error('Error loading student distribution:', error);
            // Fallback mock data
            setData([
                { name: 'Grade 1', value: 25 },
                { name: 'Grade 2', value: 30 },
                { name: 'Grade 3', value: 28 },
                { name: 'Grade 4', value: 32 },
                { name: 'Grade 5', value: 27 },
                { name: 'Grade 6', value: 29 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading chart...</div>
            </div>
        );
    }

    return (
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
