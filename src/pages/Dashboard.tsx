
import React from 'react';
import { FileText, Truck, Users, DollarSign } from "lucide-react";
import SummaryCard from '@/components/dashboard/SummaryCard';
import NewProcessDialog from '@/components/dashboard/NewProcessDialog';
import BarChartCard from '@/components/dashboard/BarChartCard';
import PieChartCard from '@/components/dashboard/PieChartCard';
import ProcessesTabs from '@/components/dashboard/ProcessesTabs';

// Sample data for the dashboard
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
  // Chart data configuration
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

  // Transform data for Recharts format
  const barData = barChartData.labels.map((label, index) => ({
    name: label,
    processos: barChartData.datasets[0].data[index],
  }));

  const pieData = pieChartData.labels.map((label, index) => ({
    name: label,
    value: pieChartData.datasets[0].data[index],
  }));

  const chartConfig = {
    processos: {
      label: 'Processos',
      theme: {
        light: 'rgba(59, 130, 246, 0.5)',
        dark: 'rgba(59, 130, 246, 0.7)',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <NewProcessDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Processos Pendentes"
          value={8}
          trend="+2 desde ontem"
          icon={FileText}
        />
        <SummaryCard
          title="Entregas Hoje"
          value={12}
          trend="+4 desde ontem"
          icon={Truck}
        />
        <SummaryCard
          title="Despachantes Ativos"
          value={7}
          trend="+1 novo este mês"
          icon={Users}
        />
        <SummaryCard
          title="Faturamento"
          value="R$ 12.450"
          trend="+19% desde o último mês"
          icon={DollarSign}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartCard
          title="Processos por Mês"
          description="Volume de processos nos últimos 6 meses"
          data={barData}
          chartConfig={chartConfig}
        />
        <PieChartCard
          title="Tipos de Processo"
          description="Distribuição de processos por tipo"
          data={pieData}
          colors={pieChartData.datasets[0].backgroundColor as string[]}
          chartConfig={chartConfig}
        />
      </div>
      
      {/* Processes Tabs */}
      <ProcessesTabs processes={mockProcesses} />
    </div>
  );
};

export default Dashboard;
