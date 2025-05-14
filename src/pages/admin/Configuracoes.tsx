
import React from 'react';
import { Separator } from '@/components/ui/separator';

const AdminConfiguracoes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais da plataforma.
        </p>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
        <p className="text-muted-foreground">Em breve...</p>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
