
import { supabase } from "./client";
import { toast } from "@/hooks/use-toast";

// Pedidos (Orders) API
export const fetchPedidos = async (limit = 100, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*,perfis(nome)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    toast({
      title: "Erro ao carregar pedidos",
      description: "Não foi possível carregar os pedidos.",
      variant: "destructive"
    });
    return [];
  }
};

export const fetchRecentPedidos = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*,perfis(nome)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent pedidos:', error);
    toast({
      title: "Erro ao carregar pedidos recentes",
      description: "Não foi possível carregar os pedidos recentes.",
      variant: "destructive"
    });
    return [];
  }
};

export const fetchPedidosByVendedor = async (vendedorId: string, limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*,perfis(nome)')
      .eq('criado_por', vendedorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vendedor pedidos:', error);
    toast({
      title: "Erro ao carregar vendas",
      description: "Não foi possível carregar suas vendas.",
      variant: "destructive"
    });
    return [];
  }
};

// Dashboard Statistics API
export const fetchGraficoProcessosPorMes = async () => {
  try {
    const { data, error } = await supabase.rpc('grafico_processos_por_mes');
    if (error) {
      console.error('Error fetching processos por mes:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching processos por mes:', error);
    return [];
  }
};

export const fetchGraficoTiposDeServico = async () => {
  try {
    const { data, error } = await supabase.rpc('grafico_tipos_de_servico');
    if (error) {
      console.error('Error fetching tipos de servico:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching tipos de servico:', error);
    return [];
  }
};

// Summary Counts API
export const fetchPendingOrdersCount = async () => {
  try {
    const { count, error } = await supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pendente');
    
    if (error) {
      console.error('Error fetching pending orders count:', error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return 0;
  }
};

export const fetchCompletedOrdersCount = async () => {
  try {
    const { count, error } = await supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'concluido');
    
    if (error) {
      console.error('Error fetching completed orders count:', error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error('Error fetching completed orders count:', error);
    return 0;
  }
};

export const fetchTotalSales = async () => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('valor');
      
    if (error) {
      console.error('Error fetching total sales:', error);
      return 0;
    }

    if (!data || data.length === 0) return 0;
    
    return data.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  } catch (error) {
    console.error('Error fetching total sales:', error);
    return 0;
  }
};

// Users and Profiles API
export const fetchClientsCount = async () => {
  try {
    const { count, error } = await supabase
      .from('perfis')
      .select('id', { count: 'exact', head: true })
      .in('tipo', ['avulso', 'despachante']);
    
    if (error) {
      console.error('Error fetching clients count:', error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error('Error fetching clients count:', error);
    return 0;
  }
};

export const fetchVendorsCount = async () => {
  try {
    const { count, error } = await supabase
      .from('perfis')
      .select('id', { count: 'exact', head: true })
      .eq('tipo', 'vendedor');
    
    if (error) {
      console.error('Error fetching vendors count:', error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error('Error fetching vendors count:', error);
    return 0;
  }
};

export const fetchTopVendedores = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('id, nome')
      .eq('tipo', 'vendedor')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top vendedores:', error);
      return [];
    }
    
    if (!data || data.length === 0) return [];
    
    // For each vendedor, fetch their sales count
    const vendedoresWithSales = await Promise.all(
      data.map(async (vendedor) => {
        const { count } = await supabase
          .from('pedidos')
          .select('id', { count: 'exact', head: true })
          .eq('criado_por', vendedor.id);
        
        return {
          id: vendedor.id,
          name: vendedor.nome,
          sales: count || 0
        };
      })
    );
    
    // Sort by sales in descending order
    return vendedoresWithSales.sort((a, b) => b.sales - a.sales);
  } catch (error) {
    console.error('Error fetching top vendedores:', error);
    return [];
  }
};

// Produtos (Products) API
export const fetchLowStockProducts = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .lt('quantidade', 10) // Low stock threshold
      .order('quantidade', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
};

// Shared utility functions
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
