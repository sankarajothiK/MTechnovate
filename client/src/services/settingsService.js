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
    const res = await fetch('/api/admin/emails/templates', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
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
      return { success: true, message: 'Email template saved to Firebase' };
    } catch (err) {
      console.warn('Firestore updateEmailTemplate fallback:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    const res = await fetch(`/api/admin/emails/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    return res.json();
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
    const res = await fetch('/api/admin/emails/logs', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  },

  /**
   * Fetch live statistics for Admin Dashboard
   */
  async getDashboardMetrics() {
    try {
      const [jobsSnap, appsSnap, servicesSnap, gallerySnap, inquiriesSnap] = await Promise.all([
        getDocs(collection(db, 'jobs')),
        getDocs(collection(db, 'applications')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'inquiries'))
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
          totalServices: servicesSnap.size,
          totalGallery: gallerySnap.size,
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
    const res = await fetch('/api/admin/dashboard', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  }
};
