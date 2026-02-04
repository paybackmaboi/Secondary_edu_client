'use client';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaChartBar, FaCalendarCheck, FaBook, FaAward, FaClipboardList } from 'react-icons/fa';
import Card from '../Card';

const features = [
    {
        icon: FaUserGraduate,
        title: 'Student Management',
        description: 'Complete student records with LRN, personal info, and education levels from K-12.',
    },
    {
        icon: FaChartBar,
        title: 'Grade Tracking',
        description: 'Quarterly grades, semester grades for Senior High, and automatic final rating computation.',
    },
    {
        icon: FaCalendarCheck,
        title: 'Attendance Records',
        description: 'Monthly attendance tracking with days present, absent, and tardiness records.',
    },
    {
        icon: FaBook,
        title: 'Subject Management',
        description: 'Manage subjects across all education levels with custom codes.',
    },
    {
        icon: FaAward,
        title: 'Observed Values',
        description: 'Track student behavior and core values aligned with DepEd standards.',
    },
    {
        icon: FaClipboardList,
        title: 'Report Cards',
        description: 'Generate comprehensive report cards with all academic data.',
    },
];

export default function Features() {
    return (
        <section className="py-24 relative" id="features">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Everything you need to manage your school's academic records efficiently.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card glass className="h-full">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 w-fit mb-4">
                                    <feature.icon className="text-2xl text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400">
                                    {feature.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
