
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Entrega, StatusEntrega } from '@/types';
import { toast } from 'sonner';

export function useEntregas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntregas = async (): Promise<Entrega[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('entregas')
        .select(`
          *,
          pedido:pedidos(
            *,
            cliente:clientes(
              *,
              profile:profiles(*)
            )
          )
        `)
        .order('data_agendada', { ascending: true });

      if (error) throw error;
      
      return data as Entrega[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar entregas';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchEntregasByStatus = async (status: StatusEntrega): Promise<Entrega[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('entregas')
        .select(`
          *,
          pedido:pedidos(
            *,
            cliente:clientes(
              *,
              profile:profiles(*)
            )
          )
        `)
        .eq('status', status)
        .order('data_agendada', { ascending: true });

      if (error) throw error;
      
      return data as Entrega[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar entregas';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEntregaById = async (id: string): Promise<Entrega | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('entregas')
        .select(`
          *,
          pedido:pedidos(
            *,
            cliente:clientes(
              *,
              profile:profiles(*)
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data as Entrega;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar entrega';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEntrega = async (entregaData: Partial<Entrega>): Promise<Entrega | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('entregas')
        .insert(entregaData)
        .select(`
          *,
          pedido:pedidos(
            *,
            cliente:clientes(
              *,
              profile:profiles(*)
            )
          )
        `)
        .single();

      if (error) throw error;

      toast.success('Entrega criada com sucesso!');
      return data as Entrega;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar entrega';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEntrega = async (id: string, entregaData: Partial<Entrega>): Promise<Entrega | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('entregas')
        .update(entregaData)
        .eq('id', id)
        .select(`
          *,
          pedido:pedidos(
            *,
            cliente:clientes(
              *,
              profile:profiles(*)
            )
          )
        `)
        .single();

      if (error) throw error;

      toast.success('Entrega atualizada com sucesso!');
      return data as Entrega;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar entrega';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntrega = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('entregas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Entrega excluída com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir entrega';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: StatusEntrega): Promise<Entrega | null> => {
    return updateEntrega(id, { status });
  };

  return {
    fetchEntregas,
    fetchEntregasByStatus,
    getEntregaById,
    createEntrega,
    updateEntrega,
    deleteEntrega,
    updateStatus,
    loading,
    error,
    clearError: () => setError(null)
  };
}
