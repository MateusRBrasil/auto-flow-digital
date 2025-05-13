
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cliente, Profile } from '@/types';
import { toast } from 'sonner';
import { useCNPJQuery } from './use-cnpj-query';

export function useClientes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { consultarCNPJ } = useCNPJQuery();

  const fetchClientes = async (): Promise<Cliente[]> => {
    setLoading(true);
    setError(null);

    try {
      // Buscar clientes com seus perfis relacionados
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as Cliente[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar clientes';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getClienteById = async (id: string): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data as Cliente;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (profileData: Partial<Profile>, clienteData: Partial<Cliente>): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);

    // Se for CNPJ e despachante, preencher automaticamente
    if (clienteData.tipo === 'despachante' && profileData.documento) {
      try {
        const cnpjData = await consultarCNPJ(profileData.documento);
        if (cnpjData && !cnpjData.error) {
          profileData.nome = cnpjData.nome || profileData.nome;
          profileData.email = cnpjData.email || profileData.email;
          profileData.telefone = cnpjData.telefone || profileData.telefone;
          profileData.endereco = [
            cnpjData.logradouro,
            cnpjData.numero ? `Nº ${cnpjData.numero}` : "",
            cnpjData.complemento
          ].filter(Boolean).join(", ");
          profileData.cidade = cnpjData.municipio || profileData.cidade;
          profileData.estado = cnpjData.uf || profileData.estado;
          profileData.cep = cnpjData.cep || profileData.cep;
        }
      } catch (err) {
        console.error('Erro ao consultar CNPJ:', err);
      }
    }

    try {
      // 1. Criar usuário (ou utilizar um existente se for despachante com email já cadastrado)
      let userId;

      // 2. Criar perfil
      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert({
          ...profileData,
          tipo: clienteData.tipo === 'despachante' ? 'despachante' : 'cliente'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      userId = profileResult.id;

      // 3. Criar cliente
      const { data: clienteResult, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          id: userId,
          tipo: clienteData.tipo || 'avulso',
          desconto: clienteData.desconto || 0,
          observacoes: clienteData.observacoes
        })
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();

      if (clienteError) throw clienteError;

      toast.success('Cliente criado com sucesso!');
      return clienteResult as Cliente;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id: string, profileData: Partial<Profile>, clienteData: Partial<Cliente>): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id);

      if (profileError) throw profileError;

      // 2. Atualizar cliente
      const { data: clienteResult, error: clienteError } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();

      if (clienteError) throw clienteError;

      toast.success('Cliente atualizado com sucesso!');
      return clienteResult as Cliente;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Excluir apenas o cliente (o perfil permanece)
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    loading,
    error,
    clearError: () => setError(null)
  };
}
