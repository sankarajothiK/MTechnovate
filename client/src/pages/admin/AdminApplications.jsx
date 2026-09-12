import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Download, ExternalLink, Trash2, 
  CheckCircle2, XCircle, Clock, Calendar, Video, MapPin, 
  Mail, Phone, FileText, AlertCircle, Loader2, Sparkles, Send, Eye, X, Building 
} from 'lucide-react';
import { api, applicationService } from '../../services/api';
import { UICalendarPicker, UIClockPicker } from '../../components/admin/DateTimePickers';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Selected applicant for detailed profile view
  const [profileApplicant, setProfileApplicant] = useState(null);

  // Shortlist scheduling modal state
  const [shortlistModalApp, setShortlistModalApp] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    interview_date: '',
    interview_time: '11:00 AM IST',
    interview_mode: 'Online Video Conference',
    interview_meeting_link: 'https://meet.google.com/new',
    interview_notes: 'Please keep your IDE and GitHub repositories ready for technical code walkthrough.'
  });
  const [schedulingSubmitting, setSchedulingSubmitting] = useState(false);

  // Rejection modal state
  const [rejectionModalApp, setRejectionModalApp] = useState(null);
  const [sendRejectionEmail, setSendRejectionEmail] = useState(true);
  const [rejectionSubmitting, setRejectionSubmitting] = useState(false);

  // Selection / Offer modal state
  const [selectionModalApp, setSelectionModalApp] = useState(null);
  const [selectionSchedule, setSelectionSchedule] = useState({
    joining_date: '',
    reporting_time: '09:30 AM IST',
    joining_location: 'M TECHNOVATE Corporate HQ, M.G. Complex, Kadayam',
    onboarding_notes: 'Please carry original academic credentials, government photo ID (Aadhar/PAN), and 2 passport photos.'
  });
  const [sendSelectionEmail, setSendSelectionEmail] = useState(true);
  const [selectionSubmitting, setSelectionSubmitting] = useState(false);

  // Toast / feedback message
  const [feedback, setFeedback] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await api.getApplications({
        status: statusFilter,
        job_id: jobFilter,
        search,
        sort: sortOrder
      });
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.getAdminJobs();
      if (res.success) setJobs(res.data);
    } catch (err) {
      console.error('Error loading jobs for filter:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
    const unsubscribe = applicationService.subscribeApplications((liveApps) => {
      if (Array.isArray(liveApps)) {
        if (statusFilter === 'All' && jobFilter === 'All' && !search) {
          setApplications(liveApps);
          setLoading(false);
        } else {
          fetchApplications();
        }
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [statusFilter, jobFilter, search, sortOrder]);

  // Handle status dropdown change
  const handleStatusChange = (app, newStatus) => {
    if (newStatus === 'Shortlisted') {
      // Open scheduling modal
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = tomorrow.toISOString().split('T')[0];

      setScheduleData({
        interview_date: app.interview_date || defaultDate,
        interview_time: app.interview_time || '11:00 AM IST',
        interview_mode: app.interview_mode || 'Online Video Conference',
        interview_meeting_link: app.interview_meeting_link || 'https://meet.google.com/m-technovate-interview',
        interview_notes: app.interview_notes || 'Technical interview & architecture discussion.'
      });
      setShortlistModalApp(app);
    } else if (newStatus === 'Selected') {
      // Open offer modal with default joining schedule
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const defaultJoining = nextWeek.toISOString().split('T')[0];

      setSelectionSchedule({
        joining_date: app.joining_date || defaultJoining,
        reporting_time: app.reporting_time || '09:30 AM IST',
        joining_location: app.joining_location || 'M TECHNOVATE Corporate HQ, M.G. Complex, Kadayam',
        onboarding_notes: app.onboarding_notes || 'Please carry original academic credentials, government photo ID (Aadhar/PAN), and 2 passport photos.'
      });
      setSelectionModalApp(app);
      setSendSelectionEmail(true);
    } else if (newStatus === 'Rejected') {
      // Open rejection modal with email option
      setRejectionModalApp(app);
    } else {
      // New or Under Review
      updateStatusDirect(app.id, newStatus);
    }
  };

  const updateStatusDirect = async (id, status) => {
    try {
      const res = await api.updateApplicationStatus(id, { status });
      if (res.success) {
        setFeedback({ type: 'success', text: `Status updated to "${status}".` });
        fetchApplications();
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update status.' });
    }
  };

  // Submit Shortlist & Interview Schedule
  const handleConfirmShortlist = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!scheduleData.interview_date || !scheduleData.interview_time) {
      alert('Please select both Interview Date and Interview Time.');
      return;
    }

    setSchedulingSubmitting(true);
    try {
      const res = await api.updateApplicationStatus(shortlistModalApp.id, {
        status: 'Shortlisted',
        ...scheduleData
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Candidate successfully shortlisted! Interview scheduled for ${scheduleData.interview_date} at ${scheduleData.interview_time} & invitation email dispatched to ${shortlistModalApp.email}.`
        });
        setShortlistModalApp(null);
        fetchApplications();
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err) {
      alert(err.message || 'Failed to confirm interview schedule.');
    } finally {
      setSchedulingSubmitting(false);
    }
  };

  // Submit Selection & Formal Offer
  const handleConfirmSelection = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectionSchedule.joining_date || !selectionSchedule.reporting_time) {
      alert('Please select both Joining Date and Reporting Time.');
      return;
    }

    setSelectionSubmitting(true);
    try {
      const res = await api.updateApplicationStatus(selectionModalApp.id, {
        status: 'Selected',
        send_selection_email: sendSelectionEmail,
        ...selectionSchedule
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Candidate successfully marked as Selected! Joining set for ${selectionSchedule.joining_date} at ${selectionSchedule.reporting_time}.${sendSelectionEmail ? ` Formal offer email dispatched to ${selectionModalApp.email}.` : ''}`
        });
        setSelectionModalApp(null);
        fetchApplications();
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update selection status.');
    } finally {
      setSelectionSubmitting(false);
    }
  };

  // Submit Rejection
  const handleConfirmRejection = async () => {
    setRejectionSubmitting(true);
    try {
      const res = await api.updateApplicationStatus(rejectionModalApp.id, {
        status: 'Rejected',
        send_rejection_email: sendRejectionEmail
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Candidate marked as Rejected.${sendRejectionEmail ? ` Notification email sent to ${rejectionModalApp.email}.` : ''}`
        });
        setRejectionModalApp(null);
        fetchApplications();
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update rejection.');
    } finally {
      setRejectionSubmitting(false);
    }
  };

  // Delete Application
  const handleDeleteApp = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the application of "${name}"?`)) {
      try {
        const res = await api.deleteApplication(id);
        if (res.success) {
          setFeedback({ type: 'success', text: 'Application removed successfully.' });
          fetchApplications();
          setTimeout(() => setFeedback(null), 4000);
        }
      } catch (err) {
        alert(err.message || 'Delete failed.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-medium border ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Application Tracking System (ATS)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-brand-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold">
              {applications.length} Applicants
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Review candidate profiles, evaluate resumes, schedule technical interviews, and automate branded communications.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-sm dark:shadow-xl">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidate name, email, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Job Filter */}
        <div>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          >
            <option value="All">All Job Positions</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

      </div>

      {/* Applications Table / Cards */}
      <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-2xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Fetching ATS data...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No applications found</h4>
            <p className="text-xs text-slate-500">No candidate submissions match the selected filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile Candidate Cards (< md) */}
            <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800/80">
              {applications.map((app) => (
                <div key={app.id} className="p-4 space-y-3 bg-white/50 dark:bg-dark-900/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{app.full_name}</div>
                      <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
                        {app.job_title || app.position || 'Applied Vacancy'}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {app.applied_at ? app.applied_at.substring(0, 10) : (app.createdAt?.seconds ? new Date(app.createdAt.seconds * 1000).toISOString().substring(0, 10) : 'Recent')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setProfileApplicant(app)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-cyan-500"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteApp(app.id, app.full_name)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-red-500"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Chips */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <a href={`mailto:${app.email}`} className="flex items-center gap-1 hover:text-cyan-500">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[180px]">{app.email}</span>
                    </a>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <a href={`tel:${app.phone}`} className="flex items-center gap-1 hover:text-cyan-500">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{app.phone}</span>
                    </a>
                  </div>

                  {/* Status Dropdown & Resume Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border ${
                          app.status === 'Selected' ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                          app.status === 'Shortlisted' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                          app.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                          app.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                          'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <option value="New" className="bg-white dark:bg-dark-900 text-blue-600 dark:text-blue-400">New</option>
                        <option value="Under Review" className="bg-white dark:bg-dark-900 text-amber-600 dark:text-amber-400">Under Review</option>
                        <option value="Shortlisted" className="bg-white dark:bg-dark-900 text-emerald-600 dark:text-emerald-400">Shortlisted</option>
                        <option value="Selected" className="bg-white dark:bg-dark-900 text-purple-600 dark:text-purple-400">Selected</option>
                        <option value="Rejected" className="bg-white dark:bg-dark-900 text-red-600 dark:text-red-400">Rejected</option>
                      </select>
                    </div>

                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 font-mono text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </a>
                    )}
                  </div>

                  {/* Interview Schedule Details (if Shortlisted) */}
                  {app.status === 'Shortlisted' && app.interview_date && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono flex flex-wrap items-center gap-3 text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        <span>{app.interview_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        <span>{app.interview_time}</span>
                      </div>
                      {app.interview_meeting_link && (
                        <a
                          href={app.interview_meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-600 dark:text-cyan-400 underline flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Meet</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Joining Offer Details (if Selected) */}
                  {app.status === 'Selected' && app.joining_date && (
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono flex flex-wrap items-center gap-3 text-purple-700 dark:text-purple-300">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>Joining: {app.joining_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-500" />
                        <span>{app.reporting_time || '09:30 AM'}</span>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Desktop Candidate Table (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-dark-950/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Role Applied</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Resume</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4">Interview Schedule</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                      
                      {/* Applicant Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{app.full_name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{app.email}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{app.phone}</div>
                      </td>

                      {/* Applied Position */}
                      <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {app.job_title || app.position || 'Applied Vacancy'}
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        {app.applied_at ? app.applied_at.substring(0, 10) : (app.createdAt?.seconds ? new Date(app.createdAt.seconds * 1000).toISOString().substring(0, 10) : 'Recent')}
                      </td>

                      {/* Resume download */}
                      <td className="py-4 px-4">
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 hover:text-cyan-900 dark:hover:text-cyan-300 transition-colors font-mono text-[11px]"
                            title={app.resume_filename || 'Download Resume'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Resume</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 font-mono">No File</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border ${
                            app.status === 'Selected' ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                            app.status === 'Shortlisted' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                            app.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                            app.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                            'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          <option value="New" className="bg-white dark:bg-dark-900 text-blue-600 dark:text-blue-400">New</option>
                          <option value="Under Review" className="bg-white dark:bg-dark-900 text-amber-600 dark:text-amber-400">Under Review</option>
                          <option value="Shortlisted" className="bg-white dark:bg-dark-900 text-emerald-600 dark:text-emerald-400">Shortlisted (Schedule)</option>
                          <option value="Selected" className="bg-white dark:bg-dark-900 text-purple-600 dark:text-purple-400">Selected (Formal Offer)</option>
                          <option value="Rejected" className="bg-white dark:bg-dark-900 text-red-600 dark:text-red-400">Rejected</option>
                        </select>
                      </td>

                      {/* Interview Schedule Details */}
                      <td className="py-4 px-4">
                        {app.status === 'Shortlisted' && app.interview_date ? (
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{app.interview_date}</span>
                            </div>
                            <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                              <span>{app.interview_time}</span>
                            </div>
                            {app.interview_meeting_link && (
                              <a
                                href={app.interview_meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-[150px]"
                              >
                                <Video className="w-3 h-3" />
                                <span className="truncate">Meeting Link</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setProfileApplicant(app)}
                            className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 transition-colors shadow-xs"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteApp(app.id, app.full_name)}
                            className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-red-500 hover:border-red-500/50 transition-colors shadow-xs"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* MODAL 1: Shortlisted Interview Scheduling */}
      {shortlistModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShortlistModalApp(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Candidate Shortlisting
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Schedule Interview
                </h3>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div><strong>Applicant:</strong> {shortlistModalApp.full_name}</div>
              <div><strong>Role:</strong> {shortlistModalApp.job_title}</div>
              <div><strong>Email:</strong> <span className="font-mono text-cyan-600 dark:text-cyan-400">{shortlistModalApp.email}</span></div>
            </div>

            <form onSubmit={handleConfirmShortlist} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UICalendarPicker
                  label="Interview Date"
                  required
                  value={scheduleData.interview_date}
                  onChange={(dateStr) => setScheduleData(prev => ({ ...prev, interview_date: dateStr }))}
                  accentColor="emerald"
                />

                <UIClockPicker
                  label="Interview Time"
                  required
                  value={scheduleData.interview_time}
                  onChange={(timeStr) => setScheduleData(prev => ({ ...prev, interview_time: timeStr }))}
                  accentColor="emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Mode
                </label>
                <select
                  value={scheduleData.interview_mode}
                  onChange={(e) => setScheduleData({ ...scheduleData, interview_mode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Online Video Conference">Online Video Conference (Google Meet / Zoom)</option>
                  <option value="Offline / At Kadayam HQ">Offline / At Kadayam Corporate HQ</option>
                  <option value="Telephone Screening">Telephone Screening</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Meeting Link (for Online)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz"
                  value={scheduleData.interview_meeting_link}
                  onChange={(e) => setScheduleData({ ...scheduleData, interview_meeting_link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preparation Notes / Agenda
                </label>
                <textarea
                  rows="2"
                  value={scheduleData.interview_notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, interview_notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40 text-[11px] text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                <Send className="w-4 h-4 shrink-0 text-cyan-500" />
                <span>Confirming will immediately trigger an automated branded interview invitation email to {shortlistModalApp.email}.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShortlistModalApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all"
                >
                  {schedulingSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling & Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: Rejection Confirmation with Optional Email */}
      {rejectionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Mark Application as Rejected
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Candidate: {rejectionModalApp.full_name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to mark this applicant as <strong className="text-red-600 dark:text-red-400">Rejected</strong>?
            </p>

            {/* Checkbox: Send Rejection Email */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendRejectionEmail}
                  onChange={(e) => setSendRejectionEmail(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">Send Professional Rejection Email</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Dispatches polite, branded notice thanking candidate and keeping resume on file.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                disabled={rejectionSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 disabled:opacity-50 transition-all"
              >
                {rejectionSubmitting ? 'Updating...' : 'Confirm Rejection'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: Candidate Selection & Formal Offer */}
      {selectionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectionModalApp(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  Candidate Selection
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Formal Offer & Joining Schedule
                </h3>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div><strong>Applicant:</strong> {selectionModalApp.full_name}</div>
              <div><strong>Role:</strong> {selectionModalApp.job_title}</div>
              <div><strong>Email:</strong> <span className="font-mono text-purple-600 dark:text-purple-400">{selectionModalApp.email}</span></div>
            </div>

            <form onSubmit={handleConfirmSelection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UICalendarPicker
                  label="Joining / Start Date"
                  required
                  value={selectionSchedule.joining_date}
                  onChange={(dateStr) => setSelectionSchedule(prev => ({ ...prev, joining_date: dateStr }))}
                  accentColor="purple"
                />

                <UIClockPicker
                  label="Reporting Time"
                  required
                  value={selectionSchedule.reporting_time}
                  onChange={(timeStr) => setSelectionSchedule(prev => ({ ...prev, reporting_time: timeStr }))}
                  accentColor="purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reporting Venue / Joining Location
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={selectionSchedule.joining_location}
                    onChange={(e) => setSelectionSchedule({ ...selectionSchedule, joining_location: e.target.value })}
                    placeholder="e.g. M TECHNOVATE Corporate HQ, M.G. Complex, Kadayam"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Onboarding Notes & Instructions
                </label>
                <textarea
                  rows="2"
                  value={selectionSchedule.onboarding_notes}
                  onChange={(e) => setSelectionSchedule({ ...selectionSchedule, onboarding_notes: e.target.value })}
                  placeholder="e.g. Please carry original educational certificates, government photo ID, and bank details."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Checkbox: Send Offer Email */}
              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendSelectionEmail}
                    onChange={(e) => setSendSelectionEmail(e.target.checked)}
                    className="mt-0.5 rounded border-purple-300 dark:border-purple-700 text-purple-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-purple-900 dark:text-purple-300">Send Official Offer & Welcome Email</span>
                    <p className="text-purple-700/80 dark:text-purple-400 text-[11px] mt-0.5">
                      Dispatches celebratory offer letter email containing the selected role, joining date, reporting time, venue, and onboarding instructions to {selectionModalApp.email}.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectionModalApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectionSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all"
                >
                  {selectionSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Offer & Email...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Selection & Send Offer</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: Detailed Applicant Profile */}
      {profileApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            <button
              onClick={() => setProfileApplicant(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/30 flex items-center justify-center font-display text-2xl font-bold">
                {profileApplicant.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {profileApplicant.full_name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Applied for: <span className="text-cyan-600 dark:text-cyan-300 font-semibold">{profileApplicant.job_title}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Email Address</span>
                <a href={`mailto:${profileApplicant.email}`} className="text-slate-900 dark:text-white font-mono hover:text-cyan-500 dark:hover:text-cyan-400">
                  {profileApplicant.email}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Phone Number</span>
                <span className="text-slate-900 dark:text-white font-mono">{profileApplicant.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Current Status</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{profileApplicant.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Application Timestamp</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">{profileApplicant.applied_at}</span>
              </div>
            </div>

            {/* Links */}
            {(profileApplicant.linkedin_url || profileApplicant.portfolio_url) && (
              <div className="space-y-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">Professional Profiles</span>
                <div className="flex flex-wrap gap-3">
                  {profileApplicant.linkedin_url && (
                    <a
                      href={profileApplicant.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center gap-1.5 font-medium"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profileApplicant.portfolio_url && (
                    <a
                      href={profileApplicant.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 flex items-center gap-1.5 font-medium"
                    >
                      <span>Portfolio Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {profileApplicant.skills && (
              <div className="space-y-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">Candidate Skills</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-dark-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {profileApplicant.skills}
                </p>
              </div>
            )}

            {/* Cover Letter */}
            {profileApplicant.cover_letter && (
              <div className="space-y-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">Cover Letter / Statement</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-dark-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                  {profileApplicant.cover_letter}
                </p>
              </div>
            )}

            {/* Resume Button */}
            {profileApplicant.resume_url && (
              <div className="pt-2 flex items-center justify-between">
                <a
                  href={profileApplicant.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-lg shadow-brand-500/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Preview Resume</span>
                </a>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
