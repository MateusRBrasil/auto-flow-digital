
import { useState } from 'react';
import { toast } from 'sonner';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export function useCEP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CepData | null>(null);

  const consultarCEP = async (cep: string): Promise<CepData | null> => {
    if (!cep || cep.length < 8) {
      setError("CEP é obrigatório e deve ter pelo menos 8 dígitos");
      return null;
    }

    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/[^0-9]/g, '');

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error(`Erro ao consultar CEP: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      setData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao consultar CEP";
      setError(errorMessage);
      toast.error(errorMessage);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    consultarCEP,
    loading,
    error,
    data,
    clearError: () => setError(null),
    clearData: () => setData(null)
  };
}
