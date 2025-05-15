
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VendedorEstoque: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('nome', { ascending: true });
        
        if (error) throw error;
        
        console.log("Produtos carregados:", data);
        setProdutos(data || []);
        setFilteredProdutos(data || []);
      } catch (error: any) {
        console.error('Erro ao carregar produtos:', error);
        toast({
          title: 'Erro ao carregar produtos',
          description: error.message,
          variant: 'destructive'
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visualizar Estoque</h1>
        <p className="text-muted-foreground">
          Consulte a disponibilidade de produtos.
        </p>
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
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            Carregando produtos...
          </div>
        ) : filteredProdutos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => (
                <TableRow key={produto.id} className={
                  produto.quantidade <= (produto.estoque_minimo || 10) 
                    ? "bg-red-50 dark:bg-red-900/10" 
                    : ""
                }>
                  <TableCell className="font-medium">{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>
                    <span className={
                      produto.quantidade <= (produto.estoque_minimo || 10)
                        ? "text-red-600 dark:text-red-400 font-medium"
                        : ""
                    }>
                      {produto.quantidade}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(produto.preco || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendedorEstoque;
