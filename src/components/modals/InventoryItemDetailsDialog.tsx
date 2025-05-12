
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InventoryItem, InventoryItemCategory, InventoryUnit } from '@/types/inventory';
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string({
    required_error: "Selecione uma categoria",
  }),
  unit: z.string({
    required_error: "Selecione uma unidade de medida",
  }),
  currentQuantity: z.coerce.number().min(0, "A quantidade não pode ser negativa"),
  minimumQuantity: z.coerce.number().min(0, "A quantidade mínima não pode ser negativa"),
});

interface InventoryItemDetailsDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InventoryItemDetailsDialog: React.FC<InventoryItemDetailsDialogProps> = ({ 
  item, 
  open, 
  onOpenChange 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      description: item.description || "",
      category: item.category,
      unit: item.unit,
      currentQuantity: item.currentQuantity,
      minimumQuantity: item.minimumQuantity,
    },
  });

  const categories: { label: string, value: InventoryItemCategory }[] = [
    { label: 'Placa', value: 'placa' },
    { label: 'Suporte', value: 'suporte' },
    { label: 'Lacre', value: 'lacre' },
    { label: 'Adesivo', value: 'adesivo' },
    { label: 'Documento', value: 'documento' },
    { label: 'Outro', value: 'outro' },
  ];

  const units: { label: string, value: InventoryUnit }[] = [
    { label: 'Unidade', value: 'unidade' },
    { label: 'Par', value: 'par' },
    { label: 'Kit', value: 'kit' },
    { label: 'Caixa', value: 'caixa' },
    { label: 'Metro', value: 'metro' },
    { label: 'Litro', value: 'litro' },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Implementação da atualização do item no banco de dados
    console.log(values);
    toast.success("Item atualizado com sucesso!");
    onOpenChange(false);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Item</DialogTitle>
          <DialogDescription>
            Visualize e edite as informações do item.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Item</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade de Medida</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Atual</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Mínima</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Alerta quando abaixo deste valor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cadastrado em:</p>
                <p>{formatDate(item.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Última atualização:</p>
                <p>{formatDate(item.updatedAt)}</p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
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

export default InventoryItemDetailsDialog;
