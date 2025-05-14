
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const VendedorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard do Vendedor</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {profile?.nome || user?.email}!
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button>Nova Venda</Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Suas Vendas</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground text-sm">Nenhuma venda registrada</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Clientes Atendidos</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground text-sm">Nenhum cliente atendido</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Comissões</h3>
          <p className="text-3xl font-bold">R$ 0,00</p>
          <p className="text-muted-foreground text-sm">Nenhuma comissão acumulada</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Últimas Vendas</h3>
        <p className="text-muted-foreground">Você ainda não registrou nenhuma venda</p>
      </div>
    </div>
  );
};

export default VendedorDashboard;
