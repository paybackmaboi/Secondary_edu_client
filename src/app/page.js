'use client';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Roles from '../components/sections/Roles';
import About from '../components/sections/About';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

export default function LandingPage() {
  return (
    <main className="live-bg min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Roles />
      <About />
      <Footer />
    </main>
  );
}
