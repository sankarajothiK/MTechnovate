import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUp, Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Globe } from 'lucide-react';

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M17.47 14.38C17.17 14.23 15.69 13.5 15.42 13.4C15.14 13.3 14.94 13.25 14.74 13.55C14.54 13.85 13.96 14.53 13.78 14.73C13.61 14.93 13.43 14.96 13.13 14.81C12.83 14.66 11.86 14.34 10.71 13.31C9.81 12.51 9.21 11.53 9.03 11.23C8.86 10.93 9.01 10.76 9.17 10.61C9.3 10.48 9.47 10.26 9.62 10.09C9.77 9.91 9.82 9.79 9.92 9.59C10.02 9.38 9.97 9.21 9.9 9.06C9.82 8.91 9.22 7.42 8.97 6.82C8.73 6.23 8.48 6.31 8.29 6.3C8.12 6.29 7.92 6.29 7.72 6.29C7.52 6.29 7.19 6.37 6.92 6.67C6.64 6.97 5.86 7.7 5.86 9.18C5.86 10.67 6.94 12.1 7.09 12.3C7.24 12.5 9.21 15.54 12.23 16.85C12.95 17.16 13.51 17.34 13.95 17.48C14.67 17.71 15.33 17.68 15.85 17.6C16.43 17.51 17.63 16.87 17.88 16.17C18.13 15.47 18.13 14.87 18.06 14.74C17.98 14.61 17.78 14.54 17.47 14.38Z" />
    </svg>
  );
}

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
  const phone = company?.phone || '+91 87783 40454';
  const whatsapp = company?.whatsapp_number || '8778340454';
  const linkedin = company?.social_linkedin || 'https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D';
  const instagram = company?.social_instagram || 'https://www.instagram.com/mtechnovatesolutions?stkn=MTg5dmt3cmhjMWN4Mw==';

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
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#0A66C2] transition-colors"
                aria-label="LinkedIn"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
                title="Instagram Page"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#25D366] transition-colors"
                aria-label="WhatsApp"
                title="WhatsApp: +91 87783 40454"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={company?.social_twitter || "https://twitter.com/mtechnovate"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
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
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-300 hover:text-white font-mono">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services." target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-mono font-semibold">
                  WhatsApp: {whatsapp}
                </a>
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
