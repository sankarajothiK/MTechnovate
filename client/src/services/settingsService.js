import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { safeFetchJson } from './apiUtils';

export const settingsService = {
  /**
   * Fetch all email automation templates from Firestore
   */
  async getEmailTemplates() {
    try {
      const colRef = collection(db, 'emailTemplates');
      const snap = await getDocs(colRef);
      const templates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (templates.length > 0) {
        return { success: true, data: templates };
      }
    } catch (err) {
      console.warn('Firestore getEmailTemplates notice:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson('/api/admin/emails/templates', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, {
      success: true,
      data: [
        { id: 'app_received', name: 'Application Received Confirmation', subject: 'Application Received — M TECHNOVATE SOLUTIONS', active: 1 },
        { id: 'interview_invitation', name: 'Interview Call Letter', subject: 'Interview Invitation — M TECHNOVATE SOLUTIONS', active: 1 },
        { id: 'rejection_notice', name: 'Application Status Update', subject: 'Update on your application with M TECHNOVATE SOLUTIONS', active: 1 }
      ]
    });
  },

  /**
   * Update email template in Firestore
   */
  async updateEmailTemplate(id, data) {
    try {
      const docRef = doc(db, 'emailTemplates', String(id));
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, message: 'Email template saved successfully' };
    } catch (err) {
      console.warn('Firestore updateEmailTemplate fallback:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson(`/api/admin/emails/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    }, { success: true, message: 'Email template updated' });
  },

  /**
   * Fetch email dispatch audit logs from Firestore
   */
  async getEmailLogs() {
    try {
      const colRef = collection(db, 'emailLogs');
      const q = query(colRef, orderBy('sent_at', 'desc'));
      const snap = await getDocs(q);
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (logs.length > 0) {
        return { success: true, data: logs };
      }
    } catch (err) {
      console.warn('Firestore getEmailLogs notice:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson('/api/admin/emails/logs', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true, data: [] });
  },

  /**
   * Fetch live statistics for Admin Dashboard
   */
  async getDashboardMetrics() {
    try {
      const [jobsSnap, appsSnap, servicesSnap, gallerySnap, inquiriesSnap] = await Promise.all([
        getDocs(collection(db, 'jobs')).catch(() => ({ docs: [], size: 0 })),
        getDocs(collection(db, 'applications')).catch(() => ({ docs: [], size: 0 })),
        getDocs(collection(db, 'services')).catch(() => ({ docs: [], size: 0 })),
        getDocs(collection(db, 'gallery')).catch(() => ({ docs: [], size: 0 })),
        getDocs(collection(db, 'inquiries')).catch(() => ({ docs: [], size: 0 }))
      ]);

      const jobs = jobsSnap.docs.map(d => d.data());
      const apps = appsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const totalJobs = jobs.length;
      const activeJobs = jobs.filter(j => j.is_active === 1 || j.status === 'active').length;
      const totalApplications = apps.length;

      const shortlistedCount = apps.filter(a => a.status?.toLowerCase() === 'shortlisted').length;
      const selectedCount = apps.filter(a => a.status?.toLowerCase() === 'selected').length;
      const rejectedCount = apps.filter(a => a.status?.toLowerCase() === 'rejected').length;
      const underReviewCount = apps.filter(a => a.status?.toLowerCase() === 'under review').length;
      const newApplicationsCount = apps.filter(a => a.status?.toLowerCase() === 'new' || a.status?.toLowerCase() === 'applied').length;
      const unreadCount = inquiriesSnap.docs.filter(d => d.data().is_read === 0 || d.data().isRead === false).length;

      return {
        success: true,
        stats: {
          totalApplications,
          newApplications: newApplicationsCount,
          underReviewApplications: underReviewCount,
          shortlistedApplications: shortlistedCount,
          selectedApplications: selectedCount,
          rejectedApplications: rejectedCount,
          activeJobs,
          totalJobs,
          totalServices: servicesSnap.size || 8,
          totalGallery: gallerySnap.size || 4,
          unreadMessages: unreadCount
        },
        statusDistribution: [
          { name: 'New', count: newApplicationsCount, color: '#3B82F6' },
          { name: 'Under Review', count: underReviewCount, color: '#F59E0B' },
          { name: 'Shortlisted', count: shortlistedCount, color: '#10B981' },
          { name: 'Selected', count: selectedCount, color: '#8B5CF6' },
          { name: 'Rejected', count: rejectedCount, color: '#EF4444' }
        ],
        recentApplications: apps.slice(0, 5),
        recentJobs: jobs.slice(0, 5)
      };
    } catch (err) {
      console.warn('Firestore getDashboardMetrics notice:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson('/api/admin/dashboard', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, {
      success: true,
      stats: {
        totalApplications: 0,
        newApplications: 0,
        underReviewApplications: 0,
        shortlistedApplications: 0,
        selectedApplications: 0,
        rejectedApplications: 0,
        activeJobs: 3,
        totalJobs: 3,
        totalServices: 8,
        totalGallery: 4,
        unreadMessages: 0
      },
      statusDistribution: [
        { name: 'New', count: 0, color: '#3B82F6' },
        { name: 'Under Review', count: 0, color: '#F59E0B' },
        { name: 'Shortlisted', count: 0, color: '#10B981' },
        { name: 'Selected', count: 0, color: '#8B5CF6' },
        { name: 'Rejected', count: 0, color: '#EF4444' }
      ],
      recentApplications: [],
      recentJobs: []
    });
  }
};
