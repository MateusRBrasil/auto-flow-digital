
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVendas from "./pages/admin/Vendas";
import AdminEstoque from "./pages/admin/Estoque";
import AdminClientes from "./pages/admin/Clientes";
import AdminVendedores from "./pages/admin/Vendedores";
import AdminConfiguracoes from "./pages/admin/Configuracoes";
import Usuarios from "./pages/Usuarios";
import NovoUsuario from "./pages/usuarios/Novo";
import VendedorDashboard from "./pages/dashboard/Vendedor";
import PublicHome from "./pages/PublicHome";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/use-theme";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

const App = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Carregando...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              
              {/* Protected Routes - Admin */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="vendas" element={<AdminVendas />} />
                <Route path="estoque" element={<AdminEstoque />} />
                <Route path="clientes" element={<AdminClientes />} />
                <Route path="vendedores" element={<AdminVendedores />} />
                <Route path="configuracoes" element={<AdminConfiguracoes />} />
              </Route>
              
              {/* Protected Routes - User Management */}
              <Route path="/usuarios" element={<ProtectedRoute allowedRoles={['admin']}><Usuarios /></ProtectedRoute>} />
              <Route path="/usuarios/novo" element={<ProtectedRoute allowedRoles={['admin']}><NovoUsuario /></ProtectedRoute>} />
              
              {/* Protected Routes - Vendedor */}
              <Route path="/dashboard/vendedor" element={<ProtectedRoute allowedRoles={['vendedor']}><VendedorDashboard /></ProtectedRoute>} />
              
              {/* Protected Routes - Other */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* Public Home */}
              <Route path="/public/:tenantId" element={<PublicHome />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
