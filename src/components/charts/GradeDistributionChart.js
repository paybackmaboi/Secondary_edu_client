'use client';

import { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { analyticsAPI } from '@/services/api';

export default function GradeDistributionChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await analyticsAPI.getGradeDistribution();
            const apiData = response.data?.data || response.data || [];

            if (Array.isArray(apiData) && apiData.length > 0) {
                const colors = ['#22c55e', '#6366f1', '#f59e0b', '#f97316', '#ef4444'];
                setData(apiData.map((item, index) => ({
                    name: item.grade,
                    value: item.count,
                    fill: colors[index % colors.length]
                })));
            } else {
                // Mock data fallback
                setData([
                    { name: 'Outstanding (90-100)', value: 35, fill: '#22c55e' },
                    { name: 'Very Satisfactory (85-89)', value: 28, fill: '#6366f1' },
                    { name: 'Satisfactory (80-84)', value: 20, fill: '#f59e0b' },
                    { name: 'Fairly Satisfactory (75-79)', value: 12, fill: '#f97316' },
                    { name: 'Did Not Meet (<75)', value: 5, fill: '#ef4444' },
                ]);
            }
        } catch (error) {
            console.error('Error loading grade distribution:', error);
            // Fallback mock data
            setData([
                { name: 'Outstanding (90-100)', value: 35, fill: '#22c55e' },
                { name: 'Very Satisfactory (85-89)', value: 28, fill: '#6366f1' },
                { name: 'Satisfactory (80-84)', value: 20, fill: '#f59e0b' },
                { name: 'Fairly Satisfactory (75-79)', value: 12, fill: '#f97316' },
                { name: 'Did Not Meet (<75)', value: 5, fill: '#ef4444' },
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
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                        formatter={(value) => [`${value}%`, 'Students']}
                    />
                    <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: '11px', lineHeight: '20px' }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}
