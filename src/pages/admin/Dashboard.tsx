
import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de administração do sistema.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Vendas Recentes</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground text-sm">Nenhuma venda registrada</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Clientes</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground text-sm">Nenhum cliente cadastrado</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Produtos</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground text-sm">Nenhum produto cadastrado</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Atividade Recente</h3>
        <p className="text-muted-foreground">Nenhuma atividade registrada</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
