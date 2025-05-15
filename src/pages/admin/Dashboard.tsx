
import React, { useState, useEffect } from 'react';
import { FileText, ShoppingCart, Users, DollarSign, TrendingUp, Package, User } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  description?: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ElementType;
}

const SummaryCard = ({ title, value, description, trend, trendUp, icon: Icon }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={`text-xs ${
            trendUp ? "text-green-600" : trendUp === false ? "text-red-600" : "text-muted-foreground"
          }`}>
            {trend}
          </p>
        )}
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
          <User className="h-4 w-4 mr-2 text-blue-500" />
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
          <Package className="h-4 w-4 mr-2 text-red-500" />
          <span>{name}</span>
        </div>
        <span className="text-sm text-red-500">{quantity} un.</span>
      </div>
      <Progress value={(quantity / 10) * 100} className="h-2 bg-blue-200">
        <div className="h-full bg-red-500" style={{ width: `${(quantity/10) * 100}%` }} />
      </Progress>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [salesFilter, setSalesFilter] = useState('month'); // 'week', 'month', 'year'
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
      setIsLoading(true);
      try {
        // Fetch all data in parallel
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
  }, [salesFilter]);

  // Prepare chart data for PieChart
  const pieData = serviceTypeData.map((item, index) => ({
    name: item.tipo || 'Outros',
    value: item.total
  }));

  // Format data for BarChart 
  const barData = salesData.map(item => ({
    name: item.mes,
    processos: item.total
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
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de vendedores</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                Carregando dados...
              </div>
            ) : performanceData.length > 0 ? (
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <PerformanceItem 
                    key={index}
                    name={item.name}
                    sales={item.sales}
                    maxSales={item.maxSales}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Itens com estoque baixo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                Carregando dados...
              </div>
            ) : inventoryData.length > 0 ? (
              <div className="space-y-4">
                {inventoryData.map((item, index) => (
                  <InventoryItem 
                    key={index}
                    name={item.name}
                    quantity={item.quantity}
                    low={item.low}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhum item com estoque baixo</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Processos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                Carregando dados...
              </div>
            ) : barData.length > 0 ? (
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
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Processo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                Carregando dados...
              </div>
            ) : pieData.length > 0 ? (
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
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">Carregando pedidos...</div>
          ) : recentOrders.length > 0 ? (
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
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
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
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
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
