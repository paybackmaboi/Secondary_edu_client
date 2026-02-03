'use client';
import Card from '@/components/ui/Card';

export default function TeacherPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Teacher Dashboard</h1>
            <Card>
                <h3 className="text-xl font-bold text-white">My Classes</h3>
                <p className="text-slate-400 mt-2">View your assigned sections and subjects.</p>
            </Card>
        </div>
    );
}
