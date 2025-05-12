
import React, { useEffect, useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Tabela de consumo dinâmico de estoque
const inventoryConsumptionRules = [
  { serviceType: 'emplacamento', vehicleType: 'carro', itemId: 'placa-aluminio', itemName: 'Placa Alumínio', quantity: 2 },
  { serviceType: 'emplacamento', vehicleType: 'moto', itemId: 'placa-aluminio', itemName: 'Placa Alumínio', quantity: 1 },
  { serviceType: '2via', vehicleType: 'carro', itemId: 'placa-aluminio', itemName: 'Placa Alumínio', quantity: 1 },
  { serviceType: '2via', vehicleType: 'moto', itemId: 'placa-aluminio', itemName: 'Placa Alumínio', quantity: 1 },
  { serviceType: 'emplacamento', vehicleType: 'carro', itemId: 'suporte-placa', itemName: 'Suporte de Placa', quantity: 2 },
  { serviceType: 'emplacamento', vehicleType: 'moto', itemId: 'suporte-placa', itemName: 'Suporte de Placa', quantity: 1 },
  { serviceType: 'emplacamento', vehicleType: 'carro', itemId: 'lacre-plastico', itemName: 'Lacre Plástico', quantity: 1 },
  { serviceType: 'emplacamento', vehicleType: 'moto', itemId: 'lacre-plastico', itemName: 'Lacre Plástico', quantity: 1 },
  { serviceType: '2via', vehicleType: 'carro', itemId: 'lacre-plastico', itemName: 'Lacre Plástico', quantity: 1 },
  { serviceType: '2via', vehicleType: 'moto', itemId: 'lacre-plastico', itemName: 'Lacre Plástico', quantity: 1 },
];

const formSchema = z.object({
  clientId: z.string({
    required_error: "Por favor selecione um cliente",
  }),
  processType: z.string({
    required_error: "Por favor selecione um tipo de processo",
  }),
  vehicleType: z.string({
    required_error: "Por favor selecione um tipo de veículo",
  }),
  plateNumber: z.string().optional(),
  documentNumber: z.string().min(1, "Por favor insira um número do documento"),
  priority: z.boolean().default(false),
  notes: z.string().optional(),
  // Itens de consumo de estoque
  inventoryItems: z.array(
    z.object({
      itemId: z.string(),
      itemName: z.string(),
      quantity: z.number().int().min(0),
    })
  ).default([]),
});

interface NewProcessFormProps {
  onSubmitSuccess?: () => void;
}

const NewProcessForm: React.FC<NewProcessFormProps> = ({ onSubmitSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: false,
      notes: "",
      inventoryItems: [],
    },
  });
  
  // Observa mudanças no tipo de processo e tipo de veículo
  const processType = form.watch('processType');
  const vehicleType = form.watch('vehicleType');

  // Atualiza os itens de estoque sugeridos quando o tipo de processo ou veículo muda
  useEffect(() => {
    if (processType && vehicleType) {
      const suggestedItems = inventoryConsumptionRules
        .filter(rule => rule.serviceType === processType && rule.vehicleType === vehicleType)
        .map(rule => ({
          itemId: rule.itemId,
          itemName: rule.itemName,
          quantity: rule.quantity,
        }));
      
      form.setValue('inventoryItems', suggestedItems);
    }
  }, [processType, vehicleType, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Implementar lógica para salvar o processo
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  // Atualiza a quantidade de um item específico
  const updateItemQuantity = (itemId: string, quantity: number) => {
    const currentItems = form.getValues('inventoryItems');
    const updatedItems = currentItems.map(item => 
      item.itemId === itemId ? { ...item, quantity } : item
    );
    form.setValue('inventoryItems', updatedItems);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">João Silva (Avulso)</SelectItem>
                  <SelectItem value="2">Despachante Rápido LTDA (Despachante)</SelectItem>
                  <SelectItem value="3">Maria Santos (Avulso)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="emplacamento">Emplacamento</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="2via">2ª Via de Placa</SelectItem>
                    <SelectItem value="licenciamento">Licenciamento Anual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Veículo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de veículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="caminhao">Caminhão</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa (se aplicável)</FormLabel>
                <FormControl>
                  <Input placeholder="AAA-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº do Documento</FormLabel>
                <FormControl>
                  <Input placeholder="Número do documento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção de consumo de estoque */}
        {form.watch('inventoryItems').length > 0 && processType && vehicleType && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Materiais a serem utilizados</h3>
              
              <div className="space-y-2">
                {form.watch('inventoryItems').map((item, index) => (
                  <div key={item.itemId} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-sm text-muted-foreground">Consumo sugerido para este serviço</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          const currentQty = form.watch(`inventoryItems.${index}.quantity`);
                          if (currentQty > 0) {
                            updateItemQuantity(item.itemId, currentQty - 1);
                          }
                        }}
                      >
                        -
                      </Button>
                      <Input 
                        type="number" 
                        className="w-16 text-center" 
                        min="0"
                        value={form.watch(`inventoryItems.${index}.quantity`)} 
                        onChange={(e) => updateItemQuantity(item.itemId, parseInt(e.target.value) || 0)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          const currentQty = form.watch(`inventoryItems.${index}.quantity`);
                          updateItemQuantity(item.itemId, currentQty + 1);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <FormDescription>
                Estes materiais serão automaticamente deduzidos do estoque ao criar o processo
              </FormDescription>
            </div>
          </>
        )}

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Prioritário</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marque se este processo tem prioridade de atendimento
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input placeholder="Observações adicionais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Criar Processo</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewProcessForm;
