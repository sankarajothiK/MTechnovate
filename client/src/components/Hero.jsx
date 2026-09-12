import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Lightbulb, Zap, Star, Users, 
  ShieldCheck, Rocket, Trophy, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden aurora-mesh dot-grid-bg">
      
      {/* Luminous Ambient Aurora Glows */}
      <div className="absolute -top-24 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Iridescent Kicker Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-bold shadow-sm shadow-indigo-500/10"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
              </span>
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 dark:from-indigo-400 dark:via-blue-400 dark:to-violet-400 bg-clip-text text-transparent font-extrabold">
                Welcome to M Technovate Solutions
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </motion.div>

            {/* Main Headline with 3-stop Mesh Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-display font-black tracking-tight leading-[1.1] text-slate-950 dark:text-white"
            >
              Innovate Today, <br />
              <span className="mesh-gradient-text">Elevate Tomorrow.</span>
            </motion.h1>

            {/* Description Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal"
            >
              We deliver smart, scalable and innovative digital solutions that help businesses grow and lead in the digital world.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => scrollTo('services')}
                className="btn-gradient-primary group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Our Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
              </button>
            </motion.div>

            {/* Micro Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>99.8% Quality Precision</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>Global Compliance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>24/7 Support</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3D Pedestal Emblem with Iridescent Aura */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg flex items-center justify-center"
            >
              {/* Layered Multi-Color Halo Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 rounded-3xl blur-2xl -z-10" />

              {/* Pedestal Image Box with Iridescent Border */}
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/10 dark:shadow-indigo-950/50 border border-indigo-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900 p-1">
                <img
                  src="/hero_pedestal.png"
                  alt="M Technovate Solutions 3D Emblem"
                  className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-700 rounded-2xl"
                  onError={(e) => {
                    e.target.src = '/hero_showcase.png';
                  }}
                />
              </div>

              {/* Connected Floating Badges with Unique Accent Colors */}
              {/* Top Left: Innovative Solutions (Violet / Indigo) */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -top-4 -left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-violet-100 dark:border-slate-750 shadow-xl shadow-violet-500/10 items-center gap-3 z-20"
              >
                <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800/60">
                  <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Innovative</div>
                  <div className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">Solutions</div>
                </div>
              </motion.div>

              {/* Bottom Left: Scalable Technology (Cyan / Blue) */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-4 -left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-cyan-100 dark:border-slate-750 shadow-xl shadow-cyan-500/10 items-center gap-3 z-20"
              >
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60">
                  <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Scalable</div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">Technology</div>
                </div>
              </motion.div>

              {/* Top Right: Digital Excellence (Warm Amber / Gold) */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -top-3 -right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-amber-100 dark:border-slate-750 shadow-xl shadow-amber-500/10 items-center gap-3 z-20"
              >
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Digital</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Excellence</div>
                </div>
              </motion.div>

              {/* Bottom Right: Client Success (Emerald) */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-3 -right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-emerald-100 dark:border-slate-750 shadow-xl shadow-emerald-500/10 items-center gap-3 z-20"
              >
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Client</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Success</div>
                </div>
              </motion.div>

            </motion.div>

          </div>

        </div>

        {/* Horizontal Stats / Metrics Bar (Multi-Color Bento Card) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 rounded-3xl bento-card p-6 sm:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800">
            
            {/* Metric 1 - Royal Blue */}
            <div className="flex items-center gap-4 px-2 sm:px-4 pt-4 sm:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/60 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-blue-600 dark:text-blue-400 tracking-tight">
                  50+
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Happy Clients
                </div>
              </div>
            </div>

            {/* Metric 2 - Electric Indigo */}
            <div className="flex items-center gap-4 px-2 sm:px-4 pt-4 sm:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/60 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                  100+
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Projects Delivered
                </div>
              </div>
            </div>

            {/* Metric 3 - Vivid Violet */}
            <div className="flex items-center gap-4 px-2 sm:px-4 pt-4 sm:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-100 dark:border-violet-800/60 shadow-xs">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-violet-600 dark:text-violet-400 tracking-tight">
                  5+
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Years of Experience
                </div>
              </div>
            </div>

            {/* Metric 4 - Luminous Gold / Amber */}
            <div className="flex items-center gap-4 px-2 sm:px-4 pt-4 sm:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800/60 shadow-xs">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-amber-500 tracking-tight">
                  98%
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Client Satisfaction
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
