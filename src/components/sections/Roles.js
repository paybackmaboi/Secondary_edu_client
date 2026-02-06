'use client';
import { FaUserShield, FaUserCog, FaChalkboardTeacher, FaUser } from 'react-icons/fa';
import Card from '../Card';

const roles = [
    {
        icon: FaUserShield,
        title: 'Super Admin',
        color: 'from-red-500 to-orange-500',
        permissions: [
            'Manage all user accounts',
            'Full system access',
            'View all reports',
            'System configuration',
        ],
    },
    {
        icon: FaUserCog,
        title: 'Admin',
        color: 'from-indigo-500 to-purple-500',
        permissions: [
            'Manage students & records',
            'Manage grades & attendance',
            'Generate reports',
            'View analytics',
        ],
    },
    {
        icon: FaChalkboardTeacher,
        title: 'Teacher',
        color: 'from-emerald-500 to-teal-500',
        permissions: [
            'View assigned students',
            'Enter grades',
            'Record attendance',
            'View class reports',
        ],
    },
    {
        icon: FaUser,
        title: 'User',
        color: 'from-cyan-500 to-blue-500',
        permissions: [
            'View own profile',
            'View assigned data',
            'Limited access',
        ],
    },
];

export default function Roles() {
    return (
        <section className="py-24 bg-slate-900/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Role-Based Access
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Secure access control with four distinct user roles.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role, idx) => (
                        <div key={idx}>
                            <Card className="h-full text-center hover:transform hover:scale-105 transition-transform duration-300">
                                <div className={`p-4 rounded-2xl bg-gradient-to-r ${role.color} w-fit mx-auto mb-4`}>
                                    <role.icon className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{role.title}</h3>
                                <ul className="space-y-2">
                                    {role.permissions.map((perm, i) => (
                                        <li key={i} className="text-slate-400 text-sm">
                                            ✓ {perm}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
