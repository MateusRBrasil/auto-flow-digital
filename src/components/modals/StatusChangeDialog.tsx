
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { ShieldCheck } from "lucide-react";

interface StatusChangeDialogProps {
  currentStatus: string;
  processId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: string, comment: string) => void;
}

const statusChangeSchema = z.object({
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'cancelado', 'aguardando_documentos'], {
    required_error: "Selecione o status do processo",
  }),
  comment: z.string().min(3, {
    message: "O comentário deve ter pelo menos 3 caracteres",
  }),
});

type StatusChangeFormData = z.infer<typeof statusChangeSchema>;

const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  currentStatus,
  processId,
  open,
  onOpenChange,
  onStatusChange
}) => {
  const form = useForm<StatusChangeFormData>({
    resolver: zodResolver(statusChangeSchema),
    defaultValues: {
      status: currentStatus as any,
      comment: "",
    }
  });

  function onSubmit(data: StatusChangeFormData) {
    onStatusChange(data.status, data.comment);
    toast.success("Status atualizado com sucesso!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Alterar Status do Processo</DialogTitle>
          <DialogDescription>
            Atualize o status do processo {processId}. Todas as alterações são registradas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Esta ação ficará registrada no histórico de auditoria</span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Status</FormLabel>
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
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentário</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione um comentário explicando a mudança de status"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar Alteração</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeDialog;
