'use client';
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Button from '../Button';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-block mb-8">
                        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                            <FaGraduationCap className="text-6xl text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        BC PORTAL
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                        BC school management system for primary and secondary education
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 border-none">
                                Get Started <FaArrowRight className="inline ml-2" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
