import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Layers, Archive, BookOpen, Headphones, 
  Cloud, Code2, Activity, ShieldCheck, X, ArrowRight, Sparkles 
} from 'lucide-react';

const serviceThemes = [
  {
    icon: FileText,
    accent: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-blue-400',
    tagBg: 'bg-blue-50/60 text-blue-800'
  },
  {
    icon: Layers,
    accent: 'from-indigo-600 to-violet-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-indigo-400',
    tagBg: 'bg-indigo-50/60 text-indigo-800'
  },
  {
    icon: Archive,
    accent: 'from-violet-600 to-purple-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-violet-400',
    tagBg: 'bg-violet-50/60 text-violet-800'
  },
  {
    icon: BookOpen,
    accent: 'from-cyan-600 to-blue-600',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-cyan-400',
    tagBg: 'bg-cyan-50/60 text-cyan-800'
  },
  {
    icon: Headphones,
    accent: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-emerald-400',
    tagBg: 'bg-emerald-50/60 text-emerald-800'
  },
  {
    icon: Cloud,
    accent: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-amber-400',
    tagBg: 'bg-amber-50/60 text-amber-800'
  },
  {
    icon: Code2,
    accent: 'from-purple-600 to-pink-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-purple-400',
    tagBg: 'bg-purple-50/60 text-purple-800'
  },
  {
    icon: Activity,
    accent: 'from-rose-600 to-red-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
    hoverBorder: 'group-hover:border-rose-400',
    tagBg: 'bg-rose-50/60 text-rose-800'
  }
];

export default function Services({ services = [] }) {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" className="relative py-28 bg-slate-50/60 aurora-mesh border-t border-slate-200/80">
      
      {/* Background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>OUR GLOBAL DATA EXPERTISE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
            Tailored Data Services <br className="hidden sm:inline" />
            <span className="mesh-gradient-text">for Every Global Need</span>
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-base text-slate-600 max-w-2xl leading-relaxed">
            Providing end-to-end data services with accuracy and efficiency—from vital records processing and document indexing to international voice workflows.
          </p>
        </div>

        {/* Dynamic Services Bento Grid with Unique Color Palettes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {services.map((service, idx) => {
            const theme = serviceThemes[idx % serviceThemes.length];
            const IconComponent = theme.icon;

            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedService(service)}
                className={`group cursor-pointer p-7 rounded-3xl bento-card ${theme.hoverBorder} flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Subtle top color highlight bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  {/* Glowing Category Icon */}
                  <div className={`w-13 h-13 p-3.5 rounded-2xl ${theme.iconBg} flex items-center justify-center transition-all duration-300 shadow-xs`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-indigo-600 transition-colors mt-5 leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {service.short_desc}
                  </p>

                  {/* Category Tags with Micro Pills */}
                  {service.tech_tags && service.tech_tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.tech_tags.slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${theme.tagBg} border border-slate-200/60`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Learn More link with animated arrow */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  <span>Explore Workflow</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-13 h-13 p-3 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 font-bold">Service Blueprint</span>
                  <h3 className="text-2xl font-bold font-display text-slate-900">{selectedService.title}</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Service Overview</h4>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">{selectedService.short_desc}</p>
                </div>

                {selectedService.detailed_desc && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Operational Scope & Standards</h4>
                    <p className="mt-1 text-sm text-slate-700 leading-relaxed">{selectedService.detailed_desc}</p>
                  </div>
                )}

                {selectedService.tech_tags && selectedService.tech_tags.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Specializations & Tags</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedService.tech_tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <a
                  href="#contact"
                  onClick={() => {
                    setSelectedService(null);
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-gradient-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-colors"
                >
                  Inquire For Project
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
