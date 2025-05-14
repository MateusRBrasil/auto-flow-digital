
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ClienteProdutos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nossos Serviços</h1>
          <p className="text-muted-foreground">
            Conheça os serviços disponíveis.
          </p>
        </div>
        
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Solicitar Serviço
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Emplacamento</h3>
          <p className="text-muted-foreground mb-4">Serviço de emplacamento de veículos.</p>
          <Button variant="outline" className="w-full">Ver detalhes</Button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Transferência</h3>
          <p className="text-muted-foreground mb-4">Serviço de transferência de proprietário.</p>
          <Button variant="outline" className="w-full">Ver detalhes</Button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Segunda Via</h3>
          <p className="text-muted-foreground mb-4">Emissão de segunda via de documento.</p>
          <Button variant="outline" className="w-full">Ver detalhes</Button>
        </div>
      </div>
    </div>
  );
};

export default ClienteProdutos;
