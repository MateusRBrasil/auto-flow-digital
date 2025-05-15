
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Package, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/integrations/supabase/api';

interface Produto {
  id: string;
  nome: string;
  codigo: string;
  descricao: string | null;
  quantidade: number;
  estoque_minimo: number | null;
  preco: number;
  created_at: string | null;
}

const AdminEstoque: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('nome');

        if (error) {
          throw error;
        }

        setProdutos(data);
        setFilteredProdutos(data);
      } catch (error) {
        console.error('Error fetching produtos:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar o estoque.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProdutos(produtos);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = produtos.filter(produto => 
      (produto.nome && produto.nome.toLowerCase().includes(query)) ||
      (produto.codigo && produto.codigo.toLowerCase().includes(query)) ||
      (produto.descricao && produto.descricao.toLowerCase().includes(query))
    );

    setFilteredProdutos(filtered);
  }, [searchQuery, produtos]);

  const getEstoqueStatus = (quantidade: number, minimo: number | null) => {
    const min = minimo || 10;
    if (quantidade <= 0) {
      return { color: 'bg-red-600', status: 'Esgotado', textColor: 'text-red-800', bgColor: 'bg-red-100' };
    } else if (quantidade < min) {
      return { color: 'bg-yellow-600', status: 'Baixo', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100' };
    } else {
      return { color: 'bg-green-600', status: 'Normal', textColor: 'text-green-800', bgColor: 'bg-green-100' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Estoque</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os produtos em estoque.
          </p>
        </div>
        
        <Button className="sm:self-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            Carregando produtos...
          </div>
        ) : filteredProdutos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => {
                const { color, status, textColor, bgColor } = getEstoqueStatus(produto.quantidade, produto.estoque_minimo);
                const minimo = produto.estoque_minimo || 10;
                const percentual = Math.min(100, Math.max(0, (produto.quantidade / (minimo * 2)) * 100));
                
                return (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <div>{produto.nome}</div>
                          {produto.descricao && (
                            <div className="text-xs text-muted-foreground">{produto.descricao}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{produto.codigo}</TableCell>
                    <TableCell>{formatCurrency(produto.preco)}</TableCell>
                    <TableCell>{produto.quantidade} un.</TableCell>
                    <TableCell>{minimo} un.</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}>
                          {status}
                        </span>
                        <Progress value={percentual} className="h-1.5">
                          <div className={`h-full ${color}`} style={{ width: `${percentual}%` }} />
                        </Progress>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
          <span>Produtos com estoque abaixo do mínimo: {produtos.filter(p => p.quantidade < (p.estoque_minimo || 10)).length}</span>
        </div>
        
        <Button variant="outline">
          Imprimir Relatório de Estoque
        </Button>
      </div>
    </div>
  );
};

export default AdminEstoque;
