'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsAPI } from '@/services/api';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

export default function GradePerformanceChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await analyticsAPI.getGradePerformance();
            const apiData = response.data?.data || response.data || [];

            if (Array.isArray(apiData) && apiData.length > 0) {
                setData(apiData.map(item => ({
                    subject: item.subject,
                    average: Number(item.average) || 0
                })));
            } else {
                // Mock data fallback
                setData([
                    { subject: 'Math', average: 85 },
                    { subject: 'Science', average: 82 },
                    { subject: 'English', average: 88 },
                    { subject: 'Filipino', average: 86 },
                    { subject: 'AP', average: 84 },
                    { subject: 'MAPEH', average: 90 },
                    { subject: 'ESP', average: 87 },
                    { subject: 'TLE', average: 83 },
                ]);
            }
        } catch (error) {
            console.error('Error loading grade performance:', error);
            // Fallback mock data
            setData([
                { subject: 'Math', average: 85 },
                { subject: 'Science', average: 82 },
                { subject: 'English', average: 88 },
                { subject: 'Filipino', average: 86 },
                { subject: 'AP', average: 84 },
                { subject: 'MAPEH', average: 90 },
                { subject: 'ESP', average: 87 },
                { subject: 'TLE', average: 83 },
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
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="subject"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                        formatter={(value) => [`${value}%`, 'Average Grade']}
                    />
                    <Bar dataKey="average" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
