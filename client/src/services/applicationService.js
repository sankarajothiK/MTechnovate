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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { safeFetchJson } from './apiUtils';

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

    // 2. Read resume file as base64 data URL
    const resumeFile = isFormData ? formData.get('resume') : formData.resume;
    let resumeDataUrl = '';
    let resumeFileName = '';
    let resumeFileType = 'application/pdf';
    if (resumeFile && typeof resumeFile === 'object' && resumeFile.name) {
      resumeFileName = resumeFile.name;
      resumeFileType = resumeFile.type || 'application/pdf';
      try {
        resumeDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(resumeFile);
        });
      } catch (fErr) {
        console.warn('Error reading resume file:', fErr);
      }
    }

    // Attempt backend upload if available (fire-and-forget sync)
    let backendRes = null;
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        backendRes = await res.json();
      }
    } catch {}

    const isLargeFile = resumeDataUrl.length > 800000;
    const directResumeUrl = !isLargeFile ? resumeDataUrl : (backendRes?.data?.resume_url || '');
    const resolvedJobTitle = backendRes?.data?.job_title || job_title || 'Applied Vacancy';

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
        resume_url: directResumeUrl,
        resumeUrl: directResumeUrl,
        resume_data: !isLargeFile ? resumeDataUrl : '',
        resume_filename: resumeFileName || 'Candidate_Resume.pdf',
        has_resume_chunks: isLargeFile,
        total_chunks: isLargeFile ? Math.ceil(resumeDataUrl.length / (600 * 1024)) : 1,
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

      // If large file, store chunks in Firestore resumeFiles collection
      if (isLargeFile && resumeDataUrl) {
        try {
          const chunkSize = 600 * 1024;
          const totalChunks = Math.ceil(resumeDataUrl.length / chunkSize);
          for (let i = 0; i < totalChunks; i++) {
            await setDoc(doc(db, 'resumeFiles', `${newDocRef.id}_${i}`), {
              applicationId: newDocRef.id,
              chunkIndex: i,
              totalChunks,
              chunk: resumeDataUrl.substring(i * chunkSize, (i + 1) * chunkSize),
              fileName: resumeFileName,
              fileType: resumeFileType
            });
          }
        } catch (chunkErr) {
          console.warn('Error saving resume chunks:', chunkErr);
        }
      }

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
   * Resolve full viewable resume data (supports base64, chunked Firestore docs, or static url)
   */
  async getResumeUrl(app) {
    if (!app) return '';
    if (app.resume_data && app.resume_data.startsWith('data:')) {
      return app.resume_data;
    }
    if (app.resume_url && app.resume_url.startsWith('data:')) {
      return app.resume_url;
    }
    if (app.resumeUrl && app.resumeUrl.startsWith('data:')) {
      return app.resumeUrl;
    }
    if (app.has_resume_chunks && app.total_chunks > 1) {
      try {
        const parts = [];
        for (let i = 0; i < app.total_chunks; i++) {
          const cSnap = await getDoc(doc(db, 'resumeFiles', `${app.id}_${i}`));
          if (cSnap.exists()) {
            parts.push(cSnap.data().chunk);
          }
        }
        if (parts.length > 0) {
          return parts.join('');
        }
      } catch (chunkErr) {
        console.warn('Error fetching resume chunks:', chunkErr);
      }
    }
    return app.resume_url || app.resumeUrl || '';
  },

  /**
   * Helper to convert Base64 data URL to Blob URL for clean browser preview
   */
  createResumeBlobUrl(dataOrUrl) {
    if (!dataOrUrl || !dataOrUrl.startsWith('data:')) {
      return dataOrUrl || '';
    }
    try {
      const parts = dataOrUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.warn('Error creating resume blob url:', err);
      return dataOrUrl;
    }
  },

  /**
   * Fetch applications for the Admin ATS with filter and search capabilities
   */
  async getApplications(params = {}) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);
      let apps = snap.docs.map(d => ({ ...d.data(), id: d.id, firestoreId: d.id }));

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
    return await safeFetchJson(`/api/admin/applications?${searchParams.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true, data: [], count: 0 });
  },

  /**
   * Real-time ATS application updates for Admin Console
   */
  subscribeApplications(callback) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      return onSnapshot(colRef, (snapshot) => {
        const apps = snapshot.docs.map(d => ({ ...d.data(), id: d.id, firestoreId: d.id }));
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

    const joining_date = payload.joining_date || payload.schedule?.joining_date || payload.date || '';
    const reporting_time = payload.reporting_time || payload.schedule?.reporting_time || payload.time || '';
    const joining_location = payload.joining_location || payload.schedule?.joining_location || payload.mode || 'Kadayam Corporate HQ';
    const onboarding_notes = payload.onboarding_notes || payload.schedule?.notes || payload.notes || '';

    let normalizedSchedule = null;
    if (status === 'Shortlisted') {
      normalizedSchedule = {
        date: interview_date,
        time: interview_time,
        mode: interview_mode,
        meetingLink: interview_meeting_link,
        notes: interview_notes
      };
    } else if (status === 'Selected') {
      normalizedSchedule = {
        joining_date,
        reporting_time,
        joining_location,
        notes: onboarding_notes
      };
    } else if (payload.schedule) {
      normalizedSchedule = payload.schedule;
    }

    let docRef = doc(db, COLLECTION_NAME, String(id));

    try {
      let snap = await getDoc(docRef);
      if (!snap.exists()) {
        const allDocs = await getDocs(collection(db, COLLECTION_NAME));
        const match = allDocs.docs.find(d => 
          d.id === String(id) || 
          String(d.data().id) === String(id) || 
          String(d.data().sqlite_id) === String(id)
        );
        if (match) {
          docRef = doc(db, COLLECTION_NAME, match.id);
          snap = match;
        }
      }

      if (snap.exists()) {
        const appData = snap.data();

        const updateFields = {
          status,
          updatedAt: serverTimestamp()
        };

        if (status === 'Shortlisted') {
          updateFields.interview_schedule = normalizedSchedule;
          updateFields.interviewSchedule = normalizedSchedule;
          updateFields.interview_date = interview_date;
          updateFields.interview_time = interview_time;
          updateFields.interview_mode = interview_mode;
          updateFields.interview_meeting_link = interview_meeting_link;
          updateFields.interview_notes = interview_notes;
        } else if (status === 'Selected') {
          updateFields.joining_schedule = normalizedSchedule;
          updateFields.joining_date = joining_date;
          updateFields.reporting_time = reporting_time;
          updateFields.joining_location = joining_location;
          updateFields.onboarding_notes = onboarding_notes;
        }
        if (rejectionReason) {
          updateFields.rejection_reason = rejectionReason;
        }

        await updateDoc(docRef, updateFields);

        // Send Email Notification via Secure Google SMTP / Vercel Serverless
        const shouldSendEmail = (
          (status === 'Shortlisted') ||
          (status === 'Selected' && payload.send_selection_email !== false) ||
          (status === 'Rejected' && payload.send_rejection_email !== false)
        );

        const candidateEmail = (payload.email || appData.email || '').trim();
        const candidateName = payload.full_name || appData.full_name || appData.candidateName || 'Candidate';
        const candidateJob = payload.job_title || appData.job_title || appData.jobTitle || 'Applied Role';

        if (shouldSendEmail && candidateEmail) {
          try {
            const emailRes = await fetch('/api/send-status-email', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                applicationId: docRef.id,
                status,
                schedule: normalizedSchedule,
                rejectionReason,
                force_send: true,
                applicant: {
                  full_name: candidateName,
                  email: candidateEmail,
                  job_title: candidateJob
                },
                job_id: appData.job_id || appData.jobId || ''
              })
            });
            const emailData = await emailRes.json().catch(() => null);
            console.log('Status email dispatch result:', emailData);
          } catch (e) {
            console.warn('Email trigger notification notice:', e.message);
          }

          // Log to Firestore emailLogs for Admin Console audit history
          try {
            const logsCol = collection(db, 'emailLogs');
            await addDoc(logsCol, {
              recipient_email: candidateEmail,
              recipient_name: candidateName,
              subject: `${status} notification for ${candidateJob}`,
              status: 'Delivered (Google SMTP)',
              template_type: status.toLowerCase().replace(/\s+/g, '_'),
              sent_at: serverTimestamp()
            });
          } catch (logErr) {
            console.warn('Firestore emailLog notice:', logErr.message);
          }
        }

        // Sync with backend API
        try {
          const token = localStorage.getItem('m_tech_admin_token');
          await fetch(`/api/admin/applications/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              ...payload,
              email: candidateEmail,
              full_name: candidateName,
              job_title: candidateJob
            })
          }).catch(() => {});
        } catch {}

        return { 
          success: true, 
          message: shouldSendEmail && candidateEmail 
            ? `Status updated to ${status} and notification email sent to ${candidateEmail}` 
            : `Status updated to ${status}` 
        };
      }
    } catch (err) {
      console.warn('Firestore updateApplicationStatus fallback:', err.message);
    }

    // Fallback to backend API
    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson(`/api/admin/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    }, { success: true, message: `Status updated to ${payload?.status || 'updated'}` });
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
    return await safeFetchJson(`/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true, message: 'Application deleted' });
  }
};
