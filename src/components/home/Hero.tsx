import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Gamepad2, FileDown, Github, Linkedin, ArrowDown, Sparkles, MapPin } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SplitText } from '../ui/SplitText';
import { Spotlight } from '../ui/Spotlight';
import { BUTTON_INTERACTIONS, ICON_BUTTON_INTERACTIONS } from '../../lib/animations';

export const Hero: React.FC = () => {
  const { settings } = usePortfolio();
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // Desktop mouse parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  // Gentle shifts
  const bgTranslateX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const bgTranslateY = useTransform(springY, [-0.5, 0.5], [-14, 14]);
  const cardRotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const cardRotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || shouldReduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden perspective-1000"
    >
      {/* Cinematic Spotlight & Ambient Glow */}
      <Spotlight className="-top-32 left-10 md:left-48" />

      {/* Gentle parallax ambient light layers */}
      <motion.div
        style={{
          x: isTouchDevice || shouldReduceMotion ? 0 : bgTranslateX,
          y: isTouchDevice || shouldReduceMotion ? 0 : bgTranslateY,
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-accent/10 rounded-full blur-[140px] pointer-events-none"
      />
      <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <motion.div
        style={{
          rotateX: isTouchDevice || shouldReduceMotion ? 0 : cardRotateX,
          rotateY: isTouchDevice || shouldReduceMotion ? 0 : cardRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
      >
        {/* Availability Badge */}
        {settings.showAvailability && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-mono text-gray-300 mb-8 hover:border-accent/40 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>{settings.heroAvailabilityText || 'Open for Game Dev Roles & Indie Collaborations'}</span>
          </motion.div>
        )}

        {/* Name Heading with Staggered Character / Word Reveal */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-display uppercase leading-[1.08]">
          <SplitText
            text={settings.heroName || 'BOBBY ESARAPU'}
            delay={0.1}
            stagger={0.04}
          />
        </h1>

        {/* Professional Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="h-[1px] w-8 sm:w-16 bg-accent/40 hidden sm:block origin-right"
          />
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-wider text-accent font-mono uppercase">
            {settings.heroTitle || 'UNITY GAME DEVELOPER'}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="h-[1px] w-8 sm:w-16 bg-accent/40 hidden sm:block origin-left"
          />
        </motion.div>

        {/* Motto / Philosophy Quote */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto italic font-sans"
        >
          "{settings.heroQuote || 'Building immersive gameplay experiences, one system at a time.'}"
        </motion.p>

        {/* Quick Highlights / Sub-specifications with Stagger */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-mono text-gray-400"
        >
          <motion.span
            whileHover={{ y: -2, scale: 1.02 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-default"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-accent" />
            Redundant Studios Member
          </motion.span>
          <motion.span
            whileHover={{ y: -2, scale: 1.02 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            C# Gameplay & Enemy AI
          </motion.span>
          <motion.span
            whileHover={{ y: -2, scale: 1.02 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-default"
          >
            <MapPin className="w-3.5 h-3.5 text-accent" />
            Tadepalligudem, AP, India
          </motion.span>
        </motion.div>

        {/* Interactive CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#projects"
            onClick={handleScrollToProjects}
            {...BUTTON_INTERACTIONS}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <Gamepad2 className="w-4 h-4 transition-transform group-hover:rotate-12 duration-200" />
            <span>Explore My Games</span>
          </motion.a>

          <motion.a
            href={settings.resumeUrl || '/Bobby_Esarapu_Resume.pdf'}
            download
            target="_blank"
            rel="noopener noreferrer"
            {...BUTTON_INTERACTIONS}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:border-accent/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <FileDown className="w-4 h-4 text-accent" />
            <span>Download Resume</span>
          </motion.a>
        </motion.div>

        {/* Social Channels with Hover Lift */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-4 text-gray-400"
        >
          <motion.a
            href={settings.githubUrl || 'https://github.com/esarapubobby'}
            target="_blank"
            rel="noopener noreferrer"
            {...ICON_BUTTON_INTERACTIONS}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </motion.a>
          <motion.a
            href={settings.linkedinUrl || 'https://linkedin.com/in/bobby-esarapu-68543230'}
            target="_blank"
            rel="noopener noreferrer"
            {...ICON_BUTTON_INTERACTIONS}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
          {settings.itchUrl && (
            <motion.a
              href={settings.itchUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...ICON_BUTTON_INTERACTIONS}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Itch.io Games"
            >
              <Gamepad2 className="w-5 h-5" />
            </motion.a>
          )}
        </motion.div>

        {/* Bouncing Scroll Down Indicator */}
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
            <span className="uppercase tracking-widest text-[10px]">Explore Games</span>
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-4 h-4 text-accent" />
            </motion.div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
