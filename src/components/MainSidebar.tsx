
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function MainSidebar() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const initials = profile?.nome
    ? profile.nome.split(' ')
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : "U";

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
        {/* Main menu content will be different for each user type */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  onClick={() => navigate('/dashboard')}
                >
                  <button>Dashboard</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
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
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
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
                    <p className="text-xs text-muted-foreground">
                      {profile?.tipo === 'admin' ? 'Administrador' : 
                      profile?.tipo === 'vendedor' ? 'Vendedor' : 
                      profile?.tipo === 'fisica' ? 'Pessoa Física' : 
                      profile?.tipo === 'juridica' ? 'Pessoa Jurídica' : ''}
                    </p>
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
