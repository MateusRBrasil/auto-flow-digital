
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const SidebarContent: React.FC = () => {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const expanded = state === "expanded";

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col border-r bg-background transition-all duration-300 ease-in-out',
        expanded ? 'w-64 max-w-64' : 'w-16 max-w-16'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">V</span>
          </div>
          {expanded && (
            <span className="font-semibold text-lg">VeícSys</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          <NavLink
            to="/vendedor/dashboard"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            {expanded && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/vendedor/clientes"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Users className="h-5 w-5" />
            {expanded && <span>Clientes</span>}
          </NavLink>

          <NavLink
            to="/vendedor/vendas"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <ShoppingCart className="h-5 w-5" />
            {expanded && <span>Vendas</span>}
          </NavLink>

          <NavLink
            to="/vendedor/estoque"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Package className="h-5 w-5" />
            {expanded && <span>Estoque</span>}
          </NavLink>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <button
            onClick={() => signOut()}
            className={cn(
              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
              'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            {expanded && <span>Sair</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

// This wrapper component ensures the sidebar is always used with a SidebarProvider
const VendedorSidebar: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Avoid hydration mismatch by rendering only after component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  // We need to check if we're already inside a SidebarProvider
  // Since we can't directly check that, we'll catch the error and render with provider if needed
  try {
    // Try to use the hook - this will throw if not in a provider
    useSidebar();
    // If we get here, we're already in a provider
    return <SidebarContent />;
  } catch (e) {
    // If we catch an error, we need to provide our own provider
    return (
      <SidebarProvider>
        <SidebarContent />
      </SidebarProvider>
    );
  }
};

export default VendedorSidebar;
