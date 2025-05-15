
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Vendedor {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  documento: string | null;
  created_at: string | null;
  vendas: number;
}

const AdminVendedores: React.FC = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [filteredVendedores, setFilteredVendedores] = useState<Vendedor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendedores = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('perfis')
          .select('*')
          .eq('tipo', 'vendedor')
          .order('nome');

        if (error) {
          throw error;
        }

        // Fetch sales count for each vendedor
        const vendedoresWithSales = await Promise.all(
          data.map(async (vendedor) => {
            const { count } = await supabase
              .from('pedidos')
              .select('id', { count: 'exact' })
              .eq('criado_por', vendedor.id);
            
            return {
              ...vendedor,
              vendas: count || 0
            };
          })
        );

        setVendedores(vendedoresWithSales);
        setFilteredVendedores(vendedoresWithSales);
      } catch (error) {
        console.error('Error fetching vendedores:', error);
        toast({
          title: "Erro ao carregar vendedores",
          description: "Não foi possível carregar a lista de vendedores.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendedores();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVendedores(vendedores);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vendedores.filter(vendedor => 
      (vendedor.nome && vendedor.nome.toLowerCase().includes(query)) ||
      (vendedor.email && vendedor.email.toLowerCase().includes(query)) ||
      (vendedor.documento && vendedor.documento.toLowerCase().includes(query))
    );

    setFilteredVendedores(filtered);
  }, [searchQuery, vendedores]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Vendedores</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os vendedores da plataforma.
          </p>
        </div>
        
        <Button asChild className="sm:self-start">
          <Link to="/admin/vendedores/cadastrar">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Vendedor
          </Link>
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendedores..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            Carregando vendedores...
          </div>
        ) : filteredVendedores.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendedores.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
                      {vendedor.nome}
                    </div>
                  </TableCell>
                  <TableCell>{vendedor.email}</TableCell>
                  <TableCell>{vendedor.telefone || 'N/A'}</TableCell>
                  <TableCell>{vendedor.documento || 'N/A'}</TableCell>
                  <TableCell>{formatDate(vendedor.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      vendedor.vendas > 10 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendedor.vendas} vendas
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum vendedor encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendedores;
