
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, FileDown, FileUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  nome: z.string().min(2, { message: 'Nome do produto é obrigatório' }),
  codigo: z.string().min(1, { message: 'Código do produto é obrigatório' }),
  descricao: z.string().optional(),
  quantidade: z.number().min(0, { message: 'Quantidade não pode ser negativa' }),
  preco: z.string().min(1, { message: 'Preço é obrigatório' }),
  estoque_minimo: z.number().min(1, { message: 'Estoque mínimo deve ser pelo menos 1' }).optional(),
});

const AdminEstoque: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      descricao: '',
      quantidade: 0,
      preco: '',
      estoque_minimo: 10,
    }
  });

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

  const handleAddProduct = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('produtos')
        .insert({
          nome: values.nome,
          codigo: values.codigo,
          descricao: values.descricao || '',
          quantidade: values.quantidade,
          preco: parseFloat(values.preco),
          estoque_minimo: values.estoque_minimo || 10,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Produto adicionado',
        description: 'O produto foi adicionado com sucesso.'
      });
      
      // Refresh the list
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });
      
      setProdutos(data || []);
      setFilteredProdutos(data || []);
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: 'Erro ao adicionar produto',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Estoque</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os produtos disponíveis no sistema.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:self-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados para adicionar um novo produto ao estoque.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddProduct)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Código do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estoque_minimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Mínimo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="10" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 10)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="preco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Produto'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Importar
        </Button>
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
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Estoque Mín.</TableHead>
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
                  <TableCell>{produto.estoque_minimo || 10}</TableCell>
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

export default AdminEstoque;
