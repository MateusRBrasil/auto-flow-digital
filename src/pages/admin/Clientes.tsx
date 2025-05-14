
import React from 'react';
import { Separator } from '@/components/ui/separator';

const AdminClientes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Clientes</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os clientes cadastrados no sistema.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Clientes</h3>
        <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
      </div>
    </div>
  );
};

export default AdminClientes;
