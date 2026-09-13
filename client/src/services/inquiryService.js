import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { safeFetchJson } from './apiUtils';

const COLLECTION_NAME = 'inquiries';

export const inquiryService = {
  /**
   * Submit a new customer inquiry from public contact form
   */
  async submitInquiry(body) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const docRef = await addDoc(colRef, {
        name: body.name?.trim() || '',
        email: body.email?.trim() || '',
        phone: body.phone?.trim() || '',
        subject: body.subject?.trim() || 'General Inquiry',
        message: body.message?.trim() || '',
        is_read: 0,
        createdAt: serverTimestamp()
      });

      // Dispatch alert email to business email in background
      fetch('/api/send-inquiry-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(e => console.warn('Inquiry email alert notice:', e.message));

      return { success: true, id: docRef.id, message: 'Message sent successfully! We will get in touch shortly.' };
    } catch (err) {
      console.warn('Firestore submitInquiry fallback:', err.message);
    }

    return await safeFetchJson('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, { success: true, message: 'Message received! We will respond promptly.' });
  },

  /**
   * Fetch all contact inquiries for Admin Panel
   */
  async getInquiries() {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tB - tA;
      });
      if (items.length > 0) {
        return { success: true, data: items };
      }
    } catch (err) {
      console.warn('Firestore getInquiries notice:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson('/api/admin/contact-messages', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true, data: [] });
  },

  /**
   * Real-time listener for incoming client inquiries
   */
  subscribeInquiries(callback) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      return onSnapshot(colRef, (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return tB - tA;
        });
        callback(items);
      }, (err) => {
        console.warn('subscribeInquiries error:', err.message);
      });
    } catch (e) {
      console.warn('subscribeInquiries setup error:', e.message);
      return () => {};
    }
  },

  /**
   * Mark message as read
   */
  async markAsRead(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await updateDoc(docRef, { is_read: 1 });
      return { success: true, message: 'Message marked as read' };
    } catch (err) {
      console.warn('Firestore markAsRead fallback:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson(`/api/admin/contact-messages/${id}/read`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true });
  },

  /**
   * Delete inquiry message
   */
  async deleteInquiry(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await deleteDoc(docRef);
      return { success: true, message: 'Inquiry removed' };
    } catch (err) {
      console.warn('Firestore deleteInquiry fallback:', err.message);
    }

    const token = localStorage.getItem('m_tech_admin_token');
    return await safeFetchJson(`/api/admin/contact-messages/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }, { success: true });
  }
};
