import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AmbientCanvas } from '../components/ui/AmbientCanvas';
import { Hero } from '../components/home/Hero';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { SkillsSection } from '../components/home/SkillsSection';
import { AboutSection } from '../components/home/AboutSection';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { EducationSection } from '../components/home/EducationSection';
import { ContactSection } from '../components/home/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0d0f] text-gray-100 flex flex-col justify-between selection:bg-accent/30 selection:text-white">
      {/* Dynamic ambient coordinate canvas */}
      <AmbientCanvas />

      <Navbar />

      <main className="relative z-10 flex-1">
        <Hero />
        <FeaturedProjects />
        <SkillsSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};
