
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import VendedorLayout from "./layouts/VendedorLayout";
import ClienteLayout from "./layouts/ClienteLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login"; 
import Signup from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPedidos from "./pages/admin/Pedidos";
import AdminEstoque from "./pages/admin/Estoque";
import AdminClientes from "./pages/admin/Clientes";
import AdminVendedores from "./pages/admin/Vendedores";
import AdminCadastrarVendedor from "./pages/admin/CadastrarVendedor";
import AdminCadastrarCliente from "./pages/admin/CadastrarCliente";
import CriarPedido from "./pages/admin/CriarPedido";
import Servicos from "./pages/admin/Servicos";

// Cliente Pages
import ClienteDashboard from "./pages/cliente/Dashboard";
import ClientePedidos from "./pages/cliente/Pedidos";
import ClienteProdutos from "./pages/cliente/Produtos";
import ClienteSuporte from "./pages/cliente/Suporte";

// Vendedor Pages
import VendedorDashboard from "./pages/vendedor/Dashboard";
import VendedorClientes from "./pages/vendedor/Clientes";
import VendedorCadastrarCliente from "./pages/vendedor/CadastrarCliente";
import VendedorVendas from "./pages/vendedor/Vendas";
import VendedorEstoque from "./pages/vendedor/Estoque";

// Other
import Dashboard from "./pages/Dashboard";
import PublicHome from "./pages/PublicHome";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/use-theme";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/use-auth";
import { supabase } from "./integrations/supabase/client";

// Create a new QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduced retry attempts
      refetchOnWindowFocus: false, 
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes (was cacheTime in v4, renamed to gcTime in v5)
    },
  },
});

const App = () => {
  const { user, isLoading, profile } = useAuth();
  
  useEffect(() => {
    // Log auth state for debugging
    const logAuthState = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current auth session:", data);
      console.log("Current user profile:", profile);
    };
    
    logAuthState();
    
    // Set up interval to periodically check auth state
    const checkInterval = setInterval(logAuthState, 60000); // Check every minute
    
    return () => {
      clearInterval(checkInterval);
    };
  }, [profile]);

  // Simple app-level loading indicator
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-lg">Iniciando aplicação...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes - Admin */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="pedidos/criar" element={<CriarPedido />} />
                <Route path="estoque" element={<AdminEstoque />} />
                <Route path="servicos" element={<Servicos />} />
                <Route path="clientes" element={<AdminClientes />} />
                <Route path="clientes/cadastrar" element={<AdminCadastrarCliente />} />
                <Route path="vendedores" element={<AdminVendedores />} />
                <Route path="vendedores/cadastrar" element={<AdminCadastrarVendedor />} />
              </Route>
              
              {/* Protected Routes - Cliente */}
              <Route path="/cliente" element={<ProtectedRoute allowedRoles={['fisica', 'juridica']}><ClienteLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/cliente/dashboard" replace />} />
                <Route path="dashboard" element={<ClienteDashboard />} />
                <Route path="pedidos" element={<ClientePedidos />} />
                <Route path="produtos" element={<ClienteProdutos />} />
                <Route path="suporte" element={<ClienteSuporte />} />
              </Route>
              
              {/* Protected Routes - Vendedor */}
              <Route path="/vendedor" element={<ProtectedRoute allowedRoles={['vendedor']}><VendedorLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/vendedor/dashboard" replace />} />
                <Route path="dashboard" element={<VendedorDashboard />} />
                <Route path="clientes" element={<VendedorClientes />} />
                <Route path="clientes/cadastrar" element={<VendedorCadastrarCliente />} />
                <Route path="vendas" element={<VendedorVendas />} />
                <Route path="estoque" element={<VendedorEstoque />} />
              </Route>
              
              {/* Default Dashboard - Redirects based on role */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    {/* This dynamically redirects based on user role */}
                    {user && profile ? (
                      profile.tipo === 'admin' ? (
                        <Navigate to="/admin/dashboard" replace />
                      ) : profile.tipo === 'vendedor' ? (
                        <Navigate to="/vendedor/dashboard" replace />
                      ) : ['fisica', 'juridica'].includes(profile.tipo) ? (
                        <Navigate to="/cliente/dashboard" replace />
                      ) : <DashboardLayout />
                    ) : <DashboardLayout />}
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* Redirect legacy routes */}
              <Route path="/processes" element={<Navigate to="/cliente/pedidos" replace />} />
              
              {/* Public Home */}
              <Route path="/public/:tenantId" element={<PublicHome />} />
              
              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
