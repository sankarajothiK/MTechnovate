import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { safeFetchJson } from './apiUtils';

const DOC_PATH = ['websiteContent', 'company_profile'];

export const DEFAULT_COMPANY_DATA = {
  company_name: 'M TECHNOVATE SOLUTIONS',
  tagline: 'Enterprise BPO, Remote Tech Teams & IT Services',
  ceo_name: 'RAMESH K',
  ceo_designation: 'Founder & Managing Director',
  ceo_photo: '/uploads/company/ceo_ramesh_k.jpg',
  address: 'M.G.Complex, Busstand, Kadayam-627 415.',
  email: 'mtechnovatesolutions@gmail.com',
  phone: '+91 87783 40454',
  whatsapp_number: '8778340454',
  social_linkedin: 'https://www.linkedin.com/in/ramesh-k-280420432/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2F%2FRyB1OzSBCev6A5OIGSjg%3D%3D',
  social_instagram: 'https://www.instagram.com/mtechnovatesolutions?stkn=MTg5dmt3cmhjMWN4Mw=='
};

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

    return await safeFetchJson('/api/company', {}, { success: true, data: DEFAULT_COMPANY_DATA });
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
        console.warn('subscribeCompanyProfile snapshot notice:', err.message);
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
      'ceo_message', 'address', 'email', 'phone', 'whatsapp_number',
      'social_linkedin', 'social_instagram', 'social_twitter', 'social_github',
      'about_text', 'vision', 'mission'
    ];

    for (const field of textFields) {
      const val = isFormData ? formData.get(field) : formData[field];
      if (val !== undefined && val !== null) {
        updates[field] = val;
      }
    }

    // 1. Try backend API if available
    let backendResult = null;
    try {
      const token = localStorage.getItem('m_tech_admin_token');
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        backendResult = await res.json();
      }
    } catch (apiErr) {
      console.warn('Backend company update bypassed for direct Firebase:', apiErr.message);
    }

    // 2. Direct client-side update to Firestore
    try {
      const docRef = doc(db, DOC_PATH[0], DOC_PATH[1]);
      await setDoc(docRef, {
        ...updates,
        ...(backendResult?.data?.logo ? { logo: backendResult.data.logo } : {}),
        ...(backendResult?.data?.ceo_photo ? { ceo_photo: backendResult.data.ceo_photo } : {}),
        updatedAt: serverTimestamp()
      }, { merge: true });

      return {
        success: true,
        message: 'Company profile updated successfully',
        data: { ...updates, ...(backendResult?.data || {}) }
      };
    } catch (fsErr) {
      console.error('Firestore company profile update error:', fsErr);
      throw new Error('Failed to update company profile');
    }
  }
};
