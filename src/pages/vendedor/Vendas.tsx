
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const VendedorVendas: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Minhas Vendas</h1>
          <p className="text-muted-foreground">
            Gerenciamento e acompanhamento das suas vendas.
          </p>
        </div>
        
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Vendas Recentes</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground text-sm">Nenhuma venda registrada</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Total Vendido</h3>
          <p className="text-3xl font-bold">R$ 0,00</p>
          <p className="text-muted-foreground text-sm">Nenhuma venda registrada</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Comissões</h3>
          <p className="text-3xl font-bold">R$ 0,00</p>
          <p className="text-muted-foreground text-sm">Nenhuma comissão recebida</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Histórico de Vendas</h3>
        <p className="text-muted-foreground">Você ainda não registrou nenhuma venda</p>
      </div>
    </div>
  );
};

export default VendedorVendas;
