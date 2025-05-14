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
import Login from "./pages/Login";
import Signup from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPedidos from "./pages/admin/Pedidos";
import AdminEstoque from "./pages/admin/Estoque";
import AdminClientes from "./pages/admin/Clientes";
import AdminVendedores from "./pages/admin/Vendedores";
import AdminCadastrarVendedor from "./pages/admin/CadastrarVendedor";
import AdminCadastrarCliente from "./pages/admin/CadastrarCliente";

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
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
            
            {/* Protected Routes - Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="estoque" element={<AdminEstoque />} />
              <Route path="clientes" element={<AdminClientes />} />
              <Route path="clientes/cadastrar" element={<AdminCadastrarCliente />} />
              <Route path="vendedores" element={<AdminVendedores />} />
              <Route path="vendedores/cadastrar" element={<AdminCadastrarVendedor />} />
            </Route>
            
            {/* Protected Routes - Cliente */}
            <Route path="/cliente" element={<ProtectedRoute allowedRoles={['cliente']}><ClienteLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/cliente/dashboard" />} />
              <Route path="dashboard" element={<ClienteDashboard />} />
              <Route path="pedidos" element={<ClientePedidos />} />
              <Route path="produtos" element={<ClienteProdutos />} />
              <Route path="suporte" element={<ClienteSuporte />} />
            </Route>
            
            {/* Protected Routes - Vendedor */}
            <Route path="/vendedor" element={<ProtectedRoute allowedRoles={['vendedor']}><VendedorLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/vendedor/dashboard" />} />
              <Route path="dashboard" element={<VendedorDashboard />} />
              <Route path="clientes" element={<VendedorClientes />} />
              <Route path="clientes/cadastrar" element={<VendedorCadastrarCliente />} />
              <Route path="vendas" element={<VendedorVendas />} />
              <Route path="estoque" element={<VendedorEstoque />} />
            </Route>
            
            {/* Default Dashboard (for backward compatibility) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
            </Route>
            
            {/* Special Routes */}
            <Route path="/dashboard/vendedor" element={
              <ProtectedRoute allowedRoles={['vendedor']}>
                <Navigate to="/vendedor/dashboard" replace />
              </ProtectedRoute>
            } />
            
            {/* Public Home */}
            <Route path="/public/:tenantId" element={<PublicHome />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
