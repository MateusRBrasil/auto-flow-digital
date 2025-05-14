
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

interface User {
  id: string;
  email: string | undefined;
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
        if (session?.user) {
          // Convert Supabase User to our User type
          setUser({
            id: session.user.id,
            email: session.user.email
          });
          
          try {
            // Use setTimeout to avoid recursive auth state changes
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
          setUser(null);
          setProfile(null);
        }
      }
    );

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Convert Supabase User to our User type
        setUser({
          id: session.user.id,
          email: session.user.email
        });
        
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
      } else {
        setUser(null);
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
            
            // Redirect based on role
            setTimeout(() => {
              switch (profileData.tipo) {
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
    navigate('/login', { replace: true });
  };

  const signUp = async (email: string, password: string) => {
    // Sign up logic here
    return false; // Placeholder return to match the Promise<boolean> return type
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
