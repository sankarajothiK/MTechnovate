import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'services';

export const serviceService = {
  /**
   * Fetch all services ordered by display_order
   */
  async getServices() {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = query(colRef, orderBy('display_order', 'asc'));
      const snap = await getDocs(q);
      const services = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (services.length > 0) {
        return { success: true, data: services };
      }
    } catch (err) {
      console.warn('Firestore getServices fallback:', err.message);
    }

    const res = await fetch('/api/services');
    return res.json();
  },

  /**
   * Real-time listener for public services section
   */
  subscribeServices(callback) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = query(colRef, orderBy('display_order', 'asc'));
      return onSnapshot(q, (snapshot) => {
        const services = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(services);
      }, (err) => {
        console.warn('subscribeServices snapshot error:', err.message);
      });
    } catch (e) {
      console.warn('subscribeServices error:', e.message);
      return () => {};
    }
  },

  /**
   * Create new service
   */
  async createService(data) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const docRef = await addDoc(colRef, {
        title: data.title?.trim() || '',
        slug: (data.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: data.icon || 'Layers',
        short_desc: data.short_desc || '',
        detailed_desc: data.detailed_desc || '',
        tech_tags: Array.isArray(data.tech_tags) ? data.tech_tags : (typeof data.tech_tags === 'string' ? JSON.parse(data.tech_tags || '[]') : []),
        featured: data.featured ?? 1,
        display_order: Number(data.display_order) || 1,
        is_active: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      // Dual-sync to backend SQLite API
      const token = localStorage.getItem('m_tech_admin_token');
      if (token) {
        fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data)
        }).catch(e => console.warn('SQLite backend sync notice for createService:', e.message));
      }

      return { success: true, id: docRef.id, message: 'Service created in Firebase' };
    } catch (err) {
      console.warn('Firestore createService fallback:', err.message);
      const token = localStorage.getItem('m_tech_admin_token');
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  /**
   * Update service
   */
  async updateService(id, data) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      // Dual-sync to backend SQLite API
      const token = localStorage.getItem('m_tech_admin_token');
      if (token && !isNaN(Number(id))) {
        fetch(`/api/admin/services/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data)
        }).catch(e => console.warn('SQLite backend sync notice for updateService:', e.message));
      }

      return { success: true, message: 'Service updated in Firebase' };
    } catch (err) {
      console.warn('Firestore updateService fallback:', err.message);
      const token = localStorage.getItem('m_tech_admin_token');
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  /**
   * Delete service
   */
  async deleteService(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, String(id));
      await deleteDoc(docRef);

      // Dual-sync to backend SQLite API
      const token = localStorage.getItem('m_tech_admin_token');
      if (token && !isNaN(Number(id))) {
        fetch(`/api/admin/services/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(e => console.warn('SQLite backend sync notice for deleteService:', e.message));
      }

      return { success: true, message: 'Service deleted from Firebase' };
    } catch (err) {
      console.warn('Firestore deleteService fallback:', err.message);
      const token = localStorage.getItem('m_tech_admin_token');
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return res.json();
    }
  }
};
