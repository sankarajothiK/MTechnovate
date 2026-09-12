import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const DOC_PATH = ['websiteContent', 'company_profile'];

export const websiteService = {
  /**
   * Fetch company profile and website content
   */
  async getCompanyProfile() {
    try {
      const docRef = doc(db, DOC_PATH[0], DOC_PATH[1]);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { success: true, data: snap.data() };
      }
    } catch (err) {
      console.warn('Firestore getCompanyProfile notice:', err.message);
    }

    const res = await fetch('/api/company');
    return res.json();
  },

  /**
   * Real-time listener for company profile, branding, and contact details
   */
  subscribeCompanyProfile(callback) {
    try {
      const docRef = doc(db, DOC_PATH[0], DOC_PATH[1]);
      return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          callback(snap.data());
        }
      }, (err) => {
        console.warn('subscribeCompanyProfile snapshot error:', err.message);
      });
    } catch (e) {
      console.warn('subscribeCompanyProfile error:', e.message);
      return () => {};
    }
  },

  /**
   * Update website profile, uploading any new logo or CEO photo
   */
  async updateCompanyProfile(formData) {
    const isFormData = typeof formData.get === 'function';

    const updates = {};
    const textFields = [
      'company_name', 'tagline', 'ceo_name', 'ceo_designation',
      'ceo_message', 'address', 'email', 'phone',
      'social_linkedin', 'social_twitter', 'social_github',
      'about_text', 'vision', 'mission'
    ];

    for (const field of textFields) {
      const val = isFormData ? formData.get(field) : formData[field];
      if (val !== undefined && val !== null) {
        updates[field] = val;
      }
    }

    // 1. High-speed update via backend API (handles file uploads to /uploads/company/ and updates SQLite)
    const token = localStorage.getItem('m_tech_admin_token');
    let backendResult = null;
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      backendResult = await res.json();
      if (!res.ok || !backendResult.success) {
        throw new Error(backendResult.message || 'Failed to update company profile');
      }
    } catch (apiErr) {
      console.warn('Backend company update error:', apiErr.message);
      throw apiErr;
    }

    // 2. Dual-sync text & images to Firestore (with 3s timeout so it NEVER freezes)
    try {
      const docRef = doc(db, DOC_PATH[0], DOC_PATH[1]);
      const setPromise = setDoc(docRef, {
        ...updates,
        ...(backendResult.data?.logo ? { logo: backendResult.data.logo } : {}),
        ...(backendResult.data?.ceo_photo ? { ceo_photo: backendResult.data.ceo_photo } : {}),
        updatedAt: serverTimestamp()
      }, { merge: true });

      await Promise.race([
        setPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 3000))
      ]).catch(e => console.warn('Firestore company profile sync notice:', e.message));
    } catch (fsErr) {
      console.warn('Firestore company dual-sync notice:', fsErr.message);
    }

    return backendResult;
  }
};
