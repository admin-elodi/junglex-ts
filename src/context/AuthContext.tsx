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
  }) => Promise<{ confirmed: boolean }>;
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

    // If email confirmation is required, Supabase creates the account but
    // does NOT issue a session yet — the account is not actually
    // authenticated until the link is clicked. Setting `user` here anyway
    // would show a false "logged in" state where every RLS-protected write
    // (like posting) fails, because auth.uid() is null server-side. So we
    // only update local state if a real session came back; onAuthStateChange
    // above handles it for us in that case.
    return { confirmed: !!data.session };
  };

  // 🔐 SIGN IN
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    // onAuthStateChange picks up the resulting session automatically.
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
