import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: any;
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
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            setTimeout(async () => {
              const { data: profileData, error } = await supabase
                .from('perfis')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching user profile:', error);
                return;
              }
              
              setProfile(profileData);
            }, 0);
          } catch (error) {
            console.error('Error in auth state change:', error);
          }
        } else {
          setProfile(null);
        }
      }
    );

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
          } else {
            setProfile(profileData);
          }
        } catch (error) {
          console.error('Error in initialize auth:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const redirectUserBasedOnRole = () => {
    if (!profile) return;
    
    switch (profile.tipo) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'vendedor':
        navigate('/vendedor/dashboard');
        break;
      case 'cliente':
        navigate('/cliente/dashboard');
        break;
      default:
        navigate('/dashboard');
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
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else {
            setProfile(profileData);
            
            setTimeout(() => {
              redirectUserBasedOnRole();
            }, 100);
          }
        } catch (error) {
          console.error('Error fetching profile after login:', error);
        }
      }
      
      return true;
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
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate('/login');
  };

  const signUp = async (email: string, password: string) => {
    // Sign up logic here
  };

  const resetPassword = async (email: string) => {
    // Reset password logic here
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
