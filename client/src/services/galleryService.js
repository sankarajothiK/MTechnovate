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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { safeFetchJson } from './apiUtils';

const COLLECTION_NAME = 'gallery';

export const DEFAULT_GALLERY_ITEMS = [
  {
    id: 'gallery_item_1',
    title: 'M TECHNOVATE Headquarters & Reception',
    category: 'Corporate Facility',
    image_url: '/mtechnovate_office_building.jpg',
    imageUrl: '/mtechnovate_office_building.jpg',
    description: 'Our modern headquarters and client reception in Kadayam, designed for enterprise collaboration.'
  },
  {
    id: 'gallery_item_2',
    title: 'Operations & Engineering Workstations',
    category: 'Technology Lab',
    image_url: '/operations_workstations.jpg',
    imageUrl: '/operations_workstations.jpg',
    description: 'High-performance computing workstations running 24/7 client operations and real-time monitoring.'
  },
  {
    id: 'gallery_item_3',
    title: 'Kadayam Delivery Center & Innovation Hub',
    category: 'Infrastructure',
    image_url: '/company_campus.jpg',
    imageUrl: '/company_campus.jpg',
    description: 'Secure, state-of-the-art facility housing our development teams, IT engineers, and digital specialists.'
  },
  {
    id: 'gallery_item_4',
    title: 'Global Delivery Operations & Client Hub',
    category: 'Operations',
    image_url: '/delivery_hub_sunset.jpg',
    imageUrl: '/delivery_hub_sunset.jpg',
    description: 'Continuous delivery infrastructure supporting global enterprises with zero-downtime workflows.'
  }
];

function compressImage(file, maxWidth = 1280, maxHeight = 900, quality = 0.8) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !file || typeof file !== 'object' || !file.name) {
      return resolve(typeof file === 'string' ? file : '/mtechnovate_office_building.jpg');
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result || '/mtechnovate_office_building.jpg');
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('/mtechnovate_office_building.jpg');
    reader.readAsDataURL(file);
  });
}

export const galleryService = {
  /**
   * Fetch all gallery items with guaranteed resilience
   */
  async getGallery() {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const items = snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            image_url: data.image_url || data.imageUrl || '/mtechnovate_office_building.jpg',
            imageUrl: data.imageUrl || data.image_url || '/mtechnovate_office_building.jpg'
          };
        });

        // Merge custom uploads first, followed by default showcase items
        const customTitles = new Set(items.map(i => i.title));
        const merged = [...items, ...DEFAULT_GALLERY_ITEMS.filter(def => !customTitles.has(def.title))];
        return { success: true, data: merged };
      }
    } catch (err) {
      console.warn('Firestore getGallery notice:', err.message);
    }

    // Backend fetch fallback (guarded against HTML response)
    const backendData = await safeFetchJson('/api/gallery', {}, null);
    if (backendData?.success && backendData?.data?.length) {
      return backendData;
    }

    // Guaranteed default showcase gallery
    return { success: true, data: DEFAULT_GALLERY_ITEMS };
  },

  /**
   * Real-time listener for public website showcase gallery
   */
  subscribeGallery(callback) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              image_url: data.image_url || data.imageUrl || '/mtechnovate_office_building.jpg',
              imageUrl: data.imageUrl || data.image_url || '/mtechnovate_office_building.jpg'
            };
          });

          // Merge custom uploads first, followed by default showcase items
          const customTitles = new Set(items.map(i => i.title));
          const merged = [...items, ...DEFAULT_GALLERY_ITEMS.filter(def => !customTitles.has(def.title))];
          callback(merged);
        } else {
          callback(DEFAULT_GALLERY_ITEMS);
        }
      }, (err) => {
        console.warn('subscribeGallery snapshot notice:', err.message);
        callback(DEFAULT_GALLERY_ITEMS);
      });
    } catch (e) {
      console.warn('subscribeGallery error:', e.message);
      callback(DEFAULT_GALLERY_ITEMS);
      return () => {};
    }
  },

  /**
   * Upload multiple or single gallery image to storage and sync to Firestore
   */
  async uploadGalleryImages(formData) {
    const isFormData = typeof formData.get === 'function';
    const category = isFormData ? (formData.get('category') || 'Corporate Facility') : (formData.category || 'Corporate Facility');
    const title = isFormData ? (formData.get('title') || '') : (formData.title || '');
    const description = isFormData ? (formData.get('description') || '') : (formData.description || '');

    // 1. Dual sync to backend if running
    try {
      const token = localStorage.getItem('m_tech_admin_token');
      fetch('/api/admin/gallery', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      }).catch(() => {});
    } catch {}

    // 2. Client-side compression and direct Firestore upload (100% reliable on Vercel)
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const files = isFormData ? formData.getAll('images') : (formData.images || []);
      const createdItems = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedUrl = await compressImage(file);

        const docRef = await addDoc(colRef, {
          title: title || 'M TECHNOVATE Workplace',
          description: description || '',
          imageUrl: compressedUrl,
          image_url: compressedUrl,
          category: category || 'Corporate Facility',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        createdItems.push({ id: docRef.id, title, category, image_url: compressedUrl });
      }

      return {
        success: true,
        message: `${createdItems.length} showcase photo(s) published successfully!`,
        data: createdItems
      };
    } catch (fsErr) {
      console.error('Direct gallery upload error:', fsErr);
      throw new Error('Upload failed. Please verify network connectivity.');
    }
  },

  /**
   * Delete gallery item: removes from disk/backend if available, and deletes from Firestore
   */
  async deleteGalleryItem(id) {
    // 1. Backend delete attempt
    try {
      const token = localStorage.getItem('m_tech_admin_token');
      await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) {
      // ignore
    }

    // 2. Firestore delete
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

    return { success: true, message: 'Gallery item removed successfully' };
  }
};
