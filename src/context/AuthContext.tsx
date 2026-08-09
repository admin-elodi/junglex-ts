import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@lib/supabase';

type AuthContextType = {
  user: any;
  loading: boolean;
  signUp: (data: {
    email: string;
    password: string;
    username: string;
    spiritAnimal: string;
  }) => Promise<void>;
  signIn: (data: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Persist session
  useEffect(() => {
    // Resolve whatever session already exists (page refresh, etc.) before
    // route guards make any redirect decisions.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔐 SIGN UP
  const signUp = async ({
    email,
    password,
    username,
    spiritAnimal,
  }: {
    email: string;
    password: string;
    username: string;
    spiritAnimal: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          spirit_animal: spiritAnimal,
        },
      },
    });

    if (error) throw error;

    setUser(data.user);
  };

  // 🔐 SIGN IN
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
  };

  // 🚪 SIGN OUT
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ✉️ RESEND CONFIRMATION EMAIL
  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resendConfirmation }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧠 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
