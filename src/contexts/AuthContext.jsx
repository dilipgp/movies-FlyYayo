import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext({ user: null, session: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile via API route
  const fetchProfile = async (token) => {
    if (!token) return null;
    
    try {
      const res = await fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        console.error('Failed to fetch profile');
        return null;
      }
      
      const data = await res.json();
      return data.profile;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.access_token) {
        const userProfile = await fetchProfile(session.access_token);
        setProfile(userProfile);
      }
      
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.access_token) {
        const userProfile = await fetchProfile(session.access_token);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear local state immediately for instant UI feedback
    setUser(null);
    setSession(null);
    setProfile(null);
    
    // Sign out from Supabase in background (don't wait for it)
    supabase.auth.signOut().catch(err => {
      console.error('Background signOut error:', err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
