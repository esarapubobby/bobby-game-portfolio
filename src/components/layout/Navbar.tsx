import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, Gamepad2, Linkedin, Github } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TRANSITIONS } from '../../lib/animations';
import { getLenis } from '../../lib/lenis';

export const Navbar: React.FC = () => {
  const { settings } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Scroll position detector
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section observer to update active indicator
  useEffect(() => {
    const sectionIds = ['home', 'projects', 'skills', 'about', 'experience', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.25, rootMargin: '-80px 0px -50% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0d0f]/90 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/50 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Wordmark with Tap feedback */}
          <motion.a
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home', 'home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/60 group-hover:bg-accent/10 transition-colors">
              <Gamepad2 className="w-5 h-5 text-accent transition-transform group-hover:rotate-12 duration-200" />
            </div>
            <div>
              <span className="font-display font-black tracking-tight text-lg text-white group-hover:text-accent transition-colors">
                {settings.heroName || 'BOBBY ESARAPU'}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>UNITY GAME DEV</span>
              </div>
            </div>
          </motion.a>

          {/* Desktop Navigation with Animated Indicator Pill */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center gap-1.5 bg-[#10151c]/70 p-1.5 rounded-full border border-white/10 backdrop-blur-md" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href, link.id)}
                    className={`relative px-4 py-1.5 text-xs font-mono transition-colors rounded-full focus:outline-none focus:ring-1 focus:ring-accent ${
                      isActive ? 'text-accent font-semibold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-white/10 border border-accent/40"
                        transition={TRANSITIONS.snappy}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#0c1014]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 space-y-3 overflow-hidden"
          >
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href, link.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </motion.a>
                );
              })}
              {/* Mobile Social Links */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={settings.linkedinUrl || 'https://linkedin.com/in/bobby-esarapu-68543230'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-gray-300 hover:text-white hover:border-accent/40"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-accent" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={settings.githubUrl || 'https://github.com/esarapubobby'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-gray-300 hover:text-white hover:border-accent/40"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5 text-accent" />
                  <span>GitHub</span>
                </a>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  Tadepalligudem, AP, India
                </span>
                <a
                  href="/admin"
                  className="text-gray-400 hover:text-accent font-mono"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  /admin
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
