import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion, useReducedMotion } from 'framer-motion';
import { Gamepad2, FileDown, Github, Linkedin, ArrowDown, Sparkles, MapPin, Terminal } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DecryptedText } from '../ui/DecryptedText';
import { Spotlight } from '../ui/Spotlight';
import { GameScene3D } from '../ui/GameScene3D';
import { BUTTON_INTERACTIONS, ICON_BUTTON_INTERACTIONS } from '../../lib/animations';
import { getLenis } from '../../lib/lenis';

export const Hero: React.FC = () => {
  const { settings } = usePortfolio();
  const heroContainerRef = useRef<HTMLElement | null>(null);
  const elementsRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // GSAP Coordinated Entrance Timeline
  useEffect(() => {
    if (shouldReduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
        .fromTo(
          '.hero-title-divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo(
          '.hero-subtitle',
          { opacity: 0, y: 15, letterSpacing: '0.05em' },
          { opacity: 1, y: 0, letterSpacing: '0.18em', duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          '.hero-quote',
          { opacity: 0, y: 15, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '.hero-tags > *',
          { opacity: 0, y: 12, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          '.hero-actions',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-3d',
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)' },
          '-=0.8'
        );
    }, heroContainerRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -70 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={heroContainerRef}
      id="home"
      className="relative min-h-[94vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Cinematic Ambient Spotlight & Atmospheric Glow */}
      <Spotlight className="-top-36 left-1/4" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Typography & Call-to-actions */}
          <div ref={elementsRef} className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Availability Badge */}
            {settings.showAvailability && (
              <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-gray-200 hover:border-accent/50 transition-colors shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span>{settings.heroAvailabilityText || 'Open for Game Dev Roles & Indie Collaborations'}</span>
              </div>
            )}

            {/* Name Heading with Decrypted Game Scramble Animation */}
            <div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-display uppercase leading-[1.08]">
                <DecryptedText
                  text={settings.heroName || 'BOBBY ESARAPU'}
                  speed={35}
                  maxIterations={12}
                  className="text-white"
                  parentClassName="inline-block"
                />
              </h1>

              {/* Professional Title with Dividing Neon Line */}
              <div className="mt-3 flex items-center justify-center lg:justify-start gap-3">
                <div className="hero-title-divider h-[2px] w-12 bg-accent origin-left" />
                <h2 className="hero-subtitle text-base sm:text-xl md:text-2xl font-bold tracking-widest text-accent font-mono uppercase">
                  {settings.heroTitle || 'UNITY GAME DEVELOPER'}
                </h2>
              </div>
            </div>

            {/* Philosophy Quote */}
            <p className="hero-quote text-base sm:text-xl text-gray-300 font-light max-w-xl mx-auto lg:mx-0 italic font-sans leading-relaxed">
              "{settings.heroQuote || 'Building immersive gameplay experiences, one system at a time.'}"
            </p>

            {/* Quick Engine & Architecture Highlights */}
            <div className="hero-tags flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-mono text-gray-400 pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-default">
                <Gamepad2 className="w-3.5 h-3.5 text-accent" />
                Redundant Studios Member
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-default">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                C# Gameplay & Enemy AI
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-default">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Tadepalligudem, AP, India
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="hero-actions flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <motion.a
                href="#projects"
                onClick={handleScrollToProjects}
                {...BUTTON_INTERACTIONS}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent text-black font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25 group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
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
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-accent/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <FileDown className="w-4 h-4 text-accent" />
                <span>Download Resume</span>
              </motion.a>

              {/* Social Channels with Hover Pop */}
              <div className="flex items-center gap-2 pl-2">
                <motion.a
                  href={settings.githubUrl || 'https://github.com/esarapubobby'}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...ICON_BUTTON_INTERACTIONS}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent text-gray-400"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href={settings.linkedinUrl || 'https://linkedin.com/in/bobby-esarapu-68543230'}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...ICON_BUTTON_INTERACTIONS}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:text-white hover:border-accent hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent text-gray-400"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Three.js Unity Artifact */}
          <div className="hero-3d lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
              {/* Radial backlight */}
              <div className="absolute inset-0 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

              {/* Three.js Interactive 3D Canvas */}
              <GameScene3D className="w-full h-full relative z-10" />

              {/* Engine Spec HUD Footer badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#111720]/90 border border-white/10 text-[10px] font-mono text-gray-400 backdrop-blur-md flex items-center gap-2 whitespace-nowrap z-20">
                <Terminal className="w-3 h-3 text-accent" />
                <span>Interact: Move pointer to rotate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 flex justify-center">
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
        </div>
      </div>
    </section>
  );
};
