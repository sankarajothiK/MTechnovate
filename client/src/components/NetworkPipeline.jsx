import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Cpu, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const stages = [
  {
    id: 'CONNECT',
    title: 'CONNECT',
    subtitle: 'Unified System Ingestion',
    desc: 'Secure multi-channel data integration across enterprise ERP, CRM, and voice endpoints.',
    icon: Share2,
    color: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.4)',
    stat: '100% Secure Endpoints'
  },
  {
    id: 'PROCESS',
    title: 'PROCESS',
    subtitle: 'Intelligent Orchestration',
    desc: 'High-throughput execution leveraging specialized validation algorithms and expert verification.',
    icon: Cpu,
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.4)',
    stat: '99.8% Record Accuracy'
  },
  {
    id: 'OPTIMIZE',
    title: 'OPTIMIZE',
    subtitle: 'Real-time Workflow Enhancement',
    desc: 'Automated bottleneck detection, adaptive routing, and continuous cycle-time reduction.',
    icon: Zap,
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    stat: '45% Cost Reduction'
  },
  {
    id: 'DELIVER',
    title: 'DELIVER',
    subtitle: 'Enterprise-grade SLA Fulfillment',
    desc: 'Guaranteed 24/7 turnaround with verified audit trails and multi-tiered executive reporting.',
    icon: CheckCircle2,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    stat: '99.9% SLA Adherence'
  }
];

export default function NetworkPipeline() {
  const [activeStage, setActiveStage] = useState(0);

  // Auto-cycle through the network stages
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage(prev => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = stages[activeStage];

  return (
    <section className="relative py-28 px-6 md:px-16 overflow-hidden border-y border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700"
        style={{ background: current.glow }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            OPERATIONAL ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-white">
            THE DIGITAL <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">FLOW MATRIX</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            A continuous, intelligent loop transforming raw business friction into structured enterprise momentum.
          </p>
        </div>

        {/* Pipeline Navigation Track */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx === activeStage;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`relative text-left p-5 rounded-2xl border transition-all duration-500 group ${
                  isActive 
                    ? 'bg-slate-900/90 border-cyan-500/60 shadow-[0_0_30px_rgba(0,240,255,0.2)]' 
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20 hover:bg-slate-900/40'
                }`}
              >
                {/* Active Indicator Top Light */}
                {isActive && (
                  <motion.div 
                    layoutId="activePipelineGlow"
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                    style={{ background: stage.color, boxShadow: `0 0 12px ${stage.color}` }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ 
                      background: isActive ? `${stage.color}22` : 'rgba(255,255,255,0.05)',
                      color: stage.color,
                      border: `1px solid ${isActive ? stage.color : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="font-mono text-xs text-slate-500">0{idx + 1}</span>
                </div>

                <div className="font-['Outfit'] font-bold text-sm text-white tracking-wider">
                  {stage.title}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">
                  {stage.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Stage Inspection Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="p-8 md:p-12 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Luminous laser line running across */}
            <div 
              className="absolute top-0 left-0 h-1 w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${current.color}, transparent)` }}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider"
                    style={{ background: `${current.color}15`, color: current.color, border: `1px solid ${current.color}40` }}
                  >
                    PHASE 0{activeStage + 1}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">AUTOMATED INTELLIGENCE PIPELINE</span>
                </div>

                <h3 className="text-2xl md:text-4xl font-extrabold font-['Outfit'] text-white mt-1">
                  {current.title} — <span style={{ color: current.color }}>{current.subtitle}</span>
                </h3>

                <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                  {current.desc}
                </p>

                <div className="flex flex-wrap items-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                    Enterprise Encryption
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                    Continuous Audit Trails
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                    Human Verification
                  </div>
                </div>
              </div>

              {/* Stat Pill */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Target Telemetry
                </span>
                <span 
                  className="text-3xl md:text-4xl font-black font-['Outfit'] tracking-tight"
                  style={{ color: current.color }}
                >
                  {current.stat}
                </span>
                <span className="text-xs text-slate-400 mt-2">
                  Verified across Kadayam Operations Hub
                </span>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
