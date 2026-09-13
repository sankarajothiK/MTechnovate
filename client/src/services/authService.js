import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const TOKEN_KEY = 'm_tech_admin_token';
const ADMIN_USER_KEY = 'm_tech_admin_user';

export const authService = {
  /**
   * Sign in administrative user
   * Master Admin credentials: admin@mtechnovatesolutions.com / Kramesh4325@
   */
  async signIn(email, password) {
    const trimmedEmail = (email || '').trim();
    const normalizedEmail = trimmedEmail.toLowerCase();

    // 1. Direct Master Admin Authentication
    const isMasterAdmin = (
      (normalizedEmail === 'admin@mtechnovatesolutions.com' ||
       normalizedEmail === 'admin@mtechnovate.com' ||
       normalizedEmail === 'mtechnovatesolutions@gmail.com') &&
      password === 'Kramesh4325@'
    );

    if (isMasterAdmin) {
      const adminData = {
        id: 'admin_master_ramesh',
        email: 'admin@mtechnovatesolutions.com',
        name: 'RAMESH K (Founder & Managing Director)',
        role: 'superadmin'
      };
      const token = 'm_tech_master_' + btoa(adminData.email + ':' + Date.now());

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));

      // Attempt to sync/create admin record in Firestore without blocking login
      try {
        const adminDocRef = doc(db, 'admins', adminData.id);
        await setDoc(adminDocRef, {
          ...adminData,
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore master admin sync notice:', fsErr?.message);
      }

      return {
        success: true,
        token,
        admin: adminData
      };
    }

    // 2. Attempt Firebase Authentication (for standard Firebase registered admins)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      let adminData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || 'Administrator',
        role: 'superadmin'
      };

      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminDocRef);
        if (!adminSnap.exists()) {
          await setDoc(adminDocRef, {
            ...adminData,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
        } else {
          adminData = { ...adminData, ...adminSnap.data() };
          await setDoc(adminDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
      } catch (fsDocErr) {
        console.warn('Firestore admin profile fetch note:', fsDocErr);
      }

      localStorage.setItem(TOKEN_KEY, idToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));

      return {
        success: true,
        token: idToken,
        admin: adminData
      };
    } catch (firebaseErr) {
      console.warn('Firebase Auth sign-in fallback check:', firebaseErr?.message);

      // 3. Fallback: Verify through backend endpoint (safe on Vercel without crashing on HTML)
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password })
        });
        
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Invalid administrator credentials.');
        }

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Invalid administrator credentials.');
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
        return data;
      } catch (apiErr) {
        throw new Error(apiErr.message || 'Invalid administrator credentials.');
      }
    }
  },

  /**
   * Sign out current admin user
   */
  async signOut() {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Firebase signOut notice:', err.message);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },

  /**
   * Listen to auth state changes with instant local storage restoration
   */
  subscribeAuthState(callback) {
    // Immediately emit cached user to eliminate loading delays
    const cachedToken = localStorage.getItem(TOKEN_KEY);
    const cachedUser = localStorage.getItem(ADMIN_USER_KEY);
    if (cachedToken && cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        callback(parsed);
      } catch {
        // ignore
      }
    }

    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem(TOKEN_KEY, token);
          const cached = localStorage.getItem(ADMIN_USER_KEY);
          const admin = cached ? JSON.parse(cached) : {
            id: user.uid,
            email: user.email,
            name: user.displayName || 'Administrator',
            role: 'superadmin'
          };
          callback(admin);
        } catch {
          callback(null);
        }
      } else {
        // Check local token fallback (e.g. master admin credentials)
        const token = localStorage.getItem(TOKEN_KEY);
        const cached = localStorage.getItem(ADMIN_USER_KEY);
        if (token && cached) {
          try {
            callback(JSON.parse(cached));
          } catch {
            callback(null);
          }
        } else {
          callback(null);
        }
      }
    });
  },

  /**
   * Get current auth token
   */
  getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get cached admin user
   */
  getCurrentAdmin() {
    const cached = localStorage.getItem(ADMIN_USER_KEY);
    return cached ? JSON.parse(cached) : null;
  }
};
