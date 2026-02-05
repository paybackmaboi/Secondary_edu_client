'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsAPI } from '@/services/api';

export default function AttendanceTrendChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await analyticsAPI.getAttendanceTrend(new Date().getFullYear());
            const apiData = response.data?.data || response.data || [];

            if (Array.isArray(apiData) && apiData.length > 0) {
                setData(apiData.map(item => ({
                    month: item.month?.substring(0, 3) || item.month,
                    present: item.present,
                    absent: item.absent,
                    tardy: item.tardy
                })));
            } else {
                // Mock data fallback
                setData([
                    { month: 'Jun', present: 450, absent: 20, tardy: 15 },
                    { month: 'Jul', present: 460, absent: 18, tardy: 12 },
                    { month: 'Aug', present: 470, absent: 15, tardy: 10 },
                    { month: 'Sep', present: 455, absent: 25, tardy: 18 },
                    { month: 'Oct', present: 480, absent: 12, tardy: 8 },
                    { month: 'Nov', present: 475, absent: 16, tardy: 9 },
                    { month: 'Dec', present: 465, absent: 22, tardy: 13 },
                    { month: 'Jan', present: 490, absent: 10, tardy: 5 },
                    { month: 'Feb', present: 485, absent: 14, tardy: 6 },
                    { month: 'Mar', present: 495, absent: 8, tardy: 4 },
                ]);
            }
        } catch (error) {
            console.error('Error loading attendance trend:', error);
            // Fallback mock data
            setData([
                { month: 'Jun', present: 450, absent: 20, tardy: 15 },
                { month: 'Jul', present: 460, absent: 18, tardy: 12 },
                { month: 'Aug', present: 470, absent: 15, tardy: 10 },
                { month: 'Sep', present: 455, absent: 25, tardy: 18 },
                { month: 'Oct', present: 480, absent: 12, tardy: 8 },
                { month: 'Nov', present: 475, absent: 16, tardy: 9 },
                { month: 'Dec', present: 465, absent: 22, tardy: 13 },
                { month: 'Jan', present: 490, absent: 10, tardy: 5 },
                { month: 'Feb', present: 485, absent: 14, tardy: 6 },
                { month: 'Mar', present: 495, absent: 8, tardy: 4 },
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
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorTardy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
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
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="present"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorPresent)"
                        name="Present"
                    />
                    <Area
                        type="monotone"
                        dataKey="absent"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorAbsent)"
                        name="Absent"
                    />
                    <Area
                        type="monotone"
                        dataKey="tardy"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorTardy)"
                        name="Tardy"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
