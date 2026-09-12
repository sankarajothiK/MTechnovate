import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Server, Database, Palette, Cpu, Sparkles } from 'lucide-react';

const techCategories = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: Code2,
    skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'HTML5/CSS3']
  },
  {
    id: 'mobile',
    title: 'Mobile Apps',
    icon: Smartphone,
    skills: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'Progressive Web Apps']
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    icon: Server,
    skills: ['Node.js', 'Express', 'Python', 'Java Spring', 'RESTful APIs', 'GraphQL']
  },
  {
    id: 'database',
    title: 'Cloud & Database',
    icon: Database,
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Amazon Web Services', 'Docker', 'Firebase']
  },
  {
    id: 'design',
    title: 'UI/UX Design',
    icon: Palette,
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems', 'User Testing', 'Wireframing']
  }
];

export default function Technologies() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCategories = activeTab === 'all'
    ? techCategories
    : techCategories.filter(c => c.id === activeTab);

  return (
    <section id="technologies" className="relative py-24 bg-slate-50 border-t border-slate-200/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 block">
            OUR TECH STACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1">
            Technologies We Master
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full mx-auto mt-3" />
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            We leverage modern, proven, enterprise-grade frameworks to build reliable, high-performance digital products.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200'
            }`}
          >
            All Technologies
          </button>
          {techCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === c.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-display text-slate-900">{cat.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
