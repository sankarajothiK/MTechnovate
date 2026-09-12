import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Shield, HeartHandshake, Lightbulb, Quote, Globe, Compass, Target, Sparkles, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: Lightbulb,
    title: 'Precision & Quality',
    desc: 'Strict multi-tier QA audits ensuring 99.8%+ accuracy benchmarks across all international projects.',
    color: 'text-amber-500 bg-amber-50 border-amber-200'
  },
  {
    icon: Award,
    title: 'Customer Trust',
    desc: 'Long-term partnerships with overseas commercial enterprises, government archives, and publishers.',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    icon: HeartHandshake,
    title: 'Rural Empowerment',
    desc: 'Creating sustainable, empowering professional employment for educated youth and women in Kadayam.',
    color: 'text-violet-600 bg-violet-50 border-violet-200'
  },
  {
    icon: Zap,
    title: 'Rapid Turnaround',
    desc: 'High-throughput workflows, scalable operator squads, and strict adherence to turnaround SLAs.',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
  },
  {
    icon: Shield,
    title: 'Strict Confidentiality',
    desc: 'Secure data management, ISO-grade handling protocols, and complete client record confidentiality.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  }
];

export default function About({ company }) {
  const ceoPhoto = company?.ceo_photo || '/uploads/company/ceo_ramesh_k.jpg';
  const ceoName = company?.ceo_name || 'RAMESH K';
  const ceoDesignation = company?.ceo_designation || 'Founder & Managing Director';
  const ceoMessage = company?.ceo_message || 'At M TECHNOVATE SOLUTIONS, our mission is to deliver flawless, global-standard data solutions with 99%+ accuracy to international clients, while creating empowering, sustainable career opportunities for skilled youth and women professionals right here in Kadayam.';

  return (
    <section id="about" className="relative py-28 bg-white overflow-hidden border-t border-slate-100">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-violet-100/30 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-blue-100/30 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-bold tracking-wider uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>About M TECHNOVATE SOLUTIONS</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-black text-slate-900 tracking-tight"
          >
            Building Accurate Data Services, <br className="hidden sm:inline" />
            <span className="mesh-gradient-text">Building Brighter Futures</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            {company?.about_text || 'M TECHNOVATE SOLUTIONS is a premier non-IT global data technology, BPO, and document processing enterprise headquartered in Kadayam, Tamil Nadu. We specialize in high-precision data processing, USA documentation & vital records management, handwritten historical document indexing, EPUB conversion, and international back-office support.'}
          </motion.p>
        </div>

        {/* CEO Spotlight Bento Card (Iridescent Framed Photo + Leadership Message) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 rounded-3xl bento-card p-6 sm:p-10 lg:p-12 relative overflow-hidden"
        >
          {/* Subtle colorful top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 via-violet-600 to-cyan-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* CEO Portrait with Multi-Color Glow Halo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group">
                
                {/* Iridescent Aura Ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl blur-md opacity-25 group-hover:opacity-50 transition duration-500" />
                
                {/* Image container */}
                <div className="relative w-64 sm:w-72 h-80 sm:h-96 rounded-2xl overflow-hidden bg-white border-2 border-indigo-100 shadow-2xl">
                  <img
                    src={ceoPhoto}
                    alt={ceoName}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/ceo_ramesh_k.jpg';
                    }}
                  />
                  
                  {/* Name badge overlaid on photo */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-100/90 text-center shadow-lg">
                    <div className="font-display font-black text-slate-900 text-base tracking-wide">
                      {ceoName}
                    </div>
                    <div className="text-xs font-bold text-indigo-600 mt-0.5">
                      {ceoDesignation}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Executive Direction • Kadayam Headquarters</span>
              </div>
            </div>

            {/* CEO Leadership Statement */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                <Quote className="w-3.5 h-3.5 text-indigo-600" />
                <span>Message From Our Managing Director</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-normal text-slate-800 leading-relaxed italic border-l-4 border-indigo-500 pl-4">
                "{ceoMessage}"
              </blockquote>

              <div className="pt-4 border-t border-slate-200/80 space-y-3">
                <div className="text-sm font-bold text-slate-900">
                  Our Institutional Commitments:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>99.8% Quality SLA Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>USA & International Compliance</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Strict Data Confidentiality</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Rural Talent Upliftment in Kadayam</span>
                  </div>
                </div>
              </div>

              {/* Headquartered In */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 flex items-center gap-3">
                <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Headquartered at <strong className="text-slate-900">{company?.address || 'M.G.Complex, Busstand, Kadayam-627 415.'}</strong> Serving global partners across USA, UK, and Australia.
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Vision & Mission Cards with Radiant Color Signatures */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bento-card relative group hover:border-blue-400"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {company?.vision || 'To be an internationally recognized and trusted leader in global data processing, document digitization, and business support solutions, known for precision, reliability, and positive community transformation.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bento-card relative group hover:border-violet-400"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center mb-5 shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {company?.mission || 'To deliver accurate, dependable data and document services that adhere to the highest international quality standards, empowering global businesses with trusted data while uplifting local talent through meaningful professional employment.'}
            </p>
          </motion.div>
        </div>

        {/* Core Pillars Bento Grid */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">Our Core Principles</h3>
            <p className="text-sm text-slate-500 mt-1">Guiding our daily quality verification and client commitments.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="p-6 rounded-3xl bento-card group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-2xl ${pillar.color} border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
