import React, { useState } from 'react';
import { Settings, Server, Shield, Mail, CheckCircle2, Key, Database, RefreshCw } from 'lucide-react';

export default function AdminSettings() {
  const [testStatus, setTestStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTestMail = async () => {
    setTesting(true);
    setTestStatus({ type: 'info', text: 'Connecting to Google SMTP (smtp.gmail.com:587) with official credentials...' });
    try {
      const token = localStorage.getItem('m_tech_admin_token');
      const res = await fetch('/api/admin/emails/test-connection', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus({ type: 'success', text: data.message });
      } else {
        setTestStatus({ type: 'error', text: data.message });
      }
    } catch (err) {
      setTestStatus({ type: 'error', text: err.message || 'Connection test failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">System & Infrastructure Settings</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Technical configuration, SMTP transport environment variables, and persistent SQLite database diagnostics.
        </p>
      </div>

      {testStatus && (
        <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2 ${
          testStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
          testStatus.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' :
          'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{testStatus.text}</span>
        </div>
      )}

      {/* SMTP Configuration Guide */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm dark:shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-500" />
            <span>Automated SMTP Transport Credentials</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 text-[11px] font-mono border border-cyan-200 dark:border-cyan-800 font-semibold">
            Active Engine
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The recruitment ATS automatically sends candidate interview invitations and status updates. In production, configure standard SMTP credentials in the server environment or <code className="text-cyan-600 dark:text-cyan-300 font-semibold">.env</code> file:
        </p>

        <div className="bg-slate-50 dark:bg-dark-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 space-y-1">
          <p><span className="text-cyan-600 dark:text-cyan-400 font-semibold">SMTP_HOST</span>=smtp.gmail.com</p>
          <p><span className="text-cyan-600 dark:text-cyan-400 font-semibold">SMTP_PORT</span>=587</p>
          <p><span className="text-cyan-600 dark:text-cyan-400 font-semibold">SMTP_USER</span>=mtechnovatesolutions@gmail.com</p>
          <p><span className="text-cyan-600 dark:text-cyan-400 font-semibold">SMTP_PASS</span>=your_app_specific_password</p>
          <p><span className="text-cyan-600 dark:text-cyan-400 font-semibold">SMTP_FROM_EMAIL</span>=mtechnovatesolutions@gmail.com</p>
          <p><span className="text-cyan-600 dark:text-cyan-400 font-semibold">SMTP_FROM_NAME</span>="M TECHNOVATE SOLUTIONS"</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200">
          <strong>Safe Simulation Active:</strong> If external SMTP credentials are not supplied, every email (including shortlist interview notifications with meeting links) is safely logged to the database and can be inspected in full HTML in the <strong>Email Automation</strong> logs tab.
        </div>

        <div>
          <button
            onClick={handleTestMail}
            disabled={testing}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{testing ? 'Testing Connection...' : 'Run Mailer Self-Test'}</span>
          </button>
        </div>
      </div>

      {/* Database Diagnostics */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-xl">
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-500" />
          <span>Persistent SQLite Database Engine</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block">Database Driver</span>
            <span className="text-slate-900 dark:text-white font-mono font-bold mt-1 block">Node.js DatabaseSync (Built-in)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block">Storage Path</span>
            <span className="text-slate-900 dark:text-white font-mono text-[11px] mt-1 block truncate">server/data/mtechnovate.sqlite</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block">Journaling Mode</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1 block">WAL (Write-Ahead Logging)</span>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-xl">
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-500" />
          <span>Security & Session Posture</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Admin access is secured with cryptographic JSON Web Tokens (JWT) signed using HMAC-SHA256, alongside BCrypt password hashing with 10 salt rounds. Protected administrative endpoints require valid Bearer token authorization headers.
        </p>
      </div>

    </div>
  );
}
