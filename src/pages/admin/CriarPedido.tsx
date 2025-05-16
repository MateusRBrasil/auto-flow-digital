
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  tipo_servico: z.string().min(2, { message: 'Escolha um tipo de serviço' }),
  placa: z.string().min(1, { message: 'Informe a placa do veículo' }),
  cliente_id: z.string().optional(),
  valor: z.string().min(1, { message: 'Informe o valor' }),
});

const CriarPedido: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientes, setClientes] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_servico: '',
      placa: '',
      cliente_id: undefined,
      valor: '',
    }
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from('perfis')
        .select('id, nome')
        .in('tipo', ['avulso', 'despachante']);
      
      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return;
      }
      
      setClientes(data || []);
    };

    fetchClientes();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Formulário enviado:', values);
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('pedidos')
        .insert({
          tipo_servico: values.tipo_servico,
          placa: values.placa,
          cliente_id: values.cliente_id || null,
          valor: parseFloat(values.valor),
          status: 'pendente',
          criado_por: (await supabase.auth.getUser()).data.user?.id || null,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Pedido criado com sucesso!',
        description: 'O pedido foi registrado no sistema.'
      });
      
      navigate('/admin/pedidos');
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: 'Erro ao criar pedido',
        description: error.message || 'Não foi possível criar o pedido.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criar Novo Pedido</h1>
        <p className="text-muted-foreground">
          Preencha os dados para registrar um novo pedido no sistema
        </p>
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tipo_servico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Emplacamento">Emplacamento</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="2ª Via">2ª Via</SelectItem>
                      <SelectItem value="Licenciamento">Licenciamento</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa do Veículo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ABC1234" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cliente_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cliente_avulso">Cliente Avulso</SelectItem>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
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
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Pedido (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/pedidos')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Pedido'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CriarPedido;
