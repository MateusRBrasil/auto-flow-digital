
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Package, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  descricao: z.string().optional(),
  codigo: z.string().min(1, {
    message: "Código é obrigatório.",
  }),
  preco: z.string().min(1, {
    message: "Preço é obrigatório.",
  }).transform(val => parseFloat(val)),
  quantidade: z.string().min(1, {
    message: "Quantidade é obrigatória.",
  }).transform(val => parseInt(val, 10)),
});

const AdminEstoque: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      codigo: "",
      preco: "",
      quantidade: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mock adding product for now - we'll integrate with Supabase once the products table is created
      const newProduct = {
        id: crypto.randomUUID(),
        nome: values.nome,
        descricao: values.descricao || '',
        codigo: values.codigo,
        preco: values.preco,
        quantidade: values.quantidade,
      };
      
      setProdutos([...produtos, newProduct]);
      
      toast({
        title: "Produto cadastrado com sucesso",
        description: `O produto ${values.nome} foi cadastrado com sucesso.`,
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding produto:', error);
      toast({
        title: "Erro ao cadastrar produto",
        description: error.message || "Não foi possível cadastrar o produto.",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = produtos.filter(produto =>
    produto.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produto.codigo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produto.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Estoque</h1>
          <p className="text-muted-foreground">
            Controle seu inventário e produtos disponíveis.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Produto</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo produto ao estoque.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do produto" {...field} />
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="pt-4">
                  <Button type="submit">Salvar</Button>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <CardDescription>Quantidade de itens cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtos.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
            <CardDescription>Soma de todos os produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(
                produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade || 0), 0)
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produtos com Baixo Estoque</CardTitle>
            <CardDescription>Itens abaixo do mínimo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {produtos.filter(produto => (produto.quantidade || 0) < (produto.estoque_minimo || 10)).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              Carregando produtos...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.codigo}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.descricao}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(produto.preco || 0)}
                      </TableCell>
                      <TableCell className="text-right">{produto.quantidade}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format((produto.preco * produto.quantidade) || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground">Nenhum produto cadastrado no estoque</p>
              <p className="text-sm text-muted-foreground">Clique em "Novo Produto" para adicionar um item ao estoque</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEstoque;
