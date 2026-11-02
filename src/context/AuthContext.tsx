import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  isFirebaseConfigured: boolean;
  isSupabaseConfigured: boolean; // Alias for backward compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if current user is an authorized admin
  const checkAdminStatus = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser || !currentUser.email) return false;

    const configuredAdminEmail = (
      import.meta.env.VITE_ADMIN_EMAIL || 'esarapubobby@gmail.com'
    ).toLowerCase().trim();

    const emailMatches = currentUser.email.toLowerCase().trim() === configuredAdminEmail;
    if (emailMatches) return true;

    if (!isFirebaseConfigured) return false;

    try {
      // Check admin_users collection in Firestore by UID
      const adminDocRef = doc(db, 'admin_users', currentUser.uid);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        const data = adminSnap.data();
        if (data && (data.role === 'admin' || data.role === 'superadmin')) {
          return true;
        }
      }
      return false;
    } catch {
      return emailMatches;
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Local dev session fallback
      const localAdminSession = localStorage.getItem('bobby_admin_session');
      if (localAdminSession) {
        try {
          const parsed = JSON.parse(localAdminSession);
          setUser(parsed.user);
          setIsAdmin(true);
        } catch {
          localStorage.removeItem('bobby_admin_session');
        }
      }
      setLoading(false);
      return;
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const authorized = await checkAdminStatus(currentUser);
        setUser(currentUser);
        setIsAdmin(authorized);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | null }> => {
    setLoading(true);

    if (!isFirebaseConfigured) {
      const targetEmail = (
        import.meta.env.VITE_ADMIN_EMAIL || 'esarapubobby@gmail.com'
      ).toLowerCase();
      if (email.toLowerCase().trim() === targetEmail) {
        const mockUser = {
          uid: 'dev-admin-user-id',
          email: targetEmail,
          displayName: 'Bobby Esarapu',
        } as unknown as User;
        setUser(mockUser);
        setIsAdmin(true);
        localStorage.setItem('bobby_admin_session', JSON.stringify({ user: mockUser }));
        setLoading(false);
        return { success: true, error: null };
      } else {
        setLoading(false);
        return {
          success: false,
          error: `Access restricted. Authorized administrator email is: ${targetEmail}`,
        };
      }
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isAuthAdmin = await checkAdminStatus(credential.user);

      if (!isAuthAdmin) {
        await firebaseSignOut(auth);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return {
          success: false,
          error:
            'Access denied: This email is authenticated, but is not registered as an authorized administrator for Bobby Esarapu Portfolio.',
        };
      }

      setUser(credential.user);
      setIsAdmin(true);
      setLoading(false);
      return { success: true, error: null };
    } catch (err: any) {
      setLoading(false);
      let friendlyMessage = 'Authentication failed. Please verify your credentials.';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please check your credentials in the Firebase Console.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Too many unsuccessful login attempts. Please wait a moment before trying again.';
      } else if (err.code === 'auth/user-disabled') {
        friendlyMessage = 'This administrator account has been disabled in the Firebase Console.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }

      return { success: false, error: friendlyMessage };
    }
  };

  const signOut = async () => {
    setLoading(true);
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Firebase signOut error:', err);
      }
    }
    localStorage.removeItem('bobby_admin_session');
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signIn,
        signOut,
        isFirebaseConfigured,
        isSupabaseConfigured: isFirebaseConfigured, // backward compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
