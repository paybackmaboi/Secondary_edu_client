'use client';
import Card from '@/components/ui/Card';

export default function AdminPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-xl font-bold text-white">Total Students</h3>
                    <p className="text-4xl font-bold text-indigo-400 mt-2">150</p>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold text-white">Active Classes</h3>
                    <p className="text-4xl font-bold text-purple-400 mt-2">12</p>
                </Card>
            </div>
        </div>
    );
}
