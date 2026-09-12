import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Briefcase, Users, Layers, Image, 
  Building2, Mail, MessageSquare, Settings, LogOut,
  Menu, X, ExternalLink, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Applications (ATS)', path: '/admin/applications', icon: Users },
  { name: 'Job Vacancies', path: '/admin/jobs', icon: Briefcase },
  { name: 'Services', path: '/admin/services', icon: Layers },
  { name: 'Gallery', path: '/admin/gallery', icon: Image },
  { name: 'Company Profile', path: '/admin/profile', icon: Building2 },
  { name: 'Email Automation', path: '/admin/emails', icon: Mail },
  { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div 
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar (Clean dark navy for high contrast grounding) */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-slate-900 dark:bg-[#060B18] border-r border-slate-800 dark:border-white/10 transition-all duration-300 w-72 max-w-[85vw] lg:w-64 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-cyan-400/40 shadow-sm shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {(!collapsed || mobileDrawerOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-['Outfit'] font-bold text-sm tracking-wider text-white truncate">
                  M TECH<span className="text-cyan-400">NOVATE</span>
                </span>
                <span className="text-[9.5px] text-cyan-400 font-mono uppercase tracking-widest font-bold">
                  Admin Console
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {/* Collapse toggle on desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setMobileDrawerOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-slate-800 shrink-0 space-y-2">
          {(!collapsed || mobileDrawerOpen) && (
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {admin?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {admin?.email || 'admin@mtechnovate.com'}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${
              collapsed ? 'lg:justify-center lg:px-2' : ''
            }`}
            title="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-100/70 dark:bg-[#030712] transition-colors">
        
        {/* Topbar */}
        <header className="h-16 bg-white/90 dark:bg-[#060B18]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-3 sm:px-6 lg:px-8 shrink-0 shadow-xs transition-colors">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-500 shrink-0"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white truncate">
                <span className="sm:hidden">ATS Console</span>
                <span className="hidden sm:inline">Operations & ATS Administration</span>
              </h1>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold uppercase">
                Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <ThemeToggle />

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              title="View Public Website"
            >
              <span className="hidden sm:inline">View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Engine</span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
