import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Gamepad2, ArrowUp, Linkedin, Github } from 'lucide-react';
import { ICON_BUTTON_INTERACTIONS } from '../../lib/animations';

export const Footer: React.FC = () => {
  const { settings } = usePortfolio();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080b0d] border-t border-white/10 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="font-display font-extrabold text-white text-base tracking-tight">
                {settings.heroName || 'BOBBY ESARAPU'}
              </span>
              <p className="text-[11px] font-mono text-gray-500">
                Unity Game Developer • Redundant Studios
              </p>
            </div>
          </div>

          {/* Quick Anchor Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
            <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
            <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#experience" className="hover:text-accent transition-colors">Experience</a>
            <a href="#education" className="hover:text-accent transition-colors">Education</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </div>

          {/* Social Links & Scroll to Top */}
          <div className="flex items-center gap-3">
            <a
              href={settings.linkedinUrl || 'https://www.linkedin.com/in/bobby-esarapu-68543230/'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-accent border border-white/10 transition-colors"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={settings.githubUrl || 'https://github.com/esarapubobby'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-accent border border-white/10 transition-colors"
              aria-label="GitHub Profile"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <motion.button
              {...ICON_BUTTON_INTERACTIONS}
              onClick={handleScrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};
