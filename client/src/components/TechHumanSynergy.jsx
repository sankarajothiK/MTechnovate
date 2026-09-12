import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, UserCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function TechHumanSynergy() {
  const [hoveredPillar, setHoveredPillar] = useState(null);

  const formula = [
    {
      id: 'automation',
      title: 'Automation',
      badge: 'SPEED & SCALE',
      icon: Bot,
      color: '#00f0ff',
      desc: 'Algorithmic data routing, automated validation, and continuous batch ingestion eliminate repetitive latency.'
    },
    {
      id: 'intelligence',
      title: 'Intelligence',
      badge: 'ADAPTIVE LOGIC',
      icon: Sparkles,
      color: '#8b5cf6',
      desc: 'Predictive quality scoring, automated discrepancy flagging, and contextual classification engines.'
    },
    {
      id: 'human',
      title: 'Human Expertise',
      badge: 'EMPATHY & PRECISION',
      icon: UserCheck,
      color: '#ec4899',
      desc: 'High-touch decision making, nuanced historical deciphering, and compassionate customer rapport from Kadayam talent.'
    }
  ];

  return (
    <section className="relative py-28 px-6 md:px-16 overflow-hidden bg-slate-950/90 border-t border-white/10">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            OPERATIONAL PHILOSOPHY
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-white leading-tight">
            SMART TECHNOLOGY.<br />
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              REAL HUMAN CONNECTION.
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            We reject the false trade-off between blind automation and manual fatigue. Our model synergizes machine velocity with human discernment.
          </p>
        </div>

        {/* The Operational Formula Equation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* 3 Pillars (Automation + Intelligence + Human Expertise) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {formula.map((item, idx) => {
              const Icon = item.icon;
              const isHovered = hoveredPillar === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredPillar(item.id)}
                  onMouseLeave={() => setHoveredPillar(null)}
                  className={`p-6 rounded-2xl border transition-all duration-300 relative group ${
                    isHovered 
                      ? 'bg-slate-900 border-cyan-400/60 shadow-[0_0_25px_rgba(0,240,255,0.15)] -translate-y-1' 
                      : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}40` }}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      STEP 0{idx + 1}
                    </span>
                  </div>

                  <span 
                    className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded"
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-bold font-['Outfit'] text-white mt-3 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Equals Symbol Divider */}
          <div className="lg:col-span-4 flex flex-col justify-center p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle size={14} /> RESULTING PARADIGM
            </div>

            <div className="text-2xl md:text-3xl font-extrabold font-['Outfit'] text-white leading-tight">
              BETTER BUSINESS<br />
              <span className="text-cyan-400">AT ENTERPRISE SCALE</span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Achieve 99.8% precision with 40%+ cost reduction, uninterrupted business continuity, and scalable capacity on demand.
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">QUALITY INDEX</span>
              <span className="text-emerald-400 font-bold">99.8% VERIFIED</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
