
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle } from 'lucide-react';
import { fetchPedidos, formatCurrency } from '@/integrations/supabase/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from 'react-router-dom';

const AdminPedidos: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPedidos = async () => {
      setIsLoading(true);
      const data = await fetchPedidos();
      console.log("Pedidos carregados:", data);
      setPedidos(data);
      setFilteredPedidos(data);
      setIsLoading(false);
    };

    loadPedidos();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPedidos(pedidos);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = pedidos.filter(pedido => 
      (pedido.id && pedido.id.toLowerCase().includes(query)) ||
      (pedido.tipo_servico && pedido.tipo_servico.toLowerCase().includes(query)) ||
      (pedido.placa && pedido.placa.toLowerCase().includes(query)) ||
      (pedido.perfis?.nome && pedido.perfis.nome.toLowerCase().includes(query))
    );

    setFilteredPedidos(filtered);
  }, [searchQuery, pedidos]);

  const handleCreateOrder = () => {
    navigate('/admin/pedidos/criar');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Pedidos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os pedidos realizados no sistema.
          </p>
        </div>
        
        <Button className="sm:self-start" onClick={handleCreateOrder}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            Carregando pedidos...
          </div>
        ) : filteredPedidos.length > 0 ? (
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
              {filteredPedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">{typeof pedido.id === 'string' && pedido.id.length > 8 ? pedido.id.substring(0, 8) + '...' : pedido.id}</TableCell>
                  <TableCell>{pedido.tipo_servico || 'N/A'}</TableCell>
                  <TableCell>{pedido.placa || 'N/A'}</TableCell>
                  <TableCell>{pedido.perfis?.nome || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      pedido.status === 'concluido' 
                        ? 'bg-green-100 text-green-800' 
                        : pedido.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pedido.status || 'pendente'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(pedido.valor || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum pedido encontrado.</p>
            <Button onClick={handleCreateOrder} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Primeiro Pedido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPedidos;
