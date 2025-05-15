import React, { useEffect, useState } from 'react';
import { FileText, Truck, Users, DollarSign } from "lucide-react";
import SummaryCard from '@/components/dashboard/SummaryCard';
import NewProcessDialog from '@/components/dashboard/NewProcessDialog';
import BarChartCard from '@/components/dashboard/BarChartCard';
import PieChartCard from '@/components/dashboard/PieChartCard';
import ProcessesTabs from '@/components/dashboard/ProcessesTabs';
import { fetchRecentPedidos, fetchPendingOrdersCount, fetchCompletedOrdersCount, fetchClientsCount, fetchTotalSales, fetchGraficoProcessosPorMes, fetchGraficoTiposDeServico } from '@/integrations/supabase/api';
import { useAuth } from '@/hooks/use-auth';

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
  const { user, profile } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [processes, setProcesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      console.log("Loading dashboard data...");
      setIsLoading(true);
      try {
        // Fetch dashboard data
        const [pedidos, pendingCount, completedCount, clientsCount, sales, monthlyData, typeData] = await Promise.all([
          fetchRecentPedidos(),
          fetchPendingOrdersCount(),
          fetchCompletedOrdersCount(),
          fetchClientsCount(),
          fetchTotalSales(),
          fetchGraficoProcessosPorMes(),
          fetchGraficoTiposDeServico()
        ]);

        console.log("Dashboard data loaded:", { pedidos, pendingCount, completedCount, clientsCount, sales, monthlyData, typeData });
        
        // Format data for the dashboard
        const formattedProcesses = pedidos.map(p => ({
          id: p.id,
          clientName: p.perfis?.nome || 'N/A',
          clientType: p.cliente_id ? 'despachante' : 'avulso',
          processType: p.tipo_servico || 'N/A',
          plateNumber: p.placa || 'N/A',
          priority: false,
          status: p.status as any,
          createdAt: p.created_at
        }));
        
        const formattedBarData = monthlyData.map(item => ({
          name: item.mes,
          processos: item.total
        }));
        
        const formattedPieData = typeData.map(item => ({
          name: item.tipo || 'Outros',
          value: item.total
        }));
        
        // Update state with loaded data
        setPendingCount(pendingCount);
        setCompletedCount(completedCount);
        setClientsCount(clientsCount);
        setTotalSales(sales);
        setBarData(formattedBarData);
        setPieData(formattedPieData);
        setProcesses(formattedProcesses);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Keep default mock data on error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const chartConfig = {
    processos: {
      label: 'Processos',
      theme: {
        light: 'rgba(59, 130, 246, 0.5)',
        dark: 'rgba(59, 130, 246, 0.7)',
      },
    },
  };

  // Fallback data if real data is empty
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

  const displayedProcesses = processes.length > 0 ? processes : mockProcesses;
  const displayedBarData = barData.length > 0 ? barData : [
    { name: 'Jan', processos: 65 },
    { name: 'Fev', processos: 78 },
    { name: 'Mar', processos: 52 },
    { name: 'Abr', processos: 91 },
    { name: 'Mai', processos: 83 },
    { name: 'Jun', processos: 108 },
  ];
  const displayedPieData = pieData.length > 0 ? pieData : [
    { name: 'Emplacamento', value: 40 },
    { name: 'Transferência', value: 30 },
    { name: '2ª Via', value: 20 },
    { name: 'Outros', value: 10 },
  ];

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
          value={pendingCount || 8}
          trend={"+2 desde ontem"}
          icon={FileText}
        />
        <SummaryCard
          title="Entregas Hoje"
          value={completedCount || 12}
          trend={"+4 desde ontem"}
          icon={Truck}
        />
        <SummaryCard
          title="Despachantes Ativos"
          value={clientsCount || 7}
          trend={"+1 novo este mês"}
          icon={Users}
        />
        <SummaryCard
          title="Faturamento"
          value={`R$ ${(totalSales || 12450).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend={"+19% desde o último mês"}
          icon={DollarSign}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartCard
          title="Processos por Mês"
          description="Volume de processos nos últimos 6 meses"
          data={displayedBarData}
          chartConfig={chartConfig}
        />
        <PieChartCard
          title="Tipos de Processo"
          description="Distribuição de processos por tipo"
          data={displayedPieData}
          colors={[
            'rgba(59, 130, 246, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(168, 85, 247, 0.7)',
          ]}
          chartConfig={chartConfig}
        />
      </div>
      
      {/* Processes Tabs */}
      <ProcessesTabs processes={displayedProcesses} />
    </div>
  );
};

export default Dashboard;
