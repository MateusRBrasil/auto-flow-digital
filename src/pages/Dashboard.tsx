
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart } from "@/components/ui/chart";
import { 
  BarChart4, 
  FileText, 
  Truck, 
  Users, 
  DollarSign,
  Plus
} from "lucide-react";
import ProcessCard from '@/components/ProcessCard';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import NewProcessForm from '@/components/forms/NewProcessForm';

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
  const navigate = useNavigate();

  const barChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Processos',
        data: [65, 78, 52, 91, 83, 108],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Emplacamento', 'Transferência', '2ª Via', 'Outros'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Processo</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo processo
              </DialogDescription>
            </DialogHeader>
            <NewProcessForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards with summary data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
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
            <Truck className="h-4 w-4 text-muted-foreground" />
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
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450</div>
            <p className="text-xs text-muted-foreground">
              +19% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processos por Mês</CardTitle>
            <CardDescription>Volume de processos nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={barChartData} className="aspect-[4/3]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Processo</CardTitle>
            <CardDescription>Distribuição de processos por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={pieChartData} className="aspect-[4/3]" />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Processes */}
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
    </div>
  );
};

export default Dashboard;
