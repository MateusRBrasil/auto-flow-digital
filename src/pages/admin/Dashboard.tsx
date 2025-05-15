
import React, { useState, useEffect } from 'react';
import { FileText, ShoppingCart, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
import { 
  fetchRecentPedidos, 
  fetchPendingOrdersCount, 
  fetchCompletedOrdersCount, 
  fetchClientsCount,
  fetchVendorsCount,
  fetchTotalSales,
  fetchGraficoProcessosPorMes,
  fetchGraficoTiposDeServico,
  fetchTopVendedores,
  fetchLowStockProducts,
  formatCurrency
} from '@/integrations/supabase/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9966FF', '#FF6B6B'];

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

const SummaryCard = ({ title, value, icon: Icon }: SummaryCardProps) => {
  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

interface PerformanceItemProps {
  name: string;
  sales: number;
  maxSales: number;
}

const PerformanceItem = ({ name, sales, maxSales }: PerformanceItemProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-500" />
          <span>{name}</span>
        </div>
        <span className="text-sm">{sales} vendas</span>
      </div>
      <Progress value={(sales / maxSales) * 100} className="h-2" />
    </div>
  );
};

interface InventoryItemProps {
  name: string;
  quantity: number;
  low: boolean;
}

const InventoryItem = ({ name, quantity, low }: InventoryItemProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <ShoppingCart className="h-4 w-4 mr-2 text-red-500" />
          <span>{name}</span>
        </div>
        <span className="text-sm text-red-500">{quantity} un.</span>
      </div>
      <Progress value={(quantity / 10) * 100} className="h-2" />
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalSales: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("Fetching dashboard data...");
      setIsLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [
          orders, 
          pendingCount, 
          completedCount, 
          customersCount, 
          vendorsCount,
          salesTotal,
          graphData,
          typeData,
          topVendedores,
          lowStockItems
        ] = await Promise.all([
          fetchRecentPedidos(),
          fetchPendingOrdersCount(),
          fetchCompletedOrdersCount(),
          fetchClientsCount(),
          fetchVendorsCount(),
          fetchTotalSales(),
          fetchGraficoProcessosPorMes(),
          fetchGraficoTiposDeServico(),
          fetchTopVendedores(),
          fetchLowStockProducts()
        ]);
        
        console.log("Orders:", orders);
        console.log("Pending Count:", pendingCount);
        console.log("Graph Data:", graphData);
        console.log("Type Data:", typeData);
        
        // Set fetched data to state
        setRecentOrders(orders);
        setSalesData(graphData);
        setServiceTypeData(typeData);
        
        // Transform top vendedores data for the performance chart
        const maxSales = topVendedores.length > 0 
          ? Math.max(...topVendedores.map(v => v.sales))
          : 25;
          
        setPerformanceData(
          topVendedores.map(v => ({
            name: v.name,
            sales: v.sales,
            maxSales: maxSales
          }))
        );
        
        // Transform low stock products data
        setInventoryData(
          lowStockItems.map(item => ({
            name: item.nome,
            quantity: item.quantidade,
            low: item.quantidade < (item.estoque_minimo || 10)
          }))
        );
        
        // Set summary totals
        setTotals({
          pendingOrders: pendingCount,
          completedOrders: completedCount,
          totalCustomers: customersCount,
          totalVendors: vendorsCount,
          totalSales: salesTotal
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data
  const pieData = serviceTypeData.length > 0 
    ? serviceTypeData.map((item) => ({
        name: item.tipo || 'Outros',
        value: item.total
      }))
    : [
        { name: 'Emplacamento', value: 40 },
        { name: 'Transferência', value: 30 },
        { name: '2ª Via', value: 20 },
        { name: 'Outros', value: 10 }
      ];

  const barData = salesData.length > 0 
    ? salesData.map(item => ({
        name: item.mes,
        processos: item.total
      }))
    : [
        { name: 'Jan', processos: 65 },
        { name: 'Fev', processos: 78 },
        { name: 'Mar', processos: 52 },
        { name: 'Abr', processos: 91 },
        { name: 'Mai', processos: 83 },
        { name: 'Jun', processos: 108 }
      ];

  // Fallback data for empty collections
  const demoPerformanceData = performanceData.length > 0 
    ? performanceData 
    : [
        { name: 'Maria Silva', sales: 24, maxSales: 25 },
        { name: 'João Costa', sales: 18, maxSales: 25 },
        { name: 'Ana Pereira', sales: 15, maxSales: 25 },
        { name: 'Carlos Santos', sales: 12, maxSales: 25 }
      ];
      
  const demoInventoryData = inventoryData.length > 0
    ? inventoryData
    : [
        { name: 'Placa Veicular', quantity: 3, low: true },
        { name: 'Lacre de Placa', quantity: 5, low: true },
        { name: 'Impresso CRLV', quantity: 7, low: true },
        { name: 'Tarjeta', quantity: 8, low: true }
      ];
      
  const demoRecentOrders = recentOrders.length > 0
    ? recentOrders
    : [
        { id: 'ORD-001', tipo_servico: 'Emplacamento', placa: 'ABC1234', perfis: { nome: 'João Silva' }, status: 'pendente', valor: 180 },
        { id: 'ORD-002', tipo_servico: 'Transferência', placa: 'DEF5678', perfis: { nome: 'Maria Costa' }, status: 'concluido', valor: 220 },
        { id: 'ORD-003', tipo_servico: '2ª Via', placa: 'GHI9012', perfis: { nome: 'Carlos Souza' }, status: 'pendente', valor: 150 },
        { id: 'ORD-004', tipo_servico: 'Emplacamento', placa: 'JKL3456', perfis: { nome: 'Ana Pereira' }, status: 'aguardando_documentos', valor: 195 },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de administração do sistema.
        </p>
      </div>
      
      {/* Summary Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Pedidos Pendentes"
          value={totals.pendingOrders}
          icon={FileText}
        />
        
        <SummaryCard
          title="Pedidos Concluídos"
          value={totals.completedOrders}
          icon={ShoppingCart}
        />
        
        <SummaryCard
          title="Faturamento Total"
          value={formatCurrency(totals.totalSales)}
          icon={DollarSign}
        />
        
        <SummaryCard
          title="Total de Clientes"
          value={totals.totalCustomers}
          icon={Users}
        />
      </div>
      
      {/* Second row - Performance and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de vendedores</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                Carregando dados...
              </div>
            ) : (
              <div className="space-y-4">
                {demoPerformanceData.map((item, index) => (
                  <PerformanceItem 
                    key={index}
                    name={item.name}
                    sales={item.sales}
                    maxSales={item.maxSales}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Itens com estoque baixo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                Carregando dados...
              </div>
            ) : (
              <div className="space-y-4">
                {demoInventoryData.map((item, index) => (
                  <InventoryItem 
                    key={index}
                    name={item.name}
                    quantity={item.quantity}
                    low={item.low}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Third row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Processos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                Carregando dados...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} processos`, 'Total']}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="processos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Processo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                Carregando dados...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} processos`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Fourth row - Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">Carregando pedidos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Criado por</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoRecentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{typeof order.id === 'string' && order.id.length > 8 ? order.id.substring(0, 8) + '...' : order.id}</TableCell>
                    <TableCell>{order.tipo_servico || 'N/A'}</TableCell>
                    <TableCell>{order.placa || 'N/A'}</TableCell>
                    <TableCell>{order.perfis?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.status === 'concluido' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status || 'pendente'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.valor || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="space-x-2 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/clientes/cadastrar">Cadastrar Cliente</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/vendedores/cadastrar">Cadastrar Vendedor</Link>
          </Button>
        </div>
        <Button asChild>
          <Link to="/admin/pedidos">Ver Todos os Pedidos</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
