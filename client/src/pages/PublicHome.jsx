import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Menu, X, Mail, MapPin, Phone, 
  Sparkles, ShieldCheck, Upload, FileText, Layers, 
  Archive, BookOpen, Headphones, Cloud, Code2, 
  Activity, Quote, Bot, Cpu, Zap, CheckCircle2, 
  ChevronRight, ArrowRight, Shield, Award, Users, 
  Smile, Briefcase, Radio, Globe, Clock, Check, Star,
  Maximize2, Eye, Compass, Building2
} from 'lucide-react';
import { api, jobService, serviceService, galleryService, websiteService, DEFAULT_GALLERY_ITEMS } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import DigitalUniverseCanvas from '../components/DigitalUniverseCanvas';
import NetworkPipeline from '../components/NetworkPipeline';
import GlobalOperationsNetwork from '../components/GlobalOperationsNetwork';
import TechHumanSynergy from '../components/TechHumanSynergy';
import bgImage from '../assets/bg.png';

// 6 Core BPO Services
const serviceData = [
  {
    id: 'customer-support',
    number: '01',
    title: 'Customer Support',
    tagline: 'Human conversations. Smarter experiences.',
    desc: 'Empathetic, multi-channel voice and digital assistance ensuring high customer retention and rapid query resolution 24/7/365.',
    icon: Headphones,
    color: '#00f0ff',
    capabilities: ['Inbound & Outbound Voice', 'Omni-channel Live Chat', 'Ticket Lifecycle Triage', 'SLA Escalation Governance'],
    stat: 'Multi-Channel Voice & Chat Support'
  },
  {
    id: 'data-management',
    number: '02',
    title: 'Data Management',
    tagline: 'Clean records. Scalable intelligence.',
    desc: 'Enterprise document indexing, historical record archival, and high-accuracy data extraction with strict validation algorithms.',
    icon: Layers,
    color: '#8b5cf6',
    capabilities: ['USA Vital Records Archival', 'Handwritten Document Deciphering', 'Multi-lingual Data Entry', 'Database Deduplication'],
    stat: '99.8% Target Accuracy'
  },
  {
    id: 'back-office',
    number: '03',
    title: 'Back Office Operations',
    tagline: 'Frictionless administration at global scale.',
    desc: 'Automating high-volume transactional burdens, claims processing, and administrative backlogs with continuous audit trails.',
    icon: FileText,
    color: '#3b82f6',
    capabilities: ['Order & Invoice Reconciliation', 'Claims Adjudication', 'Catalog Content Moderation', 'KYC & Identity Verification'],
    stat: 'Streamlined Back-Office Workflows'
  },
  {
    id: 'process-optimization',
    number: '04',
    title: 'Process Optimization',
    tagline: 'Engineered workflows for speed & accuracy.',
    desc: 'Architecting custom operating pipelines that eliminate structural bottlenecks and minimize human error across business units.',
    icon: Cpu,
    color: '#ec4899',
    capabilities: ['Workflow Architecture Audits', 'Automation Gap Diagnostics', 'Lean Queue Management', 'Continuous KPI Telemetry'],
    stat: 'Standardized Operating Protocols'
  },
  {
    id: 'quality-compliance',
    number: '05',
    title: 'Quality & Compliance',
    tagline: 'Rigorous accuracy & uncompromising security.',
    desc: 'Multi-tiered double-key inspection frameworks meeting international security, confidentiality, and regulatory benchmarks.',
    icon: ShieldCheck,
    color: '#10b981',
    capabilities: ['Dual-Layer Sample Auditing', 'HIPAA & ISO Alignment', 'Encrypted Record Transport', 'Full Audit Log Dispatch'],
    stat: '100% Security & Compliance'
  },
  {
    id: 'digital-support',
    number: '06',
    title: 'Digital Support Services',
    tagline: 'Next-generation multi-channel execution.',
    desc: 'EPUB digital conversion, XML newspaper zoning, and targeted Australian market lead harvesting for high-growth sectors.',
    icon: Sparkles,
    color: '#f59e0b',
    capabilities: ['EPUB 3.0 & XML Structuring', 'OCR Clean-up & Zoning', 'Targeted Web Lead Harvesting', 'Multi-format Asset Publishing'],
    stat: 'EPUB 3.0 & XML Structuring Standards'
  }
];

const ICON_LOOKUP = {
  Headphones, Layers, FileText, Activity, Archive, BookOpen,
  Cpu, Cloud, Code2, ShieldCheck, Zap, Shield, Globe, Award,
  Users, Radio, Bot, Sparkles, Compass
};

function resolveServiceIcon(icon) {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && icon.$$typeof)) return icon;
  if (typeof icon === 'string' && ICON_LOOKUP[icon]) return ICON_LOOKUP[icon];
  return Layers;
}

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M17.47 14.38C17.17 14.23 15.69 13.5 15.42 13.4C15.14 13.3 14.94 13.25 14.74 13.55C14.54 13.85 13.96 14.53 13.78 14.73C13.61 14.93 13.43 14.96 13.13 14.81C12.83 14.66 11.86 14.34 10.71 13.31C9.81 12.51 9.21 11.53 9.03 11.23C8.86 10.93 9.01 10.76 9.17 10.61C9.3 10.48 9.47 10.26 9.62 10.09C9.77 9.91 9.82 9.79 9.92 9.59C10.02 9.38 9.97 9.21 9.9 9.06C9.82 8.91 9.22 7.42 8.97 6.82C8.73 6.23 8.48 6.31 8.29 6.3C8.12 6.29 7.92 6.29 7.72 6.29C7.52 6.29 7.19 6.37 6.92 6.67C6.64 6.97 5.86 7.7 5.86 9.18C5.86 10.67 6.94 12.1 7.09 12.3C7.24 12.5 9.21 15.54 12.23 16.85C12.95 17.16 13.51 17.34 13.95 17.48C14.67 17.71 15.33 17.68 15.85 17.6C16.43 17.51 17.63 16.87 17.88 16.17C18.13 15.47 18.13 14.87 18.06 14.74C17.98 14.61 17.78 14.54 17.47 14.38Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73-.78-1.73-1.73Z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const processSteps = [
  { step: '01', title: 'DISCOVER', desc: 'Deep intake analysis of operational bottlenecks, tech stack, and accuracy criteria.' },
  { step: '02', title: 'ANALYZE', desc: 'Telemetry mapping, volume modeling, and process re-engineering.' },
  { step: '03', title: 'DESIGN', desc: 'Bespoke workflow architecture, double-key checks, and SLA definitions.' },
  { step: '04', title: 'EXECUTE', desc: 'Deployment of specialized, trained Kadayam operational pods with dedicated leads.' },
  { step: '05', title: 'OPTIMIZE', desc: 'Real-time bottleneck telemetry, AI assistance, and iterative efficiency gains.' },
  { step: '06', title: 'DELIVER', desc: 'Guaranteed 99.8% verified outputs, scheduled delivery runs, and executive reporting.' }
];

const statsData = [
  { value: '2026', label: 'Starting Year', desc: 'Commencing operations this month from Kadayam HQ' },
  { value: '500+', label: 'Workstation Capacity', desc: 'Modern delivery facility ready for enterprise scale' },
  { value: '99.8%', label: 'Target Accuracy', desc: 'Multi-tiered double-key inspection framework' },
  { value: '24/7', label: 'Operating Readiness', desc: 'Continuous shift rotations for global timezones' },
  { value: '100%', label: 'Compliance Standard', desc: 'Strict data security & confidentiality protocols' }
];

export default function PublicHome() {
  const { isDark } = useTheme();

  const [data, setData] = useState({
    company: {
      name: 'M TECHNOVATE SOLUTIONS',
      address: 'M.G.Complex, Busstand, Kadayam-627 415.',
      email: 'mtechnovatesolutions@gmail.com',
      phone: '+91 87783 40454',
      whatsapp_number: '8778340454',
      social_linkedin: 'https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D',
      social_instagram: 'https://www.instagram.com/mtechnovatesolutions?stkn=MTg5dmt3cmhjMWN4Mw==',
      ceo_name: 'RAMESH K',
      ceo_designation: 'Founder & Managing Director',
      ceo_photo: '/uploads/company/ceo_ramesh_k.jpg'
    },
    services: [],
    gallery: DEFAULT_GALLERY_ITEMS || [],
    jobs: []
  });

  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [contactSent, setContactSent] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  // Exact 6 navbar items specified by the user
  const navItems = [
    { name: 'Home', href: '#Home', icon: Compass, label: '01' },
    { name: 'About Us', href: '#About', icon: Building2, label: '02' },
    { name: 'Services', href: '#Services', icon: Layers, label: '03' },
    { name: 'Gallery', href: '#Gallery', icon: Eye, label: '04' },
    { name: 'Careers', href: '#Careers', icon: Briefcase, label: '05' },
    { name: 'Contact', href: '#Contact', icon: Mail, label: '06' }
  ];

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (menu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menu]);

  // Robust smooth scroll handler with sticky header offset (75px)
  const handleNavClick = (e, href) => {
    if (!href || !href.startsWith('#')) return;
    if (e && e.preventDefault) e.preventDefault();
    setMenu(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 75;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', href);
    }
  };

  const sanitizeCompany = (comp) => {
    if (!comp) return comp;
    const phone = (!comp.phone || comp.phone.includes('94884') || comp.phone.includes('987')) ? '+91 87783 40454' : comp.phone;
    const whatsapp = (!comp.whatsapp_number || comp.whatsapp_number.includes('94884') || comp.whatsapp_number.includes('987')) ? '8778340454' : comp.whatsapp_number;
    return { ...comp, phone, whatsapp_number: whatsapp };
  };

  // Fetch backend records
  const loadData = async () => {
    try {
      const [compRes, servRes, galRes, jobsRes] = await Promise.all([
        api.getCompany().catch(() => null),
        api.getServices().catch(() => null),
        api.getGallery().catch(() => null),
        api.getJobs().catch(() => null)
      ]);

      setData(prev => ({
        company: compRes?.success && compRes.data ? sanitizeCompany({ ...prev.company, ...compRes.data }) : sanitizeCompany(prev.company),
        services: servRes?.success && servRes.data?.length ? servRes.data : prev.services,
        gallery: (galRes?.success && galRes.data?.length) ? galRes.data : (prev.gallery?.length ? prev.gallery : DEFAULT_GALLERY_ITEMS),
        jobs: jobsRes?.success && jobsRes.data?.length ? jobsRes.data : prev.jobs
      }));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Real-time Firestore subscriptions for live updates
    const unsubJobs = jobService.subscribeJobs?.((jobs) => {
      if (jobs?.length) setData(prev => ({ ...prev, jobs }));
    }, true);

    const unsubServices = serviceService.subscribeServices?.((services) => {
      if (services?.length) setData(prev => ({ ...prev, services }));
    });

    const unsubGallery = galleryService.subscribeGallery?.((gallery) => {
      if (gallery?.length) setData(prev => ({ ...prev, gallery }));
    });

    const unsubCompany = websiteService.subscribeCompanyProfile?.((company) => {
      if (company) setData(prev => ({ ...prev, company: sanitizeCompany({ ...prev.company, ...company }) }));
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubJobs?.();
      unsubServices?.();
      unsubGallery?.();
      unsubCompany?.();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const c = sanitizeCompany(data.company);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSent('');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form);

    try {
      const res = await api.submitContact(payload);
      if (res.success) {
        setContactSent('Thank you. Your inquiry has been routed to our Kadayam leadership team.');
        e.target.reset();
      } else {
        setContactSent(res.message || 'Please check your information and try again.');
      }
    } catch (err) {
      setContactSent('Transmission error. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500 selection:text-black overflow-x-hidden relative transition-colors duration-300">
      
      {/* -------------------------------------------------------------
          NAVBAR: EXACT 6 ITEMS (Home, About Us, Services, Gallery, Careers, Contact)
          Flawless in both Light Mode & Dark Mode with Theme Toggle
          ------------------------------------------------------------- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-[#030712]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-lg py-2.5 sm:py-3' 
          : 'bg-white/60 dark:bg-transparent backdrop-blur-md border-b border-slate-200/50 dark:border-transparent py-3 sm:py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          
          {/* Official Brand Logo */}
          <a 
            href="#Home" 
            onClick={(e) => handleNavClick(e, '#Home')}
            className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 cursor-pointer" 
            data-testid="brand-logo"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl p-1 bg-white border border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden shrink-0">
              <img 
                src="/logo.jpg" 
                alt="M TECHNOVATE SOLUTIONS" 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = '/logo.jpg'; }}
              />
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <span className="font-['Outfit'] font-black tracking-wider text-sm sm:text-base md:text-lg text-slate-900 dark:text-white leading-tight truncate">
                M TECH<span className="text-cyan-500 dark:text-cyan-400">NOVATE</span>
              </span>
              <span className="hidden sm:block text-[8.5px] font-mono tracking-[0.24em] text-cyan-600 dark:text-cyan-400 font-bold uppercase mt-0.5 truncate">
                INNOVATE AT EVERY STEP
              </span>
            </div>
          </a>

          {/* Exact 6 Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-widest text-slate-700 dark:text-slate-300 uppercase font-semibold">
            {navItems.map(item => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Header Action Area */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            {/* Responsive Theme Toggle Button (Compact 36px on mobile, full pill on desktop) */}
            <ThemeToggle />

            {/* Quick Contact Action Button (Tablet & Desktop) */}
            <a 
              href="#Contact" 
              onClick={(e) => handleNavClick(e, '#Contact')}
              className="hidden md:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-['Outfit'] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-md hover:shadow-cyan-500/30 hover:scale-105 transition-all shrink-0 cursor-pointer"
            >
              Partner With Us <ArrowUpRight size={14} />
            </a>

            {/* Admin Portal Link (Desktop) */}
            <Link 
              to="/admin" 
              className="hidden lg:inline-flex p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Admin Portal"
              data-testid="nav-admin-link"
            >
              <Cpu size={18} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setMenu(!menu)} 
              className="lg:hidden p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
              aria-expanded={menu}
              data-testid="mobile-menu-button"
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* -------------------------------------------------------------
          MOBILE NAVIGATION DRAWER & BACKDROP (Off-Canvas)
          100% Reliable across all mobile devices & browsers
          ------------------------------------------------------------- */}
      {/* Dimmed backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          menu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenu(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside
        id="mobile-nav-drawer"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-80 max-w-[85vw] bg-white dark:bg-[#060B18] z-[70] shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          menu ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        aria-label="Mobile Navigation"
      >
        <div>
          {/* Top Bar: Brand Logo & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg p-0.5 bg-white border border-cyan-400/60 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Outfit'] font-black text-sm text-slate-900 dark:text-white tracking-wider leading-tight">
                  M TECH<span className="text-cyan-500">NOVATE</span>
                </span>
                <span className="text-[7.5px] font-mono tracking-widest text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                  INNOVATE AT EVERY STEP
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setMenu(false)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Close navigation"
              data-testid="close-mobile-menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Section Links */}
          <div className="py-5 space-y-1.5">
            <div className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 font-bold">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 border border-transparent hover:border-cyan-500/20 transition-all text-left group cursor-pointer"
                  data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </span>
                    <span className="font-['Outfit'] tracking-wide">{item.name}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2.5">
          {/* WhatsApp Direct Chat */}
          <a
            href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenu(false)}
            className="w-full py-3 px-4 rounded-xl font-['Outfit'] font-bold text-xs uppercase tracking-wider bg-[#25D366] text-white shadow-md hover:bg-[#20bd5a] flex items-center justify-center gap-2 transition-all"
            data-testid="mobile-whatsapp-btn"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>WhatsApp: +91 87783 40454</span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="#Contact"
              onClick={(e) => handleNavClick(e, '#Contact')}
              className="flex-1 py-3 px-4 rounded-xl font-['Outfit'] font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              data-testid="mobile-partner-btn"
            >
              <span>Partner With Us</span>
              <ArrowRight size={14} />
            </a>

            <Link
              to="/admin"
              onClick={() => setMenu(false)}
              className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors flex items-center justify-center"
              title="Admin Portal"
              data-testid="mobile-admin-btn"
            >
              <Shield size={16} />
            </Link>
          </div>
        </div>
      </aside>

      <main>
        
        {/* -------------------------------------------------------------
            SECTION 1: HERO SECTION (Digital Operations Universe + Image Showcase)
            ------------------------------------------------------------- */}
        <section id="Home" className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-4 sm:px-6 md:px-12 overflow-hidden scroll-mt-20">
          
          {/* Generative Canvas Background */}
          <DigitalUniverseCanvas />

          {/* Ambient Lighting Accents */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

          {/* SVG ClipPath Definition for the Curved Building */}
          <svg className="absolute pointer-events-none" style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
            <defs>
              <clipPath id="heroBuildingCurve" clipPathUnits="objectBoundingBox">
                <path d="M 0.12,0 C 0.18,0.35 0.02,0.65 0.08,1 L 1,1 L 1,0 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* Right Side: Building Image completely filling the curved space (Desktop lg+) */}
          <div 
            className="hidden lg:block absolute top-0 right-0 bottom-0 w-full lg:w-[48%] xl:w-[50%] 2xl:w-[52%] h-full z-10 overflow-hidden pointer-events-auto group"
            style={{
              clipPath: 'url(#heroBuildingCurve)',
              WebkitClipPath: 'url(#heroBuildingCurve)'
            }}
          >
            {/* Campus Headquarters Building Image (Named bg) */}
            <img 
              src={bgImage || "/bg.png"} 
              alt="M TECHNOVATE SOLUTIONS Corporate Headquarters Campus" 
              className="w-full h-full object-cover object-[center_30%] transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              onError={(e) => { e.currentTarget.src = '/bg.png'; }}
            />

            {/* Cinematic Gradient Overlays for Seamless Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-transparent pointer-events-none" />

            {/* Upper Right Campus Badge */}
            <div className="absolute top-8 right-8 z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/75 border border-white/20 backdrop-blur-xl shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-mono tracking-widest text-slate-200 font-semibold uppercase">
                  KADAYAM HEADQUARTERS • 2026
                </span>
              </div>
            </div>

            {/* Lower Telemetry HUD Bar */}
            <div className="absolute bottom-8 left-14 right-8 z-20 pointer-events-none">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/75 border border-white/15 backdrop-blur-2xl shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <span>M TECHNOVATE SOLUTIONS</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-cyan-400 font-medium">CORPORATE CAMPUS</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1 flex items-center gap-3">
                    <span>Kadayam, Tamil Nadu</span>
                    <span className="text-slate-600">•</span>
                    <span>Starting 2026</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400">“Innovate at every step”</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean, Normal & Beautiful Dividing Curve between Wordings and Building (Desktop lg+) */}
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-full lg:w-[48%] xl:w-[50%] 2xl:w-[52%] h-full z-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cleanCurveStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                  <stop offset="35%" stopColor="rgba(255, 255, 255, 0.45)" />
                  <stop offset="70%" stopColor="rgba(255, 255, 255, 0.4)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
                </linearGradient>
                <filter id="softCurveShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="-3" dy="0" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Clean, Elegant Divider Stroke with Soft Natural Depth */}
              <path
                d="M 12,0 C 18,35 2,65 8,100"
                fill="none"
                stroke="url(#cleanCurveStroke)"
                strokeWidth="0.75"
                filter="url(#softCurveShadow)"
              />
            </svg>
          </div>

          {/* Left Side Content Container: Wordings remain 100% intact */}
          <div className="max-w-7xl mx-auto w-full relative z-20">
            <div className="w-full lg:w-[54%] xl:w-[50%] text-left">
              
              {/* Headquarters Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl mb-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-[11px] font-mono tracking-widest text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                    ESTABLISHED 2026
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400">
                  KADAYAM GLOBAL HQ
                </span>
              </div>

              {/* Monumental Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-[1.05] uppercase" data-testid="hero-heading">
                WE POWER<br />
                <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                  BUSINESS
                </span> BEHIND<br />
                THE SCENES.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-normal" data-testid="hero-description">
                Smart, scalable and reliable BPO solutions designed to simplify operations, improve customer experiences and accelerate business growth.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a 
                  href="#Contact" 
                  onClick={(e) => handleNavClick(e, '#Contact')}
                  className="px-8 py-4 rounded-full font-['Outfit'] font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                  data-testid="hero-services-button"
                >
                  Let’s Work Together <ArrowRight size={16} />
                </a>

                <a 
                  href="#Services" 
                  onClick={(e) => handleNavClick(e, '#Services')}
                  className="px-8 py-4 rounded-full font-['Outfit'] font-bold text-sm uppercase tracking-wider border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white backdrop-blur-xl transition-all flex items-center justify-center text-center cursor-pointer"
                  data-testid="hero-contact-button"
                >
                  Explore Our Services
                </a>
              </div>

              {/* Mobile Curved Building Feature (< lg screens) */}
              <div className="lg:hidden mt-10 mb-6 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl bg-slate-950">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={bgImage || "/bg.png"} 
                    alt="M TECHNOVATE SOLUTIONS Corporate Campus" 
                    className="w-full h-full object-cover object-[center_30%]"
                    onError={(e) => { e.currentTarget.src = '/bg.png'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-start text-xs font-mono text-white">
                    <span className="flex items-center gap-1.5 bg-slate-900/85 px-3 py-1 rounded-full border border-white/10 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      KADAYAM HQ CAMPUS • 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Horizontal Glass Dock (5 Items) */}
              <div className="w-full mt-12 relative z-10">
                <div className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {[
                    { name: 'CUSTOMER EXPERIENCE', icon: Headphones, color: '#00f0ff' },
                    { name: 'DATA OPERATIONS', icon: Layers, color: '#8b5cf6' },
                    { name: 'PROCESS MANAGEMENT', icon: Cpu, color: '#ec4899' },
                    { name: 'BACK-OFFICE SUPPORT', icon: FileText, color: '#3b82f6' },
                    { name: 'QUALITY ASSURANCE', icon: ShieldCheck, color: '#10b981' }
                  ].map((dock, idx) => {
                    const Icon = dock.icon;
                    return (
                      <div 
                        key={dock.name}
                        className={`p-3 rounded-xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center group cursor-default ${idx === 4 ? 'col-span-2 sm:col-span-1 xl:col-span-1' : ''}`}
                      >
                        <span 
                          className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110"
                          style={{ background: `${dock.color}18`, color: dock.color }}
                        >
                          <Icon size={16} />
                        </span>
                        <span className="text-[9.5px] font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                          {dock.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* -------------------------------------------------------------
            SECTION 2: ABOUT US (#About) — Editorial Split with CEO Photo
            ------------------------------------------------------------- */}
        <section id="About" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Big Statement & Narrative */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-mono tracking-widest uppercase mb-6 font-bold">
                  ABOUT M TECHNOVATE
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight uppercase leading-[1.08]" data-testid="about-heading">
                  WE DON’T JUST HANDLE PROCESSES.<br />
                  <span className="bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    WE MAKE THEM BETTER.
                  </span>
                </h2>

                <p className="mt-6 text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-xl" data-testid="about-description">
                  M TECHNOVATE SOLUTIONS is a premier non-IT global data technology, BPO, and document processing enterprise established in 2026 and headquartered in Kadayam, Tamil Nadu. We specialize in high-precision data processing, USA documentation & vital records management, handwritten historical document indexing, EPUB conversion, and international back-office support.
                </p>

                {/* 4 Editorial Core Values */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { title: 'HUMAN-FIRST', desc: 'Continuous empowerment of skilled youth & women in Kadayam.' },
                    { title: 'DATA-DRIVEN', desc: 'Rigorous algorithmic validation and zero decay.' },
                    { title: 'PROCESS-FOCUSED', desc: 'Custom architectures tailored to your existing software.' },
                    { title: 'QUALITY-OBSESSED', desc: 'Double-key 99.8% precision benchmark.' }
                  ].map((val, i) => (
                    <div key={val.title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">0{i + 1}</span>
                      <h4 className="font-['Outfit'] font-bold text-sm text-slate-900 dark:text-white mt-1">{val.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{val.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Executive Founder & CEO Panel with Photo */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
                  
                  {/* Photo Frame */}
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 dark:border-cyan-400/40 shadow-lg relative bg-slate-950" data-testid="ceo-photo">
                    <img 
                      src={c.ceo_photo || '/uploads/company/ceo_ramesh_k.jpg'} 
                      alt={c.ceo_name} 
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { e.target.src = '/ceo_ramesh_k.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                        FOUNDER & MANAGING DIRECTOR
                      </span>
                      <h3 className="font-['Outfit'] font-bold text-xl">{c.ceo_name}</h3>
                      <p className="text-xs font-mono text-slate-300">Kadayam HQ</p>
                    </div>
                  </div>

                  {/* Founder's Statement */}
                  <blockquote className="mt-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic border-l-2 border-cyan-500 pl-4 py-1 leading-relaxed">
                    “At M TECHNOVATE SOLUTIONS, founded in 2026, our mission is to deliver dependable, global-standard data operations with 99%+ accuracy, while creating empowering, sustainable career opportunities for skilled youth and women professionals right here in Kadayam.”
                  </blockquote>

                  {/* Founder LinkedIn Connect */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Executive Profile</span>
                    <a
                      href={c.social_linkedin || "https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A66C2]/15 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-[#0A66C2]/30 text-xs font-semibold transition-all shadow-xs"
                      title="Connect with RAMESH K on LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73-.78-1.73-1.73Z"/></svg>
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION 3: SERVICES (#Services) — 6 Glassmorphism Panels
            ------------------------------------------------------------- */}
        <section id="Services" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-slate-50 dark:bg-[#030712] border-t border-slate-200 dark:border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 font-bold">
                <Sparkles size={12} /> ENTERPRISE CAPABILITIES
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight uppercase" data-testid="services-heading">
                BUILT AROUND YOUR <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">BUSINESS</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
                Flexible BPO solutions that make complex operations simple.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.services && data.services.length > 0 ? data.services : serviceData).map((s, idx) => {
                const Icon = resolveServiceIcon(s.icon);
                const sColor = s.color || '#00f0ff';
                const sNumber = s.number || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
                const sTagline = s.tagline || s.short_desc || 'High-precision operational execution';
                const sDesc = s.desc || s.short_desc || s.detailed_desc || '';
                const sCaps = s.capabilities || (Array.isArray(s.tech_tags) ? s.tech_tags : (s.tech_tags ? String(s.tech_tags).split(',').map(t => t.trim()) : ['Verified Quality Protocol', 'SLA Governance']));
                const sStat = s.stat || '99.8% Target Accuracy';

                return (
                  <div
                    key={s.id || idx}
                    onClick={() => setSelectedService({ ...s, number: sNumber, color: sColor, tagline: sTagline, desc: sDesc, capabilities: sCaps, stat: sStat })}
                    className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                    data-testid={`service-card-${idx}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ background: `${sColor}18`, color: sColor, border: `1px solid ${sColor}40` }}
                        >
                          <Icon size={24} />
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-500">
                          {sNumber}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {s.title}
                      </h3>

                      <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-1 uppercase tracking-wider font-semibold">
                        “{sTagline}”
                      </p>

                      <p className="mt-4 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {sDesc}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {sCaps.map(cap => (
                          <span 
                            key={cap} 
                            className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {sStat}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center gap-1 font-bold">
                        Inspect Scope <ArrowUpRight size={14} />
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION 4: GALLERY (#Gallery) — Interactive Image Showcase
            ------------------------------------------------------------- */}
        <section id="Gallery" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-mono tracking-widest uppercase mb-4 font-bold">
                <Compass size={12} /> THE WORKPLACE & SYSTEMS
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight uppercase">
                INSIDE OUR <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">CAMPUS</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
                A visual glimpse into our modern operations center, digital systems, and dedicated talent in Kadayam.
              </p>
            </div>

            {/* Workplace Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.gallery.length ? (
                data.gallery.map((g, idx) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGallery(g)}
                    className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg cursor-pointer aspect-[4/3]"
                    data-testid={`gallery-image-${idx}`}
                  >
                    <img 
                      src={g.image_url || g.imageUrl || '/mtechnovate_office_building.jpg'} 
                      alt={g.title} 
                      className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/mtechnovate_office_building.jpg';
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                    <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1">
                        {g.category}
                      </span>
                      <h4 className="font-['Outfit'] font-bold text-sm sm:text-base leading-snug line-clamp-2">
                        {g.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={12} className="text-cyan-400" /> Click to expand
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-slate-400 text-sm">
                  Gallery items loading...
                </div>
              )}
            </div>

          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION 5: PROCESS & ARCHITECTURE
            ------------------------------------------------------------- */}
        <NetworkPipeline />

        <section className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-slate-50 dark:bg-[#030712] border-t border-slate-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
                OPERATIONAL MILESTONES
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-1 uppercase">
                THE CONTINUOUS ENGAGEMENT PIPELINE
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {processSteps.map((p) => (
                <div key={p.step} className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2">{p.step}</div>
                  <div className="font-['Outfit'] font-bold text-sm text-slate-900 dark:text-white mb-1">{p.title}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION 6: PERFORMANCE (#Performance)
            ------------------------------------------------------------- */}
        <section id="Performance" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4 font-bold">
                ESTABLISHED 2026
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight uppercase">
                BUILT FOR PRECISION. <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">READY FOR SCALE.</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Engineered with purpose-built delivery infrastructure, multi-tiered quality control, and round-the-clock shift capability from our Kadayam delivery headquarters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {statsData.map((stat) => (
                <div 
                  key={stat.label}
                  className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center shadow-lg"
                >
                  <div className="text-4xl md:text-5xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm font-['Outfit'] font-bold text-slate-800 dark:text-slate-200 mt-2">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {stat.desc}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <GlobalOperationsNetwork />

        <TechHumanSynergy />

        {/* -------------------------------------------------------------
            SECTION 7: CAREERS (#Careers) — ATS Job Openings
            ------------------------------------------------------------- */}
        <section id="Careers" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-slate-50 dark:bg-[#030712] border-t border-slate-200 dark:border-white/10 scroll-mt-20">
          <div className="max-w-6xl mx-auto relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-mono tracking-widest uppercase mb-4 font-bold">
                KADAYAM TALENT OPPORTUNITIES
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight uppercase">
                BUILD YOUR CAREER <span className="text-violet-600 dark:text-violet-400">WITH PURPOSE</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
                Join our world-class operational center in Kadayam. We invest in local professionals with continuous training and international exposure.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {data.jobs.length ? (
                data.jobs.map((job, idx) => (
                  <div 
                    key={job.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-cyan-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
                    data-testid={`job-card-${idx}`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">0{idx + 1}</span>
                        <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">{job.title}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 pl-7">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.employment_type}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-['Outfit'] font-bold uppercase tracking-wider bg-slate-900 hover:bg-cyan-500 text-white transition-all self-stretch sm:self-auto cursor-pointer"
                      data-testid={`job-apply-button-${idx}`}
                    >
                      Apply Now <ArrowUpRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-center text-slate-500 text-sm">
                  Active recruitment cycles are being prepared for launch.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION 8: CONTACT (#Contact)
            ------------------------------------------------------------- */}
        <section id="Contact" className="relative py-20 sm:py-32 px-4 sm:px-6 md:px-12 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 text-center scroll-mt-20">
          
          <div className="max-w-4xl mx-auto relative z-10">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6 font-bold">
              START THE CONVERSATION
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight uppercase leading-[1.08]">
              READY TO MOVE YOUR<br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                OPERATIONS FORWARD?
              </span>
            </h2>

            <p className="mt-6 text-slate-600 dark:text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Let’s build a smarter, faster and more reliable way to run your business.
            </p>

            <div className="mt-12 max-w-xl mx-auto p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl text-left">
              <form onSubmit={handleContactSubmit} className="space-y-4" data-testid="contact-form">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    name="name" 
                    required 
                    placeholder="Jane Doe" 
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500"
                    data-testid="contact-name-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Work Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      placeholder="jane@company.com" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500"
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                    <input 
                      name="subject" 
                      required 
                      placeholder="Data Archival / BPO" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500"
                      data-testid="contact-subject-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Operational Scope</label>
                  <textarea 
                    name="message" 
                    required 
                    rows={3}
                    placeholder="Describe your current volume, systems, or process requirements..." 
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm resize-none focus:outline-none focus:border-cyan-500"
                    data-testid="contact-message-input"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={contactLoading}
                  className="w-full py-4 rounded-xl font-['Outfit'] font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  data-testid="contact-submit-button"
                >
                  {contactLoading ? 'Transmitting to HQ...' : 'START A CONVERSATION →'}
                </button>

                {contactSent && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-center font-mono" data-testid="contact-success-message">
                    {contactSent}
                  </div>
                )}
              </form>
            </div>

            {/* Direct Connect Quick Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <a
                href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all flex flex-col items-center text-center gap-1.5 group"
              >
                <WhatsAppIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs font-['Outfit']">WhatsApp Direct</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">+91 87783 40454</span>
              </a>

              <a
                href={c.social_linkedin || "https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all flex flex-col items-center text-center gap-1.5 group"
              >
                <LinkedInIcon className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs font-['Outfit']">LinkedIn</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">RAMESH K Profile</span>
              </a>

              <a
                href={c.social_instagram || "https://www.instagram.com/mtechnovatesolutions?stkn=MTg5dmt3cmhjMWN4Mw=="}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 transition-all flex flex-col items-center text-center gap-1.5 group"
              >
                <InstagramIcon className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs font-['Outfit']">Instagram</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">@mtechnovatesolutions</span>
              </a>
            </div>

          </div>
        </section>

      </main>

      {/* -------------------------------------------------------------
          FOOTER
          ------------------------------------------------------------- */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 bg-slate-900 dark:bg-black text-slate-400 text-xs border-t border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg p-1 bg-white border border-cyan-400 flex items-center justify-center">
                <img src="/logo.jpg" alt="M Technovate" className="w-full h-full object-contain" />
              </div>
              <div className="font-['Outfit'] font-black text-lg text-white">
                M TECH<span className="text-cyan-400">NOVATE SOLUTIONS</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              “Innovate at every step” — Modern business process outsourcing, historical document archival, and global data operations center in Kadayam, Tamil Nadu.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href={c.social_linkedin || "https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0A66C2] transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href={c.social_instagram || "https://www.instagram.com/mtechnovatesolutions?stkn=MTg5dmt3cmhjMWN4Mw=="}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 transition-colors"
                title="Instagram Page"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#25D366] transition-colors"
                title="WhatsApp: +91 87783 40454"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-white font-bold mb-4">
              NAVIGATION
            </div>
            <ul className="space-y-2 text-xs font-mono">
              {navItems.map(item => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-cyan-400 transition-colors">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-white font-bold mb-4">
              HEADQUARTERS
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                <span>{c.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-cyan-400 shrink-0" />
                <a href={`mailto:${c.email}`} className="hover:text-white transition-colors">{c.email}</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-cyan-400 shrink-0" />
                <a href={`tel:${(c.phone || '+918778340454').replace(/\s+/g, '')}`} className="hover:text-white transition-colors font-mono">
                  {c.phone || '+91 87783 40454'}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-mono font-semibold">
                  WhatsApp: {c.whatsapp_number || '8778340454'}
                </a>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-500">
          <div>© 2026 M TECHNOVATE SOLUTIONS. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>BUILT FOR SECURE, RESILIENT ENTERPRISE OPERATIONS.</span>
            <Link to="/admin/login" className="inline-flex items-center gap-1 text-slate-600 hover:text-cyan-400 transition-colors">
              <Shield size={11} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------
          GALLERY FULL-SCREEN LIGHTBOX MODAL
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedGallery && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedGallery(null)}>
            <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-white/10 p-6 relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()} data-testid="modal">
              <button 
                onClick={() => setSelectedGallery(null)} 
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/10 z-10"
              >
                <X size={20} />
              </button>

              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {selectedGallery.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mt-1 mb-4">
                {selectedGallery.title}
              </h3>

              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black mb-4">
                <img 
                  src={selectedGallery.image_url || selectedGallery.imageUrl || '/mtechnovate_office_building.jpg'} 
                  alt={selectedGallery.title} 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/mtechnovate_office_building.jpg';
                  }}
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedGallery.description}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          SERVICE DETAIL MODAL
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedService(null)}>
            <div className="w-full max-w-lg p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} data-testid="modal">
              <button 
                onClick={() => setSelectedService(null)} 
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5"
              >
                <X size={18} />
              </button>

              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                CAPABILITY BLUEPRINT {selectedService.number || '01'}
              </span>
              <h3 className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white mt-1">
                {selectedService.title}
              </h3>
              <p className="text-sm font-mono text-slate-500 dark:text-slate-400 italic mt-1">
                “{selectedService.tagline || selectedService.short_desc || 'High-precision operational execution'}”
              </p>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedService.desc || selectedService.short_desc || selectedService.detailed_desc || ''}
              </p>

              <div className="mt-6">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Verified Capabilities:</div>
                <div className="flex flex-wrap gap-2">
                  {(selectedService.capabilities || (Array.isArray(selectedService.tech_tags) ? selectedService.tech_tags : (selectedService.tech_tags ? String(selectedService.tech_tags).split(',').map(t=>t.trim()) : ['Verified Quality SLA', 'SLA Governance']))).map(cap => (
                    <span key={cap} className="text-xs font-mono px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  SLA Target: {selectedService.stat}
                </span>
                <a 
                  href="#Contact" 
                  onClick={(e) => { setSelectedService(null); handleNavClick(e, '#Contact'); }} 
                  className="px-5 py-2 rounded-full text-xs font-bold font-['Outfit'] uppercase bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
                >
                  Inquire Now →
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          JOB APPLICATION MODAL (ATS)
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedJob && (
          <JobModal job={selectedJob} close={() => setSelectedJob(null)} onApplied={loadData} />
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          FLOATING WHATSAPP BUTTON (Quick Contact)
          ------------------------------------------------------------- */}
      <a
        href="https://wa.me/918778340454?text=Hello%20M%20TECHNOVATE%20SOLUTIONS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] text-white shadow-2xl hover:shadow-[#25D366]/50 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer border border-white/20"
        aria-label="Chat with us on WhatsApp"
        title="WhatsApp: +91 87783 40454"
      >
        <div className="relative flex items-center justify-center">
          <WhatsAppIcon className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline font-['Outfit'] font-bold text-xs tracking-wide">
          Chat on WhatsApp
        </span>
      </a>

    </div>
  );
}

// Modal Component for ATS Application
function JobModal({ job, close, onApplied }) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    fd.append('job_id', job.id);
    fd.append('job_title', job.title);
    const linkedinVal = e.currentTarget.linkedin_url?.value || e.currentTarget.linkedin?.value || '';
    fd.append('linkedin_url', linkedinVal);
    fd.append('linkedin', linkedinVal);

    try {
      const res = await api.submitApplication(fd);
      if (res.success) {
        setDone(true);
        if (onApplied) onApplied();
      } else {
        setError(res.message || 'Please check your inputs and try again.');
      }
    } catch (err) {
      setError(err.message || 'Error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={close}>
      <div className="w-full max-w-lg p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} data-testid="modal">
        <button 
          onClick={close} 
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5"
          data-testid="modal-close-button"
        >
          <X size={18} />
        </button>

        {done ? (
          <div className="text-center py-8" data-testid="application-success-message">
            <ShieldCheck size={48} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white">Application Received</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              Thank you for applying to M TECHNOVATE SOLUTIONS. Our Kadayam recruitment team will review your profile.
            </p>
            <button 
              onClick={close} 
              className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold font-['Outfit'] uppercase bg-cyan-500 text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
              KADAYAM CAREERS
            </span>
            <h3 className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white mt-1">
              Apply for {job.title}
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              {job.department} · {job.location} · {job.employment_type}
            </p>

            {error && <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">{error}</div>}

            <form onSubmit={submit} className="mt-6 space-y-4" data-testid="application-form">
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">Full Name</label>
                <input name="full_name" required placeholder="Your full name" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500" data-testid="application-name-input" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">Email</label>
                <input name="email" type="email" required placeholder="your.email@example.com" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500" data-testid="application-email-input" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">Phone Number</label>
                <input name="phone" required placeholder="e.g. +91 87783 40454" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500" data-testid="application-phone-input" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">LinkedIn Profile (Optional)</label>
                <input name="linkedin_url" placeholder="https://linkedin.com/in/username" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500" data-testid="application-linkedin-input" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">Experience Summary</label>
                <textarea name="cover_letter" rows={3} placeholder="Relevant BPO, data entry, typing speed, or customer support background..." className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm resize-none focus:outline-none focus:border-cyan-500" data-testid="application-cover-letter-input" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">Resume (PDF or DOC)</label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-white/20 hover:border-cyan-500 cursor-pointer text-xs text-slate-600 dark:text-slate-300 transition-colors">
                  <Upload size={16} className="text-cyan-500 shrink-0" />
                  <span className={resumeFileName ? "font-semibold text-cyan-600 dark:text-cyan-400 truncate" : "truncate"}>
                    {resumeFileName || 'Choose file (.pdf, .doc, .docx)...'}
                  </span>
                  <input 
                    name="resume" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    required 
                    onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || '')}
                    className="hidden" 
                    data-testid="application-resume-input" 
                  />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-['Outfit'] font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                data-testid="application-submit-button"
              >
                {submitting ? 'Transmitting...' : 'Submit Application'} <ArrowRight size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
