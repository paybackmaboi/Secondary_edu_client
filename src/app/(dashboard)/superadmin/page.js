'use client';
import Card from '@/components/ui/Card';

export default function SuperAdminPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Super Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-xl font-bold text-white">System Status</h3>
                    <p className="text-slate-400 mt-2">All systems operational.</p>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold text-white">Total Users</h3>
                    <p className="text-4xl font-bold text-indigo-400 mt-2">12</p>
                </Card>
            </div>
        </div>
    );
}
