
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { fetchPedidosByVendedor, formatCurrency } from '@/integrations/supabase/api';

const VendedorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [vendas, setVendas] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    totalVendas: 0,
    totalClientes: 0,
    totalComissoes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendedorData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch sales for this vendor
        const vendasData = await fetchPedidosByVendedor(user.id);
        setVendas(vendasData || []);
          
        // Calculate totals
        const clientes = new Set(vendasData?.map(venda => venda.cliente_id) || []);
        const comissoes = vendasData?.reduce((total, venda) => total + (Number(venda.valor) * 0.1), 0) || 0;
        
        setTotals({
          totalVendas: vendasData?.length || 0,
          totalClientes: clientes.size,
          totalComissoes: comissoes
        });
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendedorData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard do Vendedor</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {profile?.nome || user?.email}!
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/vendedor/vendas/nova">Nova Venda</Link>
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Suas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totals.totalVendas}</p>
            <p className="text-muted-foreground text-sm">
              {totals.totalVendas > 0 ? 'Total de vendas registradas' : 'Nenhuma venda registrada'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clientes Atendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totals.totalClientes}</p>
            <p className="text-muted-foreground text-sm">
              {totals.totalClientes > 0 ? 'Clientes únicos' : 'Nenhum cliente atendido'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totals.totalComissoes)}</p>
            <p className="text-muted-foreground text-sm">
              {totals.totalComissoes > 0 ? '10% sobre vendas' : 'Nenhuma comissão acumulada'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Últimas Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              Carregando suas vendas...
            </div>
          ) : vendas.length > 0 ? (
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
                {vendas.slice(0, 5).map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell className="font-medium">{venda.id.substring(0, 8)}...</TableCell>
                    <TableCell>{venda.tipo_servico}</TableCell>
                    <TableCell>{venda.placa || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        venda.status === 'concluido' 
                          ? 'bg-green-100 text-green-800' 
                          : venda.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {venda.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(venda.valor || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Você ainda não registrou nenhuma venda</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/vendedor/vendas/nova">Criar Primeira Venda</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {totals.totalVendas > 5 && (
        <div className="flex justify-end">
          <Button asChild variant="outline">
            <Link to="/vendedor/vendas">Ver Todas as Vendas</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendedorDashboard;
