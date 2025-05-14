
import React from 'react';
import { Separator } from '@/components/ui/separator';

const AdminEstoque: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Estoque</h1>
        <p className="text-muted-foreground">
          Controle seu inventário e produtos disponíveis.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Produtos</h3>
        <p className="text-muted-foreground">Nenhum produto cadastrado</p>
      </div>
    </div>
  );
};

export default AdminEstoque;
