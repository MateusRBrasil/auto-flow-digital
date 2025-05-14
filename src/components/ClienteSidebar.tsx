
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard,
  FileText,
  ShoppingBag,
  LifeBuoy,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const ClienteSidebar: React.FC = () => {
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
            to="/cliente/dashboard"
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
            to="/cliente/pedidos"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <FileText className="h-5 w-5" />
            {expanded && <span>Meus Pedidos</span>}
          </NavLink>

          <NavLink
            to="/cliente/produtos"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <ShoppingBag className="h-5 w-5" />
            {expanded && <span>Produtos</span>}
          </NavLink>

          <NavLink
            to="/cliente/suporte"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <LifeBuoy className="h-5 w-5" />
            {expanded && <span>Suporte</span>}
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

export default ClienteSidebar;
