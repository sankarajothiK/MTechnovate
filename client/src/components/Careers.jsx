import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, MapPin, Clock, Calendar, ChevronDown, ChevronUp, 
  ArrowRight, Sparkles, Search, CheckCircle2 
} from 'lucide-react';
import JobApplicationModal from './JobApplicationModal';

export default function Careers({ jobs = [], onApplicationSubmitted }) {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);

  const departments = ['All', ...new Set(jobs.map(j => j.department).filter(Boolean))];

  const filteredJobs = jobs.filter(job => {
    const matchesDept = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills && job.skills.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <section id="careers" className="relative py-28 bg-slate-50/70 aurora-mesh border-t border-slate-200/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>CAREERS AT M TECHNOVATE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
            Build a Meaningful Career. <br className="hidden sm:inline" />
            <span className="mesh-gradient-text">Right Here in Kadayam.</span>
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full mx-auto mt-4" />
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join our growing team of data specialists, quality auditors, international voice associates, and publishing editors working on global client projects.
          </p>
        </div>

        {/* Filter and Search Bento Bar */}
        <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bento-card">
          
          {/* Department Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedDepartment === dept
                    ? 'btn-gradient-primary shadow-sm'
                    : 'bg-white/80 text-slate-600 hover:text-indigo-600 hover:bg-white border border-slate-200/80'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search roles or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs"
            />
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="mt-12 text-center py-20 rounded-3xl bento-card max-w-lg mx-auto">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No current openings found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try clearing your search query or department filter.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <motion.div
                  key={job.id}
                  layout
                  className="rounded-3xl bento-card overflow-hidden hover:border-indigo-300 transition-all duration-300"
                >
                  {/* Job Card Header */}
                  <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {job.department}
                        </span>
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {job.employment_type}
                        </span>
                        {job.salary_range && (
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {job.salary_range}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Exp: {job.experience}</span>
                        </div>
                        {job.deadline && (
                          <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Deadline: {job.deadline}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleExpand(job.id)}
                        className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>{isExpanded ? 'Less Info' : 'View Details'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setApplyingJob(job)}
                        className="btn-gradient-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Expanded Details Accordion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-200/80 bg-slate-50/70 p-6 sm:p-8 space-y-6"
                      >
                        <div>
                          <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-700 font-bold mb-2">
                            Job Role Description
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        {job.skills && (
                          <div>
                            <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-700 font-bold mb-2">
                              Required Skills & Competencies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.split(',').map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-3 py-1 rounded-xl text-xs font-mono font-medium bg-white text-slate-800 border border-slate-200 shadow-xs"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {job.responsibilities && job.responsibilities.length > 0 && (
                            <div>
                              <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-700 font-bold mb-2">
                                Daily Responsibilities
                              </h4>
                              <ul className="space-y-2 text-xs text-slate-700">
                                {job.responsibilities.map((r, rIdx) => (
                                  <li key={rIdx} className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold mt-0.5">•</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.requirements && job.requirements.length > 0 && (
                            <div>
                              <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-700 font-bold mb-2">
                                Candidate Qualifications
                              </h4>
                              <ul className="space-y-2 text-xs text-slate-700">
                                {job.requirements.map((req, reqIdx) => (
                                  <li key={reqIdx} className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold mt-0.5">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-mono">
                            Posted: {job.posted_date}
                          </span>
                          <button
                            onClick={() => setApplyingJob(job)}
                            className="btn-gradient-primary inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold shadow-sm"
                          >
                            <span>Apply for this position</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      <AnimatePresence>
        {applyingJob && (
          <JobApplicationModal
            job={applyingJob}
            onClose={() => setApplyingJob(null)}
            onSuccess={() => {
              if (onApplicationSubmitted) onApplicationSubmitted();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
