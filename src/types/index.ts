
// Tipos relacionados ao perfil de usuário
export type ProfileType = 'admin' | 'cliente' | 'despachante' | 'vendedor';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: ProfileType;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  documento?: string;
  created_at: string;
  updated_at: string;
}

// Tipos relacionados a clientes
export type ClienteType = 'avulso' | 'despachante';

export interface Cliente {
  id: string;
  tipo: ClienteType;
  desconto?: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

// Tipos relacionados a pedidos
export type TipoServico = 'emplacamento' | 'transferencia' | 'segunda_via' | 'licenciamento' | 'outro';
export type StatusPedido = 'pendente' | 'em_andamento' | 'aguardando_documentos' | 'concluido' | 'cancelado';

export interface Pedido {
  id: string;
  cliente_id: string;
  tipo: TipoServico;
  status: StatusPedido;
  placa?: string;
  valor?: number;
  observacoes?: string;
  prioridade: boolean;
  endereco_entrega?: string;
  created_at: string;
  updated_at: string;
  // Relações
  cliente?: Cliente;
}

// Tipos relacionados a entregas
export type StatusEntrega = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
export type TipoEntrega = 'interno' | 'parceiro';

export interface Entrega {
  id: string;
  pedido_id: string;
  status: StatusEntrega;
  tipo_entrega: TipoEntrega;
  entregador: string;
  endereco: string;
  data_agendada: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Relações
  pedido?: Pedido;
}

// Tipos relacionados a estoque
export interface EstoqueItem {
  id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  preco_unitario?: number;
  tipo?: string;
  codigo?: string;
  created_at: string;
  updated_at: string;
}

export type TipoMovimentacao = 'entrada' | 'saida';

export interface EstoqueMovimentacao {
  id: string;
  estoque_id: string;
  pedido_id?: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string;
  created_at: string;
  created_by?: string;
  // Relações
  estoque?: EstoqueItem;
  pedido?: Pedido;
}
