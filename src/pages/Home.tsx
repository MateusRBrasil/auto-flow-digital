
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Home = () => {
  const { user, profile, isLoading } = useAuth();

  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <div className="flex gap-2">
          <Button variant="outline" disabled>Carregando...</Button>
        </div>
      );
    }

    if (user) {
      // User is logged in, show correct dashboard link based on role
      const userRole = profile?.tipo || 'cliente';
      let dashboardPath = '/dashboard';
      
      if (userRole === 'admin') {
        dashboardPath = '/admin/dashboard';
      } else if (userRole === 'vendedor') {
        dashboardPath = '/dashboard/vendedor';
      }
      
      return (
        <div className="flex gap-2">
          <Button asChild>
            <Link to={dashboardPath}>Ir para Dashboard</Link>
          </Button>
        </div>
      );
    }

    // User is not logged in
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/register">Cadastrar</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Sistema de Gestão Veicular
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Plataforma completa para gerenciamento de processos veiculares, clientes e entregas.
            </p>
            
            <div className="flex justify-center">
              {renderAuthButtons()}
            </div>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Para Clientes</h3>
              <p className="text-muted-foreground mb-4">
                Acompanhe seus processos em tempo real e receba notificações sobre o status dos seus pedidos.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Para Vendedores</h3>
              <p className="text-muted-foreground mb-4">
                Gerencie suas vendas, acompanhe comissões e mantenha contato com seus clientes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Para Administradores</h3>
              <p className="text-muted-foreground mb-4">
                Controle completo sobre usuários, vendas, estoque e configurações do sistema.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
