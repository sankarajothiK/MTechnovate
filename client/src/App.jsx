import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PublicHome from './pages/PublicHome';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminJobs from './pages/admin/AdminJobs';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminProfile from './pages/admin/AdminProfile';
import AdminEmails from './pages/admin/AdminEmails';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminSettings from './pages/admin/AdminSettings';
import { Loader2 } from 'lucide-react';

// Protected Route Guard for Admin Panel
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span className="text-xs font-mono">Verifying administrative credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Enterprise Website */}
            <Route path="/" element={<PublicHome />} />

            {/* Admin Login Route (discrete, not linked in main navbar) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin ATS & Content Console */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="emails" element={<AdminEmails />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
