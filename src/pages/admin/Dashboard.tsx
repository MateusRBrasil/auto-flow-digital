import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Truck, Users, DollarSign } from "lucide-react";
import SummaryCard from '@/components/dashboard/SummaryCard';
import NewProcessDialog from '@/components/dashboard/NewProcessDialog';
import BarChartCard from '@/components/dashboard/BarChartCard';
import PieChartCard from '@/components/dashboard/PieChartCard';
import ProcessesTabs from '@/components/dashboard/ProcessesTabs';
import { supabase } from '@/lib/supabaseClient';

const Dashboard = () => {
  const [perfil, setPerfil] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: perfilData } = await supabase
        .from("perfis")
        .select("tipo, nome")
        .eq("id", user.id)
        .single();

      setPerfil(perfilData);

      const { data: pedidosData } = await supabase
        .from("pedidos")
        .select("id, tipo_servico, status, placa, valor, created_at, cliente_id");

      setPedidos(pedidosData || []);
    };

    fetchData();
  }, [navigate]);

  const totalPendentes = pedidos.filter(p => p.status === 'pendente').length;
  const totalFaturamento = pedidos.reduce((acc, cur) => acc + (cur.valor || 0), 0);

  const barData = [
    { name: 'Jan', processos: 0 },
    { name: 'Fev', processos: 0 },
    { name: 'Mar', processos: 0 },
    { name: 'Abr', processos: 0 },
    { name: 'Mai', processos: pedidos.length },
    { name: 'Jun', processos: 0 },
  ];

  const pieData = ['emplacamento', 'transferencia', 'segunda_via', 'licenciamento'].map(tipo => ({
    name: tipo,
    value: pedidos.filter(p => p.tipo_servico === tipo).length,
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
        <h2 className="text-2xl font-bold tracking-tight">
          Bem-vindo, {perfil?.nome ?? 'Usuário'}
        </h2>
        {perfil?.tipo === 'admin' && <NewProcessDialog />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Processos Pendentes" value={totalPendentes} trend="atual" icon={FileText} />
        <SummaryCard title="Entregas Hoje" value={0} trend="-" icon={Truck} />
        <SummaryCard title="Pedidos Totais" value={pedidos.length} trend="atual" icon={Users} />
        <SummaryCard title="Faturamento" value={`R$ ${totalFaturamento.toFixed(2)}`} trend="mensal" icon={DollarSign} />
      </div>

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
          colors={[
            'rgba(59, 130, 246, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(168, 85, 247, 0.7)',
          ]}
          chartConfig={chartConfig}
        />
      </div>

      <ProcessesTabs processes={pedidos} />
    </div>
  );
};

export default Dashboard;
