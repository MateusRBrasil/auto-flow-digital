
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessCard from './ProcessCard';

const mockProcesses = [
  {
    id: "PROC-001",
    clientName: "João Silva",
    clientType: "avulso" as const,
    processType: "Emplacamento",
    plateNumber: "ABC-1234",
    priority: false,
    status: "em_andamento" as const,
    createdAt: "2023-05-10T10:00:00Z"
  },
  {
    id: "PROC-002",
    clientName: "Despachante Rápido LTDA",
    clientType: "despachante" as const,
    processType: "Transferência",
    plateNumber: "DEF-5678",
    priority: true,
    status: "aguardando_documentos" as const,
    createdAt: "2023-05-09T15:30:00Z"
  },
  {
    id: "PROC-003",
    clientName: "Maria Santos",
    clientType: "avulso" as const,
    processType: "2ª Via de Placa",
    plateNumber: "GHI-9012",
    priority: false,
    status: "pendente" as const,
    createdAt: "2023-05-08T09:15:00Z"
  },
  {
    id: "PROC-004",
    clientName: "Auto Despachos S.A.",
    clientType: "despachante" as const,
    processType: "Emplacamento",
    plateNumber: "JKL-3456",
    priority: true,
    status: "concluido" as const,
    createdAt: "2023-05-07T14:45:00Z"
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Pendentes</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 desde ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas Hoje</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 3h5v5M8 3H3v5M3 16v5h5M16 21h5v-5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +4 desde ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despachantes Ativos</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +1 novo este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450</div>
            <p className="text-xs text-muted-foreground">
              +19% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Processos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProcesses.map((process) => (
              <ProcessCard key={process.id} {...process} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProcesses
              .filter(process => process.status === 'pendente')
              .map((process) => (
                <ProcessCard key={process.id} {...process} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="in_progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProcesses
              .filter(process => process.status === 'em_andamento' || process.status === 'aguardando_documentos')
              .map((process) => (
                <ProcessCard key={process.id} {...process} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProcesses
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

export default Dashboard;
