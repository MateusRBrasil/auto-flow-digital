export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          desconto: number | null
          endereco: string | null
          estado: string | null
          id: string
          observacoes: string | null
          tipo: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          desconto?: number | null
          endereco?: string | null
          estado?: string | null
          id: string
          observacoes?: string | null
          tipo: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          desconto?: number | null
          endereco?: string | null
          estado?: string | null
          id?: string
          observacoes?: string | null
          tipo?: string
        }
        Relationships: []
      }
      cnpj_cache: {
        Row: {
          cnpj: string
          created_at: string
          data: Json
        }
        Insert: {
          cnpj: string
          created_at?: string
          data: Json
        }
        Update: {
          cnpj?: string
          created_at?: string
          data?: Json
        }
        Relationships: []
      }
      pedido_produtos: {
        Row: {
          id: string
          pedido_id: string | null
          produto_id: string | null
          quantidade: number
          valor_unitario: number | null
        }
        Insert: {
          id?: string
          pedido_id?: string | null
          produto_id?: string | null
          quantidade: number
          valor_unitario?: number | null
        }
        Update: {
          id?: string
          pedido_id?: string | null
          produto_id?: string | null
          quantidade?: number
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_produtos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          criado_por: string | null
          id: string
          placa: string | null
          status: string | null
          tipo_servico: string | null
          valor: number | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          criado_por?: string | null
          id?: string
          placa?: string | null
          status?: string | null
          tipo_servico?: string | null
          valor?: number | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          criado_por?: string | null
          id?: string
          placa?: string | null
          status?: string | null
          tipo_servico?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedidos_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedidos_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_autorizados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedidos_criado_por"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          created_at: string | null
          documento: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
          tipo: Database["public"]["Enums"]["profile_tipo"]
        }
        Insert: {
          created_at?: string | null
          documento?: string | null
          email: string
          id: string
          nome: string
          telefone?: string | null
          tipo: Database["public"]["Enums"]["profile_tipo"]
        }
        Update: {
          created_at?: string | null
          documento?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["profile_tipo"]
        }
        Relationships: []
      }
      produtos: {
        Row: {
          codigo: string
          created_at: string | null
          descricao: string | null
          estoque_minimo: number | null
          id: string
          nome: string
          preco: number
          quantidade: number
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descricao?: string | null
          estoque_minimo?: number | null
          id?: string
          nome: string
          preco: number
          quantidade: number
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          estoque_minimo?: number | null
          id?: string
          nome?: string
          preco?: number
          quantidade?: number
        }
        Relationships: []
      }
    }
    Views: {
      clientes_autorizados: {
        Row: {
          cep: string | null
          cidade: string | null
          desconto: number | null
          endereco: string | null
          estado: string | null
          id: string | null
          observacoes: string | null
          tipo: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          desconto?: number | null
          endereco?: string | null
          estado?: string | null
          id?: string | null
          observacoes?: string | null
          tipo?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          desconto?: number | null
          endereco?: string | null
          estado?: string | null
          id?: string | null
          observacoes?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_test_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      grafico_processos_por_mes: {
        Args: Record<PropertyKey, never>
        Returns: {
          mes: string
          total: number
        }[]
      }
      grafico_tipos_de_servico: {
        Args: Record<PropertyKey, never>
        Returns: {
          tipo: string
          total: number
        }[]
      }
    }
    Enums: {
      profile_tipo: "admin" | "vendedor" | "avulso" | "despachante"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      profile_tipo: ["admin", "vendedor", "avulso", "despachante"],
    },
  },
} as const
