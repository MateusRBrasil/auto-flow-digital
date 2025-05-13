
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EstoqueItem, EstoqueMovimentacao, TipoMovimentacao } from '@/types';
import { toast } from 'sonner';

export function useEstoque() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstoque = async (): Promise<EstoqueItem[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('estoque')
        .select()
        .order('nome', { ascending: true });

      if (error) throw error;
      
      return data as EstoqueItem[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar estoque';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEstoqueItemById = async (id: string): Promise<EstoqueItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('estoque')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data as EstoqueItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar item de estoque';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEstoqueItem = async (item: Partial<EstoqueItem>): Promise<EstoqueItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('estoque')
        .insert(item)
        .select()
        .single();

      if (error) throw error;

      toast.success('Item de estoque criado com sucesso!');
      return data as EstoqueItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar item de estoque';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEstoqueItem = async (id: string, item: Partial<EstoqueItem>): Promise<EstoqueItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('estoque')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Item de estoque atualizado com sucesso!');
      return data as EstoqueItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar item de estoque';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEstoqueItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Item de estoque excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir item de estoque';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Funções para movimentação de estoque
  const fetchMovimentacoes = async (): Promise<EstoqueMovimentacao[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('estoque_movimentacoes')
        .select(`
          *,
          estoque(*),
          pedido:pedidos(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as EstoqueMovimentacao[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar movimentações';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const registrarMovimentacao = async (
    estoqueId: string, 
    tipo: TipoMovimentacao, 
    quantidade: number, 
    pedidoId?: string,
    observacao?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Buscar item de estoque atual
      const { data: itemAtual, error: itemError } = await supabase
        .from('estoque')
        .select('quantidade')
        .eq('id', estoqueId)
        .single();

      if (itemError) throw itemError;

      // 2. Calcular nova quantidade
      let novaQuantidade: number;
      if (tipo === 'entrada') {
        novaQuantidade = (itemAtual?.quantidade || 0) + quantidade;
      } else { // 'saida'
        novaQuantidade = (itemAtual?.quantidade || 0) - quantidade;
        if (novaQuantidade < 0) {
          throw new Error('Quantidade insuficiente em estoque');
        }
      }

      // 3. Iniciar transação para atualizar estoque e registrar movimentação
      // Como não há transações no cliente do Supabase, fazemos duas operações sequenciais
      
      // 3.1. Registrar movimentação
      const { error: movError } = await supabase
        .from('estoque_movimentacoes')
        .insert({
          estoque_id: estoqueId,
          tipo,
          quantidade,
          pedido_id: pedidoId,
          observacao
        });

      if (movError) throw movError;

      // 3.2. Atualizar quantidade no estoque
      const { error: updateError } = await supabase
        .from('estoque')
        .update({ quantidade: novaQuantidade })
        .eq('id', estoqueId);

      if (updateError) throw updateError;

      toast.success(`Movimentação de ${tipo === 'entrada' ? 'entrada' : 'saída'} registrada com sucesso!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao registrar movimentação';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Funções de estoque
    fetchEstoque,
    getEstoqueItemById,
    createEstoqueItem,
    updateEstoqueItem,
    deleteEstoqueItem,
    
    // Funções de movimentação
    fetchMovimentacoes,
    registrarMovimentacao,
    
    loading,
    error,
    clearError: () => setError(null)
  };
}
