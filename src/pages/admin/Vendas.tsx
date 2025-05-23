
import React from 'react';
import { Separator } from '@/components/ui/separator';

const AdminVendas: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Vendas</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as vendas realizadas no sistema.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Vendas</h3>
        <p className="text-muted-foreground">Nenhuma venda registrada</p>
      </div>
    </div>
  );
};

export default AdminVendas;
