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
   * Sign in administrative user via Firebase Auth (with fallback to backend API verification)
   */
  async signIn(email, password) {
    const trimmedEmail = email.trim();
    try {
      // 1. Attempt Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Ensure admin document exists in Firestore
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminDocRef);

      let adminData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || 'Ramesh K (Admin)',
        role: 'superadmin'
      };

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

      localStorage.setItem(TOKEN_KEY, idToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));

      return {
        success: true,
        token: idToken,
        admin: adminData
      };
    } catch (firebaseErr) {
      console.warn('Firebase Auth direct sign-in fallback check:', firebaseErr.message);

      // Fallback: Verify through the backend endpoint for seamless transition
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || firebaseErr.message || 'Authentication failed');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
      return data;
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
   * Listen to Firebase auth state changes
   */
  subscribeAuthState(callback) {
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
        // Check local token fallback
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
