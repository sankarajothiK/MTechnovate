import React, { useState, useEffect } from 'react';
import { Mail, Edit, CheckCircle2, Send, Clock, Eye, AlertCircle, FileText, Loader2, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminEmails() {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchEmailData = async () => {
    try {
      const [tplRes, logRes] = await Promise.all([
        api.getEmailTemplates().catch(() => ({ success: false, data: [] })),
        api.getEmailLogs().catch(() => ({ success: false, data: [] }))
      ]);
      if (tplRes.success) setTemplates(tplRes.data);
      if (logRes.success) setLogs(logRes.data);
    } catch (err) {
      console.error('Failed to load email data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailData();
  }, []);

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      await api.updateEmailTemplate(editingTemplate.id, {
        subject: editingTemplate.subject,
        body: editingTemplate.body
      });
      setFeedback({ type: 'success', text: 'Email template saved successfully!' });
      setEditingTemplate(null);
      fetchEmailData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      alert('Failed to update template');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Automated Email Communications & Delivery Logs
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Customize candidate automated notification templates and audit all delivered or simulated interview communications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'templates'
              ? 'bg-brand-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-dark-900'
          }`}
        >
          Email Templates ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'logs'
              ? 'bg-brand-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-dark-900'
          }`}
        >
          Delivery Audit History ({logs.length})
        </button>
      </div>

      {/* Tab 1: Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold tracking-wider">
                    {tpl.template_type === 'shortlist_interview' 
                      ? 'Candidate Shortlist & Interview Invitation' 
                      : tpl.template_type === 'selected'
                      ? 'Candidate Selection & Formal Offer'
                      : tpl.template_type === 'rejection'
                      ? 'Application Rejection Notice'
                      : tpl.template_type}
                  </span>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-1">{tpl.subject}</h3>
                </div>
                <button
                  onClick={() => setEditingTemplate(tpl)}
                  className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Edit Template</span>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-dark-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {tpl.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl">
          {logs.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500 font-mono">
              No email logs recorded yet. Shortlisting an applicant in ATS will trigger notifications.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-slate-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Delivery Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{log.recipient_name}</div>
                        <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">{log.recipient_email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">{log.subject}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{log.template_type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          log.status.includes('Delivered') 
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                            : log.status.includes('Error') 
                            ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' 
                            : 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.sent_at}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500 shadow-xs transition-colors"
                          title="Preview Email HTML"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <button
              onClick={() => setEditingTemplate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Edit Automated Email Template</h3>
            
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Template Body Text (Supports placeholder variables: {'{{applicant_name}}'}, {'{{job_position}}'}, {'{{interview_date}}'}, etc.)
                </label>
                <textarea
                  rows="10"
                  required
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 shadow-md transition-all"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log HTML Preview Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-dark-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col text-slate-900 dark:text-white">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              Delivered Email Preview — {selectedLog.recipient_email}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-4">
              Subject: {selectedLog.subject} • Sent: {selectedLog.sent_at}
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
              <div 
                dangerouslySetInnerHTML={{ __html: selectedLog.html_body }} 
                className="prose dark:prose-invert max-w-none text-xs"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
