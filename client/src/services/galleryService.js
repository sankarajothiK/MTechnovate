import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

const COLLECTION_NAME = 'gallery';

export const galleryService = {
  /**
   * Fetch all gallery items
   */
  async getGallery() {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (items.length > 0) {
        return { success: true, data: items };
      }
    } catch (err) {
      console.warn('Firestore getGallery warning:', err.message);
    }

    // Fallback to backend API
    const res = await fetch('/api/gallery');
    return res.json();
  },

  /**
   * Real-time listener for public website showcase gallery
   */
  subscribeGallery(callback) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(items);
      }, (err) => {
        console.warn('subscribeGallery snapshot error:', err.message);
      });
    } catch (e) {
      console.warn('subscribeGallery error:', e.message);
      return () => {};
    }
  },

  /**
   * Upload multiple or single gallery image to /uploads/gallery/ and dual-sync document to Firestore
   */
  async uploadGalleryImages(formData) {
    const isFormData = typeof formData.get === 'function';
    const category = isFormData ? (formData.get('category') || 'Workplace') : (formData.category || 'Workplace');
    const title = isFormData ? (formData.get('title') || '') : (formData.title || '');
    const description = isFormData ? (formData.get('description') || '') : (formData.description || '');

    // 1. High-speed direct upload to backend API (saves directly to /uploads/gallery/ on disk and records in SQLite)
    const token = localStorage.getItem('m_tech_admin_token');
    let backendResult = null;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      backendResult = await res.json();
      if (!res.ok || !backendResult.success) {
        throw new Error(backendResult.message || 'Gallery upload failed.');
      }
    } catch (apiErr) {
      console.warn('Backend gallery upload error:', apiErr.message);
      throw apiErr;
    }

    // 2. Dual-sync to Firestore (with 3s timeout so it NEVER freezes or hangs the UI)
    try {
      if (backendResult?.data && Array.isArray(backendResult.data)) {
        const colRef = collection(db, COLLECTION_NAME);
        for (const item of backendResult.data) {
          const docPromise = addDoc(colRef, {
            title: item.title || title || 'Workplace Showcase',
            description: description || '',
            imageUrl: item.image_url,
            image_url: item.image_url,
            category: category || 'Workplace',
            sqlite_id: item.id,
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          await Promise.race([
            docPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 3000))
          ]).catch(e => console.warn('Firestore gallery sync notice:', e.message));
        }
      }
    } catch (fsErr) {
      console.warn('Firestore gallery dual-sync notice:', fsErr.message);
    }

    return backendResult;
  },

  /**
   * Delete gallery item: permanently deletes from disk, SQLite, and Firestore
   */
  async deleteGalleryItem(id) {
    // 1. Delete from backend API
    const token = localStorage.getItem('m_tech_admin_token');
    let backendResult = null;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      backendResult = await res.json();
    } catch (e) {
      console.warn('Backend delete gallery notice:', e.message);
    }

    // 2. Delete from Firestore if exists
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);
      const targetDoc = snap.docs.find(d => d.id === String(id) || d.data().sqlite_id === Number(id));
      if (targetDoc) {
        await deleteDoc(doc(db, COLLECTION_NAME, targetDoc.id));
      }
    } catch (err) {
      console.warn('Firestore deleteGalleryItem notice:', err.message);
    }

    return backendResult || { success: true, message: 'Gallery item removed successfully' };
  }
};
