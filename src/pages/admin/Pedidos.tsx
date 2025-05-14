
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle } from 'lucide-react';

const AdminPedidos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Pedidos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os pedidos realizados no sistema.
          </p>
        </div>
        
        <Button className="sm:self-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Pedidos</h3>
        <p className="text-muted-foreground">Nenhum pedido registrado</p>
      </div>
    </div>
  );
};

export default AdminPedidos;
