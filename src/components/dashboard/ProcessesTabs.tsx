
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessCard from '@/components/ProcessCard';

interface Process {
  id: string;
  clientName: string;
  clientType: 'avulso' | 'despachante';
  processType: string;
  plateNumber?: string;
  priority: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_documentos';
  createdAt: string;
}

interface ProcessesTabsProps {
  processes: Process[];
}

const ProcessesTabs: React.FC<ProcessesTabsProps> = ({ processes }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Processos Recentes</h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/processes')}>
          Ver todos
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processes.map((process) => (
              <ProcessCard key={process.id} {...process} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processes
              .filter(process => process.status === 'pendente')
              .map((process) => (
                <ProcessCard key={process.id} {...process} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="in_progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processes
              .filter(process => process.status === 'em_andamento' || process.status === 'aguardando_documentos')
              .map((process) => (
                <ProcessCard key={process.id} {...process} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processes
              .filter(process => process.status === 'concluido')
              .map((process) => (
                <ProcessCard key={process.id} {...process} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessesTabs;
