
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pedido, StatusPedido } from '@/types';
import { toast } from 'sonner';

export function usePedidos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async (): Promise<Pedido[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          cliente:clientes(
            *,
            profile:profiles(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as Pedido[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar pedidos';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosByStatus = async (status: StatusPedido): Promise<Pedido[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          cliente:clientes(
            *,
            profile:profiles(*)
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as Pedido[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar pedidos';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPedidoById = async (id: string): Promise<Pedido | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          cliente:clientes(
            *,
            profile:profiles(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data as Pedido;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar pedido';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPedido = async (pedidoData: Partial<Pedido>): Promise<Pedido | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert(pedidoData)
        .select(`
          *,
          cliente:clientes(
            *,
            profile:profiles(*)
          )
        `)
        .single();

      if (error) throw error;

      toast.success('Pedido criado com sucesso!');
      return data as Pedido;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar pedido';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePedido = async (id: string, pedidoData: Partial<Pedido>): Promise<Pedido | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update(pedidoData)
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(
            *,
            profile:profiles(*)
          )
        `)
        .single();

      if (error) throw error;

      toast.success('Pedido atualizado com sucesso!');
      return data as Pedido;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar pedido';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePedido = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Pedido excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir pedido';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: StatusPedido): Promise<Pedido | null> => {
    return updatePedido(id, { status });
  };

  return {
    fetchPedidos,
    fetchPedidosByStatus,
    getPedidoById,
    createPedido,
    updatePedido,
    deletePedido,
    updateStatus,
    loading,
    error,
    clearError: () => setError(null)
  };
}
