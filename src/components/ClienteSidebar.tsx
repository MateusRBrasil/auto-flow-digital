
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package2, 
  HelpCircle,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function ClienteSidebar() {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const initials = profile?.nome
    ? profile.nome.split(' ')
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : "C";
        
  const tipoCliente = profile?.tipo === 'fisica' 
    ? 'Pessoa Física' 
    : profile?.tipo === 'juridica' 
      ? 'Pessoa Jurídica' 
      : '';

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-md h-8 w-8 flex items-center justify-center text-primary-foreground font-semibold">
            V
          </div>
          <span className="text-lg font-semibold">VeicSys</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/cliente/dashboard")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/cliente/pedidos")}>
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Pedidos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/cliente/produtos")}>
                <Package2 className="mr-2 h-4 w-4" />
                <span>Produtos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/cliente/suporte")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Suporte</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/cliente/configuracoes')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <div className="mt-4 px-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5 text-sm">
                    <p className="font-medium">{profile?.nome}</p>
                    <p className="text-xs text-muted-foreground">{tipoCliente}</p>
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
