
import React from 'react';
import { Separator } from '@/components/ui/separator';

const AdminVendedores: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Vendedores</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os vendedores da plataforma.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Vendedores</h3>
        <p className="text-muted-foreground">Nenhum vendedor cadastrado</p>
      </div>
    </div>
  );
};

export default AdminVendedores;
