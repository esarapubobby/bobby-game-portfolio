import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if current user is an authorized admin in Supabase
  const checkAdminStatus = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) return false;
    
    // Check against configured admin email first (fast check)
    const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'esarapubobby@gmail.com';
    const emailMatches = currentUser.email?.toLowerCase() === configuredAdminEmail.toLowerCase();

    if (!isSupabaseConfigured) {
      // Local dev fallback mode
      return emailMatches;
    }

    try {
      // Check admin_users table in Supabase
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        // Fallback to email match if table is not yet created
        return emailMatches;
      }

      return Boolean(data && (data.role === 'admin' || data.role === 'superadmin')) || emailMatches;
    } catch {
      return emailMatches;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check if local dev session exists in localStorage for immediate evaluation
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

    // Supabase auth subscription
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const admin = await checkAdminStatus(session.user);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const admin = await checkAdminStatus(session.user);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error: string | null }> => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      // When Supabase credentials are not yet configured in .env,
      // allow Bobby to test the admin panel using his registered email
      const targetEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'esarapubobby@gmail.com').toLowerCase();
      if (email.toLowerCase().trim() === targetEmail) {
        const mockUser: User = {
          id: 'dev-admin-user-id',
          app_metadata: {},
          user_metadata: { name: 'Bobby Esarapu' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: targetEmail,
        };
        setUser(mockUser);
        setIsAdmin(true);
        localStorage.setItem('bobby_admin_session', JSON.stringify({ user: mockUser }));
        setLoading(false);
        return { success: true, error: null };
      } else {
        setLoading(false);
        return {
          success: false,
          error: `Access restricted. Initial administrator email is: ${targetEmail}`,
        };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const admin = await checkAdminStatus(data.user);
        if (!admin) {
          await supabase.auth.signOut();
          setLoading(false);
          return {
            success: false,
            error: 'Access denied: This user account is not registered as an administrator in the database.',
          };
        }
        setUser(data.user);
        setSession(data.session);
        setIsAdmin(true);
      }

      setLoading(false);
      return { success: true, error: null };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('bobby_admin_session');
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signOut,
        isSupabaseConfigured,
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
