import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, FileText, Briefcase, User, Mail, Phone, Link2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function JobApplicationModal({ job, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    linkedin_url: '',
    portfolio_url: '',
    skills: '',
    additional_info: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('Resume file size must be less than 15MB.');
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setError('Please upload a valid PDF or Word document (.pdf, .doc, .docx).');
      return;
    }

    setError('');
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please provide your Full Name, Email, and Phone Number.');
      return;
    }

    if (!resumeFile) {
      setError('Please upload your resume (.pdf or .docx).');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('job_id', job.id);
      data.append('job_title', job.title || '');
      data.append('full_name', formData.full_name.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone.trim());
      data.append('cover_letter', formData.cover_letter.trim());
      data.append('linkedin_url', formData.linkedin_url.trim());
      data.append('portfolio_url', formData.portfolio_url.trim());
      data.append('skills', formData.skills.trim());
      data.append('additional_info', formData.additional_info.trim());
      data.append('resume', resumeFile);

      const res = await api.submitApplication(data);
      if (res.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Failed to submit application.');
      }
    } catch (err) {
      setError(err.message || 'Error uploading application. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm -z-10"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl my-8 bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900">Application Submitted Successfully</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Thank you for applying for the <strong className="text-brand-600">{job.title}</strong> position at <strong>M TECHNOVATE SOLUTIONS</strong>.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-md mx-auto">
              Our operations recruitment board will evaluate your submission. If shortlisted, an automated interview invitation will be sent to <span className="text-brand-600 font-mono font-bold">{formData.email}</span>.
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-colors"
              >
                Back to Careers
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-blue-50 text-brand-600 border border-blue-200">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-brand-600 font-bold">Job Application</span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">{job.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">{job.department} • {job.location}</div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 87783 40454"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    LinkedIn or Profile URL
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Typing Speed & Core Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. Typing 40 WPM, MS Excel, English transcription"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Resume File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Resume / CV (PDF or DOCX, max 15MB) <span className="text-brand-600">*</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-5 text-center transition-colors bg-slate-50 cursor-pointer">
                  <input
                    type="file"
                    required={!resumeFile}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3 text-brand-600">
                      <FileText className="w-6 h-6" />
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-900">{resumeFile.name}</div>
                        <div className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-700 font-semibold">
                        Click or drag resume file to upload
                      </p>
                      <p className="text-[11px] text-slate-500">PDF, DOC, DOCX up to 15MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cover Note / Introduction (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Share a brief note about yourself and your career goals..."
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </motion.div>
    </div>
  );
}
