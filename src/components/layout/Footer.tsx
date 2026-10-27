import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Gamepad2, Lock, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Scroll to Top and Admin Link */}
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-accent transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-accent/40"
              title="Protected Admin Portal"
            >
              <Lock className="w-3 h-3 text-accent" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={handleScrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-400">
          <p>{settings.footerText || `© ${new Date().getFullYear()} Bobby Esarapu. All rights reserved.`}</p>
          <p className="flex items-center gap-2">
            <span>Powered by Unity Engine Stack, React & Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
