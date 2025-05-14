
import React from 'react';
import { Separator } from '@/components/ui/separator';

const ClientePedidos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Visualize e acompanhe seus pedidos.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Pedidos</h3>
        <p className="text-muted-foreground">Você ainda não possui pedidos</p>
      </div>
    </div>
  );
};

export default ClientePedidos;
