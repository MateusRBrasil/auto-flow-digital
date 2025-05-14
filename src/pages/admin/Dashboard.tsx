
import React, { useState, useEffect } from 'react';
import { FileText, ShoppingCart, Users, DollarSign, TrendingUp, Package, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
      <Progress value={quantity * 20} className="h-2 bg-blue-200">
        <div className="h-full bg-red-500" style={{ width: `${(quantity/5) * 20}%` }} />
      </Progress>
    </div>
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

  // Mock data for performance and inventory
  const performanceData = [
    { name: 'Vendedor 1', sales: 25, maxSales: 25 },
    { name: 'Vendedor 2', sales: 20, maxSales: 25 },
    { name: 'Vendedor 3', sales: 15, maxSales: 25 },
    { name: 'Vendedor 4', sales: 10, maxSales: 25 },
  ];

  const inventoryData = [
    { name: 'Placas padrão', quantity: 5, low: true },
    { name: 'Lacres', quantity: 4, low: true },
    { name: 'Suportes metal', quantity: 3, low: true },
    { name: 'Adesivos refletivos', quantity: 2, low: true },
    { name: 'Parafusos especiais', quantity: 1, low: true },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent orders with fixed query that works in Postman
        const { data: orders, error: ordersError } = await supabase
          .from('pedidos')
          .select('*,perfis(nome)')
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
          console.log("Orders loaded successfully:", orders);
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
        const { data: pendingCount, count: pendingTotal, error: pendingError } = await supabase
          .from('pedidos')
          .select('id', { count: 'exact' })
          .not('status', 'eq', 'concluido');

        const { data: completedCount, count: completedTotal, error: completedError } = await supabase
          .from('pedidos')
          .select('id', { count: 'exact' })
          .eq('status', 'concluido');
          
        const { data: customersCount, count: customersTotal, error: customersError } = await supabase
          .from('perfis')
          .select('id', { count: 'exact' })
          .eq('tipo', 'avulso');
          
        const { data: vendorsCount, count: vendorsTotal, error: vendorsError } = await supabase
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
          pendingOrders: pendingTotal || 0,
          completedOrders: completedTotal || 0,
          totalCustomers: customersTotal || 0,
          totalVendors: vendorsTotal || 0,
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
          title="Vendas hoje"
          value={12}
          description="12 desde ontem"
          icon={ShoppingCart}
        />
        
        <SummaryCard
          title="Vendas no mês"
          value={285}
          trend="+23% comparado ao mês anterior"
          trendUp={true}
          icon={TrendingUp}
        />
        
        <SummaryCard
          title="Faturamento"
          value={formatCurrency(32500.75)}
          trend="+18% comparado ao mês anterior"
          trendUp={true}
          icon={DollarSign}
        />
        
        <SummaryCard
          title="Clientes novos"
          value={18}
          description="+5 na última semana"
          icon={Users}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de vendedores</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
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
          </CardContent>
        </Card>
        
        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Itens com estoque baixo</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <TableHead>Criado por</TableHead>
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
                    <TableCell>{order.perfis?.nome || 'N/A'}</TableCell>
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
