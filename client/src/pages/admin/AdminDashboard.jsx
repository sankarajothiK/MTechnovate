import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Briefcase, Image, Layers, MessageSquare, 
  ArrowRight, CheckCircle2, Clock, AlertTriangle, TrendingUp, Sparkles, Loader2 
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getAdminDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="text-xs font-mono">Aggregating system statistics...</span>
      </div>
    );
  }

  const { stats, statusDistribution, recentApplications, recentJobs } = data || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest font-mono mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>M TECHNOVATE Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white">
            Operations & ATS Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time candidate pipelines, enterprise job vacancies, system registry, and Kadayam delivery telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Review ATS Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Counter Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Applications */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-colors shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Applicants</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-['Outfit'] font-bold text-slate-900 dark:text-white">
            {stats?.totalApplications || 0}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{stats?.newApplications || 0} new</span>
            <span>awaiting evaluation</span>
          </div>
        </div>

        {/* Shortlisted Candidates */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-colors shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Shortlisted (Interviews)</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-['Outfit'] font-bold text-emerald-600 dark:text-emerald-400">
            {stats?.shortlistedApplications || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Automated invitation dispatched
          </div>
        </div>

        {/* Active Jobs */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-colors shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Openings</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-['Outfit'] font-bold text-slate-900 dark:text-white">
            {stats?.activeJobs || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {stats?.totalJobs || 0} total listings created
          </div>
        </div>

        {/* Gallery / Inquiries */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-colors shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Client Inquiries</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-['Outfit'] font-bold text-slate-900 dark:text-white">
            {stats?.unreadMessages || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Unread enterprise messages
          </div>
        </div>

      </div>

      {/* Middle Section: Status Pipeline Breakdown & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Application Pipeline Bars */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Application Status Distribution
            </h3>
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">ATS Telemetry</span>
          </div>

          <div className="space-y-4 pt-2">
            {statusDistribution?.map((item) => {
              const total = stats?.totalApplications || 1;
              const percentage = Math.round((item.count / total) * 100) || 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200 dark:bg-dark-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Dynamic workflow automations active</span>
            <Link to="/admin/applications" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              Manage Candidates →
            </Link>
          </div>
        </div>

        {/* Quick System Status & Storage */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
            System & Storage Registry
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Gallery Uploads</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Directory: /uploads/gallery/</div>
              </div>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{stats?.totalGallery || 0} Assets</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Resume Repository</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Directory: /uploads/resumes/</div>
              </div>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{stats?.totalApplications || 0} CVs</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Services Catalogue</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Dynamic enterprise solutions</div>
              </div>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{stats?.totalServices || 0} Active</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/profile"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>Manage Company Profile & CEO Info</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Applications & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Applications Table */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Recent Candidate Submissions
            </h3>
            <Link to="/admin/applications" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          {!recentApplications || recentApplications.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No recent applications recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800 overflow-x-auto">
              {recentApplications.map((app) => (
                <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{app.full_name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{app.job_title} • <span className="font-mono text-slate-400">{app.email}</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 border-red-300 dark:border-red-800' :
                      app.status === 'Under Review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border-amber-300 dark:border-amber-800' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Job Listings */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Job Vacancies
            </h3>
            <Link to="/admin/jobs" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              Manage
            </Link>
          </div>

          {!recentJobs || recentJobs.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No jobs posted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{job.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{job.department} • {job.employment_type}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    job.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {job.is_active ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
