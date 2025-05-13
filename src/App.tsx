
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Processes from "./pages/Processes";
import Clients from "./pages/Clients";
import Deliveries from "./pages/Deliveries";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";
import TenantSettings from "./pages/TenantSettings";
import PublicHome from "./pages/PublicHome";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./hooks/use-auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/public/:tenantId" element={<PublicHome />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/processes" element={<Processes />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/deliveries" element={<Deliveries />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/tenant-settings" element={<TenantSettings />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
