import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUp, Mail, Phone, MapPin, Linkedin, Twitter, Globe } from 'lucide-react';

export default function Footer({ company }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoSrc = company?.logo || '/logo.jpg';
  const address = company?.address || 'M.G.Complex, Busstand, Kadayam-627 415.';
  const email = company?.email || 'mtechnovatesolutions@gmail.com';
  const phone = company?.phone || '+91 94884 12345';

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-850 pt-16 pb-12 overflow-hidden">
      
      {/* Top Iridescent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 via-violet-500 to-cyan-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 border border-slate-700 shadow-md">
                <img
                  src={logoSrc}
                  alt="M TECHNOVATE SOLUTIONS"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/logo.jpg'; }}
                />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl text-white tracking-wider">
                  M TECHNOVATE
                </span>
                <p className="text-[10px] tracking-[0.18em] uppercase font-bold text-indigo-400">
                  {company?.tagline || 'Delivering Trusted Global Data Solutions'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              A premier global data technology, BPO, and document processing enterprise delivering high-accuracy data services, records digitization, and international back-office support.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={company?.social_linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={company?.social_twitter || "https://twitter.com"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#home"
                onClick={() => scrollTo('home')}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors"
                aria-label="Global"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-400 font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => scrollTo('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">Data Services</button></li>
              <li><button onClick={() => scrollTo('careers')} className="hover:text-white transition-colors">Careers & Jobs</button></li>
              <li><button onClick={() => scrollTo('gallery')} className="hover:text-white transition-colors">Showcase Gallery</button></li>
              <li><button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>

          {/* Core Services Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-400 font-bold">
              Global Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">USA Documentation & Vital Records</button></li>
              <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">Global Data Entry Processing</button></li>
              <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">Historical Records Archival</button></li>
              <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">EPUB & Digital Publishing</button></li>
              <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">International Voice / Semi-Voice BPO</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-400 font-bold">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-300 hover:text-white font-mono">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-mono">{phone}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} M TECHNOVATE SOLUTIONS. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
