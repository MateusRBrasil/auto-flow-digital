
import React from 'react';
import { Separator } from '@/components/ui/separator';

const AdminCadastrarCliente: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cadastrar Cliente</h1>
        <p className="text-muted-foreground">
          Adicione um novo cliente ao sistema.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Formulário de Cadastro</h3>
        <p className="text-muted-foreground">Formulário em desenvolvimento</p>
      </div>
    </div>
  );
};

export default AdminCadastrarCliente;
