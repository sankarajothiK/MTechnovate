import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Shield, Activity, Radio, Cpu } from 'lucide-react';

const hubs = [
  { id: 'na', name: 'NORTH AMERICA', label: 'USA DOCUMENTATION & RECORDS', x: 22, y: 35, latency: '42ms', load: '99.9%' },
  { id: 'eu', name: 'EUROPE & UK', label: 'MULTILINGUAL & EPUB CONVERSION', x: 48, y: 30, latency: '68ms', load: '99.8%' },
  { id: 'ap', name: 'ASIA PACIFIC (KADAYAM HQ)', label: 'PRIMARY GLOBAL DELIVERY HUB', x: 72, y: 55, latency: '12ms', load: '100%' },
  { id: 'au', name: 'AUSTRALASIA', label: 'LEAD EXTRACTION & RESEARCH', x: 86, y: 75, latency: '84ms', load: '99.7%' },
  { id: 'me', name: 'MIDDLE EAST & LATAM', label: 'TRANSCRIPTION & BACK-OFFICE', x: 38, y: 68, latency: '92ms', load: '99.6%' }
];

export default function GlobalOperationsNetwork() {
  const [selectedHub, setSelectedHub] = useState(hubs[2]);

  return (
    <section className="relative py-28 px-6 md:px-16 overflow-hidden bg-slate-950 border-t border-white/10">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Radio size={12} className="animate-pulse text-cyan-400" />
            SYNCHRONIZED TELEMETRY
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-white leading-tight">
            CONNECTED TO YOUR BUSINESS.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              WHEREVER BUSINESS HAPPENS.
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Our Kadayam operations core bridges critical timezones with resilient infrastructure, engineered to deliver round-the-clock operational continuity for global business operations starting in 2026.
          </p>
        </div>

        {/* Generative Abstract Constellation Canvas (No flat map images) */}
        <div className="relative w-full aspect-[16/9] max-h-[500px] rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 overflow-hidden flex items-center justify-center">
          
          {/* Subtle Grid Coordinates */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* SVG Animated Connection Arcs */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connecting arcs from Kadayam (72, 55) to other nodes */}
            <path d="M 72 55 Q 47 20 22 35" stroke="url(#arcGlow)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" strokeDasharray="6,6" className="animate-dash" opacity="0.6" />
            <path d="M 72 55 Q 60 35 48 30" stroke="url(#arcGlow)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" strokeDasharray="6,6" opacity="0.7" />
            <path d="M 72 55 Q 79 65 86 75" stroke="url(#arcGlow)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" strokeDasharray="6,6" opacity="0.6" />
            <path d="M 72 55 Q 55 62 38 68" stroke="url(#arcGlow)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" strokeDasharray="6,6" opacity="0.5" />
          </svg>

          {/* Glowing Interactive Hub Nodes */}
          {hubs.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isHQ = hub.id === 'ap';

            return (
              <div
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                {/* Radar Ring */}
                <div 
                  className={`absolute -inset-3 rounded-full transition-all duration-500 ${
                    isSelected ? 'bg-cyan-500/20 border border-cyan-400 animate-ping' : 'opacity-0 group-hover:opacity-100 bg-white/10'
                  }`} 
                />

                {/* Core Dot */}
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-125 ${
                    isHQ 
                      ? 'bg-cyan-400 border-white shadow-[0_0_20px_#00f0ff]' 
                      : isSelected 
                        ? 'bg-violet-500 border-cyan-300 shadow-[0_0_15px_#8b5cf6]' 
                        : 'bg-slate-800 border-white/40'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Micro Label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 tracking-wider">
                  {hub.name}
                </div>
              </div>
            );
          })}

          {/* Active Node Detail Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 p-4 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl z-30 flex items-center justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
                  {selectedHub.name}
                </span>
              </div>
              <div className="text-xs text-white font-semibold mt-1">
                {selectedHub.label}
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-4">
              <div className="text-[10px] font-mono text-slate-400">LATENCY</div>
              <div className="text-sm font-bold font-mono text-emerald-400">{selectedHub.latency}</div>
            </div>
          </div>

        </div>

        {/* 5 Bottom Capability Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
          {[
            'CUSTOMER SUPPORT',
            'DATA OPERATIONS',
            'BACK OFFICE',
            'QUALITY CONTROL',
            'DIGITAL SERVICES'
          ].map((tag, idx) => (
            <div 
              key={tag}
              className="px-4 py-3 rounded-xl border border-white/5 bg-slate-900/30 text-center font-mono text-xs text-slate-300 tracking-wider flex items-center justify-center gap-2 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {tag}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
