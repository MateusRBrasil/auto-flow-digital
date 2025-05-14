
import React, { useState, useEffect } from 'react';
import { FileText, Truck, Users, DollarSign, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9966FF', '#FF6B6B'];

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

const SummaryCard = ({ title, value, description, icon: Icon, trend, trendUp }: SummaryCardProps) => {
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

const AdminDashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<any[]>([]);
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
        // Fetch recent orders
        const { data: orders, error: ordersError } = await supabase
          .from('pedidos')
          .select('*, perfis(nome)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          toast({
            title: "Erro ao carregar pedidos",
            description: "Não foi possível carregar os pedidos recentes.",
            variant: "destructive"
          });
        } else {
          setRecentOrders(orders || []);
        }

        // Fetch sales data for chart based on filter
        const { data: graphData, error: graphError } = await supabase
          .rpc('grafico_processos_por_mes');
          
        if (graphError) {
          console.error('Error fetching graph data:', graphError);
        } else {
          setSalesData(graphData || []);
        }

        // Fetch service type distribution
        const { data: typeData, error: typeError } = await supabase
          .rpc('grafico_tipos_de_servico');
          
        if (typeError) {
          console.error('Error fetching service type data:', typeError);
        } else {
          setServiceTypeData(typeData || []);
        }

        // Calculate summary numbers
        const { data: pendingCount, error: pendingError } = await supabase
          .from('pedidos')
          .select('id', { count: 'exact' })
          .not('status', 'eq', 'concluido');

        const { data: completedCount, error: completedError } = await supabase
          .from('pedidos')
          .select('id', { count: 'exact' })
          .eq('status', 'concluido');
          
        const { data: customersCount, error: customersError } = await supabase
          .from('perfis')
          .select('id', { count: 'exact' })
          .eq('tipo', 'cliente');
          
        const { data: vendorsCount, error: vendorsError } = await supabase
          .from('perfis')
          .select('id', { count: 'exact' })
          .eq('tipo', 'vendedor');
          
        const { data: salesSum, error: salesError } = await supabase
          .from('pedidos')
          .select('valor');
          
        let totalValue = 0;
        if (salesSum) {
          totalValue = salesSum.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
        }
          
        setTotals({
          pendingOrders: pendingCount?.count || 0,
          completedOrders: completedCount?.count || 0,
          totalCustomers: customersCount?.count || 0,
          totalVendors: vendorsCount?.count || 0,
          totalSales: totalValue,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de administração do sistema.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Pedidos Pendentes"
          value={totals.pendingOrders}
          description="Aguardando processamento"
          icon={AlertCircle}
        />
        
        <SummaryCard
          title="Vendas Concluídas"
          value={totals.completedOrders}
          description="Pedidos finalizados"
          icon={ShoppingCart}
        />
        
        <SummaryCard
          title="Clientes"
          value={totals.totalCustomers}
          description="Total de clientes cadastrados"
          icon={Users}
        />
        
        <SummaryCard
          title="Faturamento Total"
          value={formatCurrency(totals.totalSales)}
          description="Soma de todas as vendas"
          icon={DollarSign}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales History Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Vendas</CardTitle>
            <Select value={salesFilter} onValueChange={setSalesFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Carregando dados...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Total de Pedidos"]} />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="Vendas" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Service Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Carregando dados...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="tipo"
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.tipo]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{order.tipo_servico}</TableCell>
                    <TableCell>{order.placa || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.status === 'concluido' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
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
      
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button asChild variant="outline">
            <a href="/admin/clientes/cadastrar">Cadastrar Cliente</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/admin/vendedores/cadastrar">Cadastrar Vendedor</a>
          </Button>
        </div>
        <Button asChild>
          <a href="/admin/pedidos">Ver Todos os Pedidos</a>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
