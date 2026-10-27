import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, FileDown, Github, Linkedin, ArrowDown, Sparkles, MapPin } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Hero: React.FC = () => {
  const { settings } = usePortfolio();

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Cinematic subtle light accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Availability Badge */}
        {settings.showAvailability && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-mono text-gray-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>{settings.heroAvailabilityText || 'Open for Game Dev Roles & Indie Collaborations'}</span>
          </motion.div>
        )}

        {/* Name Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-display uppercase"
        >
          {settings.heroName || 'BOBBY ESARAPU'}
        </motion.h1>

        {/* Professional Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          <div className="h-[1px] w-8 sm:w-16 bg-accent/40 hidden sm:block" />
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-wider text-accent font-mono uppercase">
            {settings.heroTitle || 'UNITY GAME DEVELOPER'}
          </h2>
          <div className="h-[1px] w-8 sm:w-16 bg-accent/40 hidden sm:block" />
        </motion.div>

        {/* Motto / Quote */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto italic font-sans"
        >
          "{settings.heroQuote || 'Building immersive gameplay experiences, one system at a time.'}"
        </motion.p>

        {/* Quick Highlights / Sub-specifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-400"
        >
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5">
            <Gamepad2 className="w-3.5 h-3.5 text-accent" />
            Redundant Studios Member
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            C# Gameplay & Enemy AI
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            Tadepalligudem, AP, India
          </span>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            onClick={handleScrollToProjects}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <Gamepad2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>Explore My Games</span>
          </a>

          <a
            href={settings.resumeUrl || '/Bobby_Esarapu_Resume.pdf'}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <FileDown className="w-4 h-4 text-accent" />
            <span>Download Resume</span>
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-5 text-gray-400"
        >
          <a
            href={settings.githubUrl || 'https://github.com/esarapubobby'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={settings.linkedinUrl || 'https://linkedin.com/in/bobby-esarapu-68543230'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          {settings.itchUrl && (
            <a
              href={settings.itchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Itch.io Games"
            >
              <Gamepad2 className="w-5 h-5" />
            </a>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="#projects"
            onClick={handleScrollToProjects}
            className="flex flex-col items-center text-xs font-mono text-gray-500 hover:text-accent transition-colors gap-1.5 group"
            aria-label="Scroll to projects"
          >
            <span className="uppercase tracking-widest text-[10px]">Scroll Down</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-accent" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
