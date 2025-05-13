
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error);
      }
      
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        toast.error(error.message);
      } else {
        toast.success('Login realizado com sucesso!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao fazer login';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        toast.error(error.message);
      } else {
        toast.success('Cadastro realizado com sucesso! Verifique seu email.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao fazer cadastro';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        toast.error(error.message);
      } else {
        toast.success('Logout realizado com sucesso!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao fazer logout';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      signIn,
      signUp,
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
