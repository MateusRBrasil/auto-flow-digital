import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type ProfileTipo = "admin" | "vendedor" | "avulso" | "despachante";

interface User {
  id: string;
  email: string | undefined;
}

interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  documento: string | null;
  tipo: ProfileTipo;
  created_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  redirectUserBasedOnRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // This prevents infinite redirects by tracking if auth is initialized
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info("Auth state changed:", event, session ? "User present" : "No user");
        
        if (session?.user) {
          // Convert Supabase User to our User type
          setUser({
            id: session.user.id,
            email: session.user.email
          });
          
          // Use setTimeout to avoid blocking the auth state change
          // This prevents recursion and race conditions
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('perfis')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching user profile:', error);
                setProfile(null);
              } else {
                setProfile(profileData as Profile);
              }
            } catch (error) {
              console.error('Error in profile fetch:', error);
              setProfile(null);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Convert Supabase User to our User type
          setUser({
            id: session.user.id,
            email: session.user.email
          });
          
          const { data: profileData, error } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            setProfile(null);
          } else {
            setProfile(profileData as Profile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
        setIsAuthInitialized(true); // Mark auth as initialized
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const redirectUserBasedOnRole = () => {
    if (!profile) {
      navigate('/login', { replace: true });
      return;
    }
    
    switch (profile.tipo) {
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'vendedor':
        navigate('/vendedor/dashboard', { replace: true });
        break;
      case 'avulso':
      case 'despachante':
        navigate('/cliente/dashboard', { replace: true });
        break;
      default:
        navigate('/dashboard', { replace: true });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data.user) {
        // Success is handled by the auth state change listener
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Erro ao entrar",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive"
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state change listener will handle the rest
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair.",
        variant: "destructive"
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Erro ao cadastrar",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso. Verifique seu e-mail para confirmar.",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao tentar criar sua conta.",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "E-mail enviado",
        description: "Verifique seu e-mail para redefinir sua senha.",
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro ao tentar redefinir sua senha.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signOut,
        signUp,
        resetPassword,
        redirectUserBasedOnRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
