
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { 
  Bell, 
  HelpCircle, 
  Sun, 
  Moon,
  Menu,
  LogOut
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from '@/hooks/use-auth';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Try to safely access the sidebar context
  let sidebarContext = null;
  try {
    sidebarContext = useSidebar();
  } catch (error) {
    // The component might be rendered outside of a SidebarProvider
    // We'll handle this case by not showing the sidebar trigger
    console.log("Header rendered outside SidebarProvider context");
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = () => {
    if (profile?.nome) {
      const nameParts = profile.nome.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return profile.nome.substring(0, 2).toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          {sidebarContext && (
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-medium text-sm">Notificações</div>
              <div className="p-4 text-center text-muted-foreground text-sm">
                Você não tem novas notificações
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.nome || "Usuário"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
