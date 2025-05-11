
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Truck,
  Settings,
  LogOut,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const MainSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Processos",
      icon: FileText,
      path: "/processes",
    },
    {
      title: "Clientes",
      icon: Users,
      path: "/clients",
    },
    {
      title: "Entregas",
      icon: Truck,
      path: "/deliveries",
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-4 flex items-center justify-center">
        <div className="flex items-center px-2">
          <h1 className="text-xl font-semibold text-primary">
            VeícSys
          </h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={location.pathname === item.path}
              >
                <Link to={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="pt-2 mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sair">
              <Link to="/login">
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
