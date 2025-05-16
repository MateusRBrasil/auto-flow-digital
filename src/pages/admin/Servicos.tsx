
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define form validation schema
const formSchema = z.object({
  nome: z.string().min(2, { message: 'Nome do serviço é obrigatório' }),
  descricao: z.string().optional(),
  valor_base: z.string().min(1, { message: 'Valor base é obrigatório' }),
  item_estoque: z.string().optional(),
  quantidade_consumo: z.number().min(0).optional(),
  tipo_veiculo: z.string().optional(),
});

// Interface for our service type
interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  valor_base: number;
  item_estoque?: string;
  quantidade_consumo?: number;
  tipo_veiculo?: string;
}

interface EstoqueItem {
  id: string;
  nome: string;
}

const ServicosPage: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [itensEstoque, setItensEstoque] = useState<EstoqueItem[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      valor_base: '',
      item_estoque: undefined,
      quantidade_consumo: 0,
      tipo_veiculo: undefined,
    }
  });

  // Fetch services and inventory items on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch services
        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('*')
          .order('nome', { ascending: true });
        
        if (servicosError) throw servicosError;
        
        // Fetch inventory items for the dropdown
        const { data: estoqueData, error: estoqueError } = await supabase
          .from('produtos')
          .select('id, nome')
          .order('nome', { ascending: true });
        
        if (estoqueError) throw estoqueError;
        
        setServicos(servicosData || []);
        setFilteredServicos(servicosData || []);
        setItensEstoque(estoqueData || []);
        
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServicos(servicos);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = servicos.filter(servico => 
      (servico.nome && servico.nome.toLowerCase().includes(query)) ||
      (servico.descricao && servico.descricao.toLowerCase().includes(query))
    );

    setFilteredServicos(filtered);
  }, [searchQuery, servicos]);

  // Handle form submission to add a new service
  const handleAddService = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .insert({
          nome: values.nome,
          descricao: values.descricao || '',
          valor_base: parseFloat(values.valor_base),
          item_estoque: values.item_estoque || null,
          quantidade_consumo: values.quantidade_consumo || null,
          tipo_veiculo: values.tipo_veiculo || null,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Serviço adicionado',
        description: 'O serviço foi adicionado com sucesso.'
      });
      
      // Refresh the list
      const { data } = await supabase
        .from('servicos')
        .select('*')
        .order('nome', { ascending: true });
      
      setServicos(data || []);
      setFilteredServicos(data || []);
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: 'Erro ao adicionar serviço',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
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
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Serviços</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie os serviços disponíveis no sistema.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:self-start">
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados para adicionar um novo serviço ao sistema.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddService)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do serviço" {...field} />
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
                        <Input placeholder="Descrição do serviço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valor_base"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Base (R$)</FormLabel>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="item_estoque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item de Estoque Relacionado</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um item (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nenhum">Nenhum</SelectItem>
                            {itensEstoque.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantidade_consumo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade Consumida</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="Quantidade consumida por serviço" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={!form.watch('item_estoque') || form.watch('item_estoque') === 'nenhum'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tipo_veiculo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Veículo</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de veículo (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="qualquer">Qualquer</SelectItem>
                          <SelectItem value="carro">Carro</SelectItem>
                          <SelectItem value="moto">Moto</SelectItem>
                          <SelectItem value="caminhao">Caminhão</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Serviço'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            Carregando serviços...
          </div>
        ) : filteredServicos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Base</TableHead>
                <TableHead>Item Relacionado</TableHead>
                <TableHead>Consumo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServicos.map((servico) => (
                <TableRow key={servico.id}>
                  <TableCell className="font-medium">{servico.nome}</TableCell>
                  <TableCell>{servico.descricao || '-'}</TableCell>
                  <TableCell>{formatCurrency(servico.valor_base || 0)}</TableCell>
                  <TableCell>{servico.item_estoque || '-'}</TableCell>
                  <TableCell>{servico.quantidade_consumo || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum serviço encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicosPage;
