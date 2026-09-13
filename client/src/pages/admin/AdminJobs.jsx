import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Edit, Trash2, Eye, EyeOff, MapPin, 
  Clock, DollarSign, Calendar, AlertCircle, CheckCircle2, Loader2, X 
} from 'lucide-react';
import { api } from '../../services/api';
import { jobService } from '../../services/jobService';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Kadayam / Hybrid',
    employment_type: 'Full Time',
    experience: '2–4 Years',
    salary_range: '',
    skills: '',
    description: '',
    responsibilities: '',
    requirements: '',
    deadline: '',
    is_active: true
  });

  const fetchJobs = async () => {
    try {
      const res = await api.getAdminJobs();
      if (res.success) setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const unsub = jobService.subscribeJobs?.((liveJobs) => {
      if (Array.isArray(liveJobs)) {
        setJobs(liveJobs);
        setLoading(false);
      }
    }, false);
    return () => unsub?.();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'Kadayam / Hybrid',
      employment_type: 'Full Time',
      experience: '2–4 Years',
      salary_range: '₹10,00,000 – ₹16,00,000 / yr',
      skills: 'React, Node.js, TypeScript, PostgreSQL',
      description: 'We are seeking an experienced engineer to architect and build next-generation distributed systems.',
      responsibilities: 'Design robust microservices.\nLead feature development sprints.\nCollaborate across engineering squads.',
      requirements: '3+ years experience with modern web architecture.\nStrong problem solving and CS fundamentals.',
      deadline: '2026-11-30',
      is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employment_type: job.employment_type,
      experience: job.experience,
      salary_range: job.salary_range || '',
      skills: job.skills || '',
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : (job.responsibilities || ''),
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
      deadline: job.deadline || '',
      is_active: job.is_active === 1
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
        requirements: formData.requirements.split('\n').filter(r => r.trim())
      };

      if (editingJob) {
        await api.updateJob(editingJob.id, payload);
        setFeedback({ type: 'success', text: 'Job posting updated successfully.' });
      } else {
        await api.createJob(payload);
        setFeedback({ type: 'success', text: 'New job posting created successfully.' });
      }

      setModalOpen(false);
      fetchJobs();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      alert(err.message || 'Error saving job.');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.toggleJobActive(id);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        fetchJobs();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      alert('Toggle failed');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete vacancy "${title}" permanently?`)) {
      try {
        await api.deleteJob(id);
        setFeedback({ type: 'success', text: 'Job deleted successfully.' });
        fetchJobs();
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Job Openings Management</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Create, publish, edit, and organize career listings that appear on the public website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opening</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  {job.department}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  job.is_active 
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  {job.is_active ? 'Published' : 'Unpublished'}
                </span>
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-3">{job.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">{job.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</div>
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.experience}</div>
                {job.deadline && <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400/90 font-mono"><Calendar className="w-3.5 h-3.5" />{job.deadline}</div>}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleToggle(job.id)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {job.is_active ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-500" />}
                <span className="font-medium">{job.is_active ? 'Unpublish' : 'Publish'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(job)}
                  className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 shadow-xs transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(job.id, job.title)}
                  className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/50 shadow-xs transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 text-slate-900 dark:text-white">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Type *</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience Required</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Range (Optional)</label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Responsibilities (one per line)</label>
                  <textarea
                    rows="3"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirements (one per line)</label>
                  <textarea
                    rows="3"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-700 text-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Publish vacancy immediately</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 shadow-md transition-all"
                >
                  {editingJob ? 'Save Changes' : 'Publish Vacancy'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
