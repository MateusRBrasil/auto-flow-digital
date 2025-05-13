
import { z } from "zod";

export interface Process {
  id: string;
  clientName: string;
  clientType: 'avulso' | 'despachante';
  processType: string;
  plateNumber?: string;
  priority: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_documentos';
  createdAt: string;
  observations?: string;
  deliveryAddress?: string;
}

export const processFormSchema = z.object({
  processType: z.string({
    required_error: "Selecione o tipo de pedido",
  }),
  plateNumber: z.string().optional(),
  priority: z.boolean().default(false),
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'cancelado', 'aguardando_documentos'], {
    required_error: "Selecione o status do pedido",
  }),
  observations: z.string().optional(),
  deliveryAddress: z.string().optional(),
});

export type ProcessFormData = z.infer<typeof processFormSchema>;
