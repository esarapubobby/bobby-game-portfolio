import React, { useState, useEffect } from 'react';
import { Menu, X, FileDown, Terminal, Gamepad2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { settings } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0d0f]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Wordmark */}
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/60 group-hover:bg-accent/10 transition-colors">
              <Gamepad2 className="w-5 h-5 text-accent" />
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
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative py-1 focus:outline-none focus:ring-2 focus:ring-accent rounded"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions: Resume button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={settings.resumeUrl || '/Bobby_Esarapu_Resume.pdf'}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-accent hover:bg-accent-hover rounded-md transition-all shadow-sm hover:shadow-accent/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background"
            >
              <FileDown className="w-4 h-4" />
              <span>Resume</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href={settings.resumeUrl || '/Bobby_Esarapu_Resume.pdf'}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-accent rounded transition-all"
              aria-label="Download Resume"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c1014] border-b border-white/10 px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-3 py-2.5 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                Tadepalligudem, AP, India
              </span>
              <a
                href="#admin"
                className="text-gray-500 hover:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                /admin
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
