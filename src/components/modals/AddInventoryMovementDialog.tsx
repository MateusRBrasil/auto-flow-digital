
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InventoryItem } from '@/types/inventory';

const formSchema = z.object({
  quantity: z.coerce.number().positive("A quantidade deve ser maior que zero"),
  reason: z.string().min(3, "Informe um motivo para a movimentação"),
  processId: z.string().optional(),
});

interface AddInventoryMovementDialogProps {
  item: InventoryItem;
  movementType: 'entrada' | 'saida';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddInventoryMovementDialog: React.FC<AddInventoryMovementDialogProps> = ({
  item,
  movementType,
  open,
  onOpenChange
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      reason: "",
      processId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    // Validação específica para saída quando não há estoque suficiente
    if (movementType === 'saida' && values.quantity > item.currentQuantity) {
      toast.error(`Quantidade insuficiente em estoque. Disponível: ${item.currentQuantity}`);
      return;
    }
    
    // Aqui seria implementada a lógica de registrar a movimentação
    toast.success(`${movementType === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {movementType === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
          </DialogTitle>
          <DialogDescription>
            {movementType === 'entrada' 
              ? 'Adicione itens ao estoque' 
              : 'Remova itens do estoque'}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-md">
          <p className="text-sm font-medium">{item.name}</p>
          <div className="flex justify-between mt-2">
            <p className="text-sm text-muted-foreground">Estoque atual:</p>
            <p className="text-sm font-medium">{item.currentQuantity}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    {movementType === 'entrada' 
                      ? `Novo total após entrada: ${item.currentQuantity + Number(field.value)}` 
                      : `Novo total após saída: ${item.currentQuantity - Number(field.value)}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {movementType === 'saida' && (
              <FormField
                control={form.control}
                name="processId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processo (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Número ou ID do processo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Vincule esta saída a um processo existente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={movementType === 'entrada' 
                        ? "Ex: Compra de fornecedor" 
                        : "Ex: Consumo em emplacamento"} 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                variant={movementType === 'entrada' ? 'default' : 'destructive'}
              >
                {movementType === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryMovementDialog;
