
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
import { Servico } from '@/integrations/supabase/api';

const formSchema = z.object({
  tipo_servico: z.string().min(1, { message: 'Escolha um tipo de serviço' }),
  placa: z.string().min(1, { message: 'Informe a placa do veículo' }),
  cliente_id: z.string().min(1, { message: 'Selecione um cliente' }),
  valor: z.string().min(1, { message: 'Informe o valor' }),
  tipo_veiculo: z.string().min(1, { message: 'Selecione o tipo de veículo' }),
});

interface Cliente {
  id: string;
  nome: string;
  tipo: string; // "fisica" ou "juridica"
}

const CriarPedido: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_servico: '',
      placa: '',
      cliente_id: '',
      valor: '',
      tipo_veiculo: '',
    }
  });

  // Watch for service changes to update the price
  const selectedServico = form.watch('tipo_servico');
  
  // Update price when service changes
  useEffect(() => {
    if (selectedServico) {
      const servico = servicos.find(s => s.id === selectedServico);
      if (servico) {
        form.setValue('valor', servico.valor_base.toString());
      }
    }
  }, [selectedServico, servicos, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const { data: clientesData, error: clientesError } = await supabase
          .from('perfis')
          .select('id, nome, tipo')
          .in('tipo', ['fisica', 'juridica']);
        
        if (clientesError) {
          console.error('Erro ao buscar clientes:', clientesError);
          throw clientesError;
        }
        
        // Fetch services
        const { data: servicosData, error: servicosError } = await (supabase as any)
          .from('servicos')
          .select('*');
          
        if (servicosError) {
          console.error('Erro ao buscar serviços:', servicosError);
          throw servicosError;
        }
        
        console.log('Clientes carregados:', clientesData);
        console.log('Serviços carregados:', servicosData);
        
        setClientes(clientesData || []);
        setServicos(servicosData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os dados necessários.',
          variant: 'destructive'
        });
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Formulário enviado:', values);
    setIsLoading(true);
    
    try {
      // Check if there's inventory to be deducted
      const selectedService = servicos.find(s => s.id === values.tipo_servico);
      
      // Start a transaction
      const { data, error } = await (supabase.rpc as any)('criar_pedido', {
        p_tipo_servico: selectedService?.nome || values.tipo_servico,
        p_placa: values.placa,
        p_cliente_id: values.cliente_id === 'cliente_avulso' ? null : values.cliente_id,
        p_valor: parseFloat(values.valor),
        p_criado_por: (await supabase.auth.getUser()).data.user?.id || null,
        p_tipo_veiculo: values.tipo_veiculo,
        p_servico_id: selectedService?.id || null
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
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servicos.length > 0 ? (
                        servicos.map(servico => (
                          <SelectItem key={servico.id} value={servico.id}>
                            {servico.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Emplacamento">Emplacamento</SelectItem>
                          <SelectItem value="Transferência">Transferência</SelectItem>
                          <SelectItem value="2ª Via">2ª Via</SelectItem>
                          <SelectItem value="Licenciamento">Licenciamento</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </>
                      )}
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
              name="tipo_veiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Veículo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de veículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="carro">Carro</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="caminhao">Caminhão</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
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
                    value={field.value}
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
                          {cliente.nome} ({cliente.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'})
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
