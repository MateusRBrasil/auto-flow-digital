
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard,
  ShoppingCart, 
  Package, 
  Users, 
  UserCog,
  Settings 
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
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
            to="/admin/dashboard"
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
            to="/admin/vendas"
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
            to="/admin/estoque"
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

          <NavLink
            to="/admin/clientes"
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
            to="/admin/vendedores"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <UserCog className="h-5 w-5" />
            {expanded && <span>Vendedores</span>}
          </NavLink>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <NavLink
            to="/usuarios"
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
            {expanded && <span>Usuários</span>}
          </NavLink>

          <NavLink
            to="/admin/configuracoes"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Settings className="h-5 w-5" />
            {expanded && <span>Configurações</span>}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
