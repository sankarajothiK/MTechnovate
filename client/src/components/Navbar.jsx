import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Careers', href: '#careers' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' }
];

export default function Navbar({ company }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'careers', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const logoSrc = company?.logo || '/logo.jpg';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-indigo-100/80 dark:border-slate-800 shadow-md shadow-indigo-950/5' 
          : 'py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-850'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3.5 group focus:outline-none"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-1 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-750 shadow-sm group-hover:shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300 shrink-0">
              <img 
                src={logoSrc} 
                alt="M Technovate Solutions" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/logo.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                M TECHNOVATE <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">SOLUTIONS</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="h-0.5 w-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                <span className="text-[10px] sm:text-[11px] tracking-[0.18em] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Innovate at every step
                </span>
                <span className="h-0.5 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>
          </a>

          {/* Exact 6 Links: Home, About Us, Services, Careers, Gallery, Contact */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-inner">
            {navLinks.map((item) => {
              const targetId = item.href.substring(1);
              const isActive = activeSection === targetId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-100 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Button & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-gradient-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <span>Let's Talk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Right Bar: Theme Toggle + Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none shadow-xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl border-b border-indigo-100 dark:border-slate-800 px-4 pt-4 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((item) => {
            const targetId = item.href.substring(1);
            const isActive = activeSection === targetId;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>{item.name}</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </a>
            );
          })}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Theme Mode</span>
              <ThemeToggle />
            </div>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-gradient-primary w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-md"
            >
              <span>Let's Talk</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
