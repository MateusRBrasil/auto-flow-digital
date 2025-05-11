
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

interface Process {
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

interface ProcessEditDialogProps {
  process: Process | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProcessFormData) => void;
}

const processFormSchema = z.object({
  processType: z.string({
    required_error: "Selecione o tipo de processo",
  }),
  plateNumber: z.string().optional(),
  priority: z.boolean().default(false),
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'cancelado', 'aguardando_documentos'], {
    required_error: "Selecione o status do processo",
  }),
  observations: z.string().optional(),
  deliveryAddress: z.string().optional(),
});

type ProcessFormData = z.infer<typeof processFormSchema>;

const ProcessEditDialog: React.FC<ProcessEditDialogProps> = ({
  process,
  open,
  onOpenChange,
  onSave
}) => {
  const form = useForm<ProcessFormData>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      processType: process?.processType || "",
      plateNumber: process?.plateNumber || "",
      priority: process?.priority || false,
      status: process?.status || "pendente",
      observations: process?.observations || "",
      deliveryAddress: process?.deliveryAddress || "",
    }
  });
  
  // Atualiza os valores do formulário quando o processo muda
  React.useEffect(() => {
    if (process) {
      form.reset({
        processType: process.processType,
        plateNumber: process.plateNumber || "",
        priority: process.priority,
        status: process.status,
        observations: process.observations || "",
        deliveryAddress: process.deliveryAddress || "",
      });
    }
  }, [process, form]);

  function onSubmit(data: ProcessFormData) {
    onSave(data);
    toast.success("Processo atualizado com sucesso!");
    onOpenChange(false);
  }

  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Processo {process.id}</DialogTitle>
          <DialogDescription>
            Atualize as informações do processo. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-1">Cliente</p>
                <p className="text-sm bg-muted p-2 rounded-md">{process.clientName} ({process.clientType === 'despachante' ? 'Despachante' : 'Cliente Avulso'})</p>
              </div>
            
              <FormField
                control={form.control}
                name="processType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Processo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de processo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Emplacamento">Emplacamento</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                        <SelectItem value="2ª Via de Placa">2ª Via de Placa</SelectItem>
                        <SelectItem value="Licenciamento">Licenciamento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="aguardando_documentos">Aguardando Documentos</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do Veículo</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Prioritário</FormLabel>
                      <FormDescription>
                        Marque esta opção para destacar este processo como prioritário.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço de Entrega</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade - UF" {...field} />
                      </FormControl>
                      <FormDescription>
                        Deixe em branco para usar o endereço padrão do cliente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Adicione observações importantes sobre este processo"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessEditDialog;
