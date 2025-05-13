
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CNPJData {
  nome?: string;
  fantasia?: string;
  email?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  cnpj?: string;
  status?: string;
  from_cache?: boolean;
  error?: string;
}

export function useCNPJQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CNPJData | null>(null);

  const consultarCNPJ = async (cnpj: string): Promise<CNPJData | null> => {
    if (!cnpj) {
      setError("CNPJ é obrigatório");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: responseData, error: responseError } = await supabase.functions.invoke("consulta-cnpj", {
        body: { cnpj }
      });

      if (responseError) {
        setError(responseError.message || "Erro ao consultar CNPJ");
        setData(null);
        return null;
      }

      if (responseData.error) {
        setError(responseData.error);
        setData(null);
        return null;
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao consultar CNPJ";
      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    consultarCNPJ,
    loading,
    error,
    data,
    clearError: () => setError(null),
    clearData: () => setData(null)
  };
}
