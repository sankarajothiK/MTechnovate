import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

const COLLECTION_NAME = 'applications';

export const applicationService = {
  /**
   * Submit an application with duplicate submission check & resume upload to Firebase Storage
   */
  async submitApplication(formData) {
    // Extract fields whether passed as FormData or plain object
    const isFormData = typeof formData.get === 'function';
    const job_id = isFormData ? formData.get('job_id') : formData.job_id;
    const job_title = isFormData ? (formData.get('job_title') || formData.get('title')) : (formData.job_title || formData.title);
    const full_name = isFormData ? (formData.get('full_name') || formData.get('candidateName')) : (formData.full_name || formData.candidateName);
    const email = (isFormData ? formData.get('email') : formData.email)?.trim().toLowerCase();
    const phone = isFormData ? formData.get('phone') : formData.phone;
    const cover_letter = isFormData ? (formData.get('cover_letter') || formData.get('coverLetter')) : (formData.cover_letter || formData.coverLetter);
    const linkedin_url = isFormData ? (formData.get('linkedin_url') || formData.get('linkedin')) : (formData.linkedin_url || formData.linkedin);
    const portfolio_url = isFormData ? (formData.get('portfolio_url') || formData.get('portfolio')) : (formData.portfolio_url || formData.portfolio);
    const skills = isFormData ? formData.get('skills') : formData.skills;
    const experience = isFormData ? formData.get('experience') : formData.experience;

    if (!job_id || !full_name || !email) {
      throw new Error('Please provide candidate name, email, and select a job position.');
    }

    // 1. Fast duplicate check via Firestore (with 2s timeout so it never hangs)
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const dupPromise = getDocs(query(colRef, where('email', '==', email.trim())));
      const existing = await Promise.race([
        dupPromise,
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 2000))
      ]).catch(() => null);

      if (existing?.docs) {
        const isDuplicate = existing.docs.some(d => String(d.data().job_id) === String(job_id));
        if (isDuplicate) {
          throw new Error('You have already submitted an application for this vacancy. Our talent team is reviewing your profile.');
        }
      }
    } catch (err) {
      if (err.message.includes('already submitted')) throw err;
    }

    // 2. Upload resume file & record via backend API (instantaneous multipart handling)
    let backendRes = null;
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      });
      backendRes = await res.json();
      if (!res.ok || !backendRes.success) {
        throw new Error(backendRes.message || 'Failed to submit application.');
      }
    } catch (apiErr) {
      console.warn('Backend application submission error:', apiErr.message);
      if (apiErr.message.includes('already submitted') || apiErr.message.includes('closed')) {
        throw apiErr;
      }
    }

    const resumeUrl = backendRes?.data?.resume_url || '';
    const resolvedJobTitle = backendRes?.data?.job_title || job_title || 'Applied Vacancy';
    const resolvedAppId = String(backendRes?.data?.id || backendRes?.applicationId || Date.now());

    // 3. Write document to Firestore so Admin ATS real-time listener updates live
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const newDocRef = await addDoc(colRef, {
        job_id: String(job_id),
        jobId: String(job_id),
        job_title: resolvedJobTitle,
        candidateName: full_name,
        full_name,
        email,
        phone: phone || '',
        cover_letter: cover_letter || '',
        coverLetter: cover_letter || '',
        linkedin_url: linkedin_url || '',
        portfolio_url: portfolio_url || '',
        skills: skills || '',
        experience: experience || '',
        resume_url: resumeUrl,
        resumeUrl,
        storagePath: '',
        status: 'New',
        applied_at: new Date().toISOString(),
        notificationsSent: {
          shortlisted: false,
          interviewScheduled: false,
          selected: false,
          rejected: false
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        id: newDocRef.id,
        applicationId: newDocRef.id,
        message: 'Application submitted successfully! We have received your profile.'
      };
    } catch (firestoreErr) {
      console.warn('Firestore sync notice:', firestoreErr.message);
      if (backendRes && backendRes.success) {
        return backendRes;
      }
      throw firestoreErr;
    }
  },

  /**
   * Fetch applications for the Admin ATS with filter and search capabilities
   */
  async getApplications(params = {}) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);
      let apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // In-memory sort by createdAt or applied_at descending
      apps.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.applied_at ? new Date(a.applied_at).getTime() : 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.applied_at ? new Date(b.applied_at).getTime() : 0);
        return timeB - timeA;
      });

      // In-memory multi-attribute filtering
      if (params.status && params.status !== 'All') {
        apps = apps.filter(a => a.status?.toLowerCase() === params.status.toLowerCase());
      }
      if (params.job_id && params.job_id !== 'All') {
        apps = apps.filter(a => String(a.job_id || a.jobId) === String(params.job_id));
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        apps = apps.filter(a => 
          (a.full_name || a.candidateName || '').toLowerCase().includes(s) ||
          (a.email || '').toLowerCase().includes(s) ||
          (a.phone || '').toLowerCase().includes(s) ||
          (a.job_title || '').toLowerCase().includes(s)
        );
      }

      // Return Firestore result (even when 0 documents)
      return { success: true, data: apps, count: apps.length };
    } catch (err) {
      console.warn('Firestore getApplications notice, checking fallback:', err.message);
    }

    // Fallback to backend API
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.job_id) searchParams.set('job_id', params.job_id);
    if (params.search) searchParams.set('search', params.search);
    const token = localStorage.getItem('m_tech_admin_token');
    const res = await fetch(`/api/admin/applications?${searchParams.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  },

  /**
   * Real-time ATS application updates for Admin Console
   */
  subscribeApplications(callback) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      return onSnapshot(colRef, (snapshot) => {
        const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        apps.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.applied_at ? new Date(a.applied_at).getTime() : 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.applied_at ? new Date(b.applied_at).getTime() : 0);
          return timeB - timeA;
        });
        callback(apps);
      }, (err) => {
        console.warn('subscribeApplications error:', err.message);
      });
    } catch (e) {
      console.warn('subscribeApplications setup error:', e.message);
      return () => {};
    }
  },

  /**
   * Update application status and trigger automated email notification
   */
  async updateApplicationStatus(id, payload) {
    const { status, rejectionReason, notes } = payload;
    const interview_date = payload.interview_date || payload.schedule?.date || payload.schedule?.interview_date || '';
    const interview_time = payload.interview_time || payload.schedule?.time || payload.schedule?.interview_time || '';
    const interview_mode = payload.interview_mode || payload.schedule?.mode || payload.schedule?.interview_mode || 'Online Video Conference';
    const interview_meeting_link = payload.interview_meeting_link || payload.schedule?.meetingLink || payload.schedule?.interview_meeting_link || '';
    const interview_notes = payload.interview_notes || payload.schedule?.notes || payload.schedule?.interview_notes || '';

    const normalizedSchedule = (interview_date || interview_time) ? {
      date: interview_date,
      time: interview_time,
      mode: interview_mode,
      meetingLink: interview_meeting_link,
      notes: interview_notes
    } : (payload.schedule || null);

    let docRef = doc(db, COLLECTION_NAME, String(id));

    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const appData = snap.data();

        const updateFields = {
          status,
          updatedAt: serverTimestamp()
        };

        if (normalizedSchedule) {
          updateFields.interview_schedule = normalizedSchedule;
          updateFields.interviewSchedule = normalizedSchedule;
          updateFields.interview_date = interview_date;
          updateFields.interview_time = interview_time;
          updateFields.interview_mode = interview_mode;
          updateFields.interview_meeting_link = interview_meeting_link;
          updateFields.interview_notes = interview_notes;
        }
        if (rejectionReason) {
          updateFields.rejection_reason = rejectionReason;
        }

        await updateDoc(docRef, updateFields);

        // Send Email Notification via Secure Backend SMTP (with duplication check)
        const token = localStorage.getItem('m_tech_admin_token');
        await fetch('/api/send-status-email', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            applicationId: id,
            status,
            schedule: normalizedSchedule,
            rejectionReason,
            applicant: {
              full_name: appData.full_name || appData.candidateName,
              email: appData.email
            },
            job_id: appData.job_id || appData.jobId
          })
        }).catch(e => console.warn('Email trigger backend notification:', e.message));

        // Sync with backend API
        try {
          await fetch(`/api/admin/applications/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
          }).catch(() => {});
        } catch {}

        return { success: true, message: `Status updated to ${status}` };
      }
    } catch (err) {
      console.warn('Firestore updateApplicationStatus fallback:', err.message);
    }

    // Fallback to backend API
    const token = localStorage.getItem('m_tech_admin_token');
    const res = await fetch(`/api/admin/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  /**
   * Delete application and delete resume file from Firebase Storage
   */
  async deleteApplication(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        // Clean up storage file if present
        if (data.storagePath) {
          try {
            const fileRef = ref(storage, data.storagePath);
            await deleteObject(fileRef);
          } catch (storageErr) {
            console.warn('Storage cleanup warning:', storageErr.message);
          }
        }
        await deleteDoc(docRef);

        // Sync deletion with backend API
        const token = localStorage.getItem('m_tech_admin_token');
        try {
          await fetch(`/api/admin/applications/${id}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }).catch(() => {});
        } catch {}

        return { success: true, message: 'Application deleted from Firebase' };
      }
    } catch (err) {
      console.warn('Firestore deleteApplication fallback:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  }
};
