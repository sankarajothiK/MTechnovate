import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Clock, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { inquiryService } from '../../services/inquiryService';

export default function AdminInquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.getContactMessages();
      if (res.success) setMessages(res.data);
    } catch (err) {
      console.error('Failed to load contact inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const unsub = inquiryService.subscribeInquiries?.((liveMessages) => {
      if (Array.isArray(liveMessages)) {
        setMessages(liveMessages);
        setLoading(false);
      }
    });
    return () => unsub?.();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markContactMessageRead(id);
      fetchMessages();
    } catch (err) {
      alert('Failed to mark read');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete message from "${name}"?`)) {
      try {
        await api.deleteContactMessage(id);
        setFeedback({ type: 'success', text: 'Message removed.' });
        fetchMessages();
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        alert('Delete failed');
      }
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
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Client & Partner Inquiries</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review incoming enterprise inquiries submitted via the public Contact section.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Retrieving messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-mono">
          No inquiries in inbox. New contact form submissions will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl glass-card border transition-all shadow-sm dark:shadow-xl ${
                msg.is_read ? 'border-slate-200 dark:border-slate-800' : 'border-cyan-500/50 bg-cyan-50/50 dark:bg-cyan-950/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-sm">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{msg.name}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{msg.email}</span>
                      {msg.phone && <span>• {msg.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{msg.created_at}</span>
                  </span>
                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="p-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/50 shadow-xs transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {msg.subject && (
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    Subject: {msg.subject}
                  </div>
                )}
                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {msg.message}
                </p>
              </div>

              {!msg.is_read && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-mono font-semibold"
                  >
                    Mark as read ✓
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
