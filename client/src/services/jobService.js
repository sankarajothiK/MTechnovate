import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { safeFetchJson } from './apiUtils';

const COLLECTION_NAME = 'jobs';

export const jobService = {
  /**
   * Fetch all active jobs (for public website) or all jobs (for admin)
   */
  async getJobs(activeOnly = false) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);
      let jobs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (activeOnly) {
        jobs = jobs.filter(j => j.is_active === 1 || j.is_active === true || j.status === 'active');
      }

      // Sort in memory by createdAt descending to avoid composite index requirements
      jobs.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tB - tA;
      });

      if (jobs.length > 0) {
        return { success: true, data: jobs };
      }
    } catch (err) {
      console.warn('Firestore getJobs notice, checking backend fallback:', err.message);
    }

    // Fallback to backend API if Firestore is empty or cold
    const endpoint = activeOnly ? '/api/jobs' : '/api/admin/jobs';
    return await safeFetchJson(endpoint, {}, { success: true, data: [] });
  },

  /**
   * Real-time listener for public careers and admin jobs list
   */
  subscribeJobs(callback, activeOnly = false) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      return onSnapshot(colRef, (snapshot) => {
        let jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (activeOnly) {
          jobs = jobs.filter(j => j.is_active === 1 || j.is_active === true || j.status === 'active');
        }
        jobs.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return tB - tA;
        });
        callback(jobs);
      }, (err) => {
        console.warn('subscribeJobs snapshot notice:', err.message);
      });
    } catch (e) {
      console.warn('subscribeJobs initialization notice:', e.message);
      return () => {};
    }
  },

  /**
   * Get single job by ID
   */
  async getJob(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { success: true, data: { id: snap.id, ...snap.data() } };
      }
    } catch (err) {
      console.warn('Firestore getJob notice:', err.message);
    }

    return await safeFetchJson(`/api/jobs/${id}`, {}, { success: false, message: 'Job vacancy not found' });
  },

  /**
   * Create a new job vacancy with duplicate check
   */
  async createJob(jobData) {
    // 1. Duplicate check by title within collection
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = query(colRef, where('title', '==', jobData.title.trim()));
      const existing = await getDocs(q);
      if (!existing.empty) {
        throw new Error(`A job vacancy with the title "${jobData.title}" already exists.`);
      }

      const docRef = await addDoc(colRef, {
        title: jobData.title.trim(),
        department: jobData.department || 'Data Operations',
        category: jobData.category || jobData.department || 'Data Operations',
        location: jobData.location || 'Kadayam Office',
        experience: jobData.experience || '0–2 Years',
        salary_range: jobData.salary_range || jobData.salary || 'Best in Industry',
        salary: jobData.salary || jobData.salary_range || 'Best in Industry',
        employment_type: jobData.employment_type || jobData.employmentType || 'Full Time',
        employmentType: jobData.employment_type || jobData.employmentType || 'Full Time',
        description: jobData.description || '',
        requirements: Array.isArray(jobData.requirements) ? jobData.requirements : (jobData.requirements ? [jobData.requirements] : []),
        responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : [],
        skills: jobData.skills || '',
        skills_array: Array.isArray(jobData.skills_array) ? jobData.skills_array : (jobData.skills ? jobData.skills.split(',').map(s => s.trim()) : []),
        is_active: 1,
        status: 'active',
        applicationDeadline: jobData.deadline || jobData.applicationDeadline || '2026-12-31',
        deadline: jobData.deadline || jobData.applicationDeadline || '2026-12-31',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Dual-sync to backend SQLite API if running
      const token = localStorage.getItem('m_tech_admin_token');
      if (token) {
        fetch('/api/admin/jobs', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(jobData)
        }).catch(() => {});
      }

      return { success: true, id: docRef.id, message: 'Job vacancy published successfully' };
    } catch (err) {
      if (err.message.includes('already exists')) throw err;
      console.warn('Firestore createJob fallback:', err.message);

      const token = localStorage.getItem('m_tech_admin_token');
      return await safeFetchJson('/api/admin/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(jobData)
      }, { success: false, message: 'Unable to save job' });
    }
  },

  /**
   * Update an existing job vacancy
   */
  async updateJob(id, jobData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await updateDoc(docRef, {
        ...jobData,
        updatedAt: serverTimestamp()
      });

      // Dual-sync to backend SQLite API if running
      const token = localStorage.getItem('m_tech_admin_token');
      if (token && !isNaN(Number(id))) {
        fetch(`/api/admin/jobs/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(jobData)
        }).catch(() => {});
      }

      return { success: true, message: 'Job updated successfully' };
    } catch (err) {
      console.warn('Firestore updateJob fallback:', err.message);
      const token = localStorage.getItem('m_tech_admin_token');
      return await safeFetchJson(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(jobData)
      }, { success: true, message: 'Job updated' });
    }
  },

  /**
   * Toggle job activation state
   */
  async toggleJobActive(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const current = snap.data().is_active;
        const newActive = current === 1 ? 0 : 1;
        await updateDoc(docRef, {
          is_active: newActive,
          status: newActive === 1 ? 'active' : 'inactive',
          updatedAt: serverTimestamp()
        });

        // Dual-sync to backend SQLite API if running
        const token = localStorage.getItem('m_tech_admin_token');
        if (token && !isNaN(Number(id))) {
          fetch(`/api/admin/jobs/${id}/toggle`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => {});
        }

        return { success: true, is_active: newActive };
      }
    } catch (err) {
      console.warn('Firestore toggleJobActive fallback:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson(`/api/admin/jobs/${id}/toggle`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true });
  },

  /**
   * Delete a job vacancy permanently
   */
  async deleteJob(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await deleteDoc(docRef);

      // Dual-sync to backend SQLite API if running
      const token = localStorage.getItem('m_tech_admin_token');
      if (token && !isNaN(Number(id))) {
        fetch(`/api/admin/jobs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      }

      return { success: true, message: 'Job vacancy deleted' };
    } catch (err) {
      console.warn('Firestore deleteJob fallback:', err.message);
      const token = localStorage.getItem('m_tech_admin_token');
      return await safeFetchJson(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }, { success: true, message: 'Job deleted' });
    }
  }
};
