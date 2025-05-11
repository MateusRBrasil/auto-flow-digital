
import React from 'react';
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
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  processId: z.string({
    required_error: "Por favor selecione um processo",
  }),
  deliveryType: z.enum(["interno", "parceiro"], {
    required_error: "Por favor selecione um tipo de entrega"
  }),
  deliveryPartner: z.string().optional(),
  deliveryPerson: z.string().optional(),
  address: z.string().min(1, "Endereço é obrigatório"),
  scheduledDate: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
});

const NewDeliveryForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryType: "interno",
      notes: "",
    },
  });

  const watchDeliveryType = form.watch("deliveryType");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Implementar lógica para agendar a entrega
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="processId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um processo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PROC-001">PROC-001 - João Silva - Emplacamento</SelectItem>
                  <SelectItem value="PROC-002">PROC-002 - Despachante Rápido - Transferência</SelectItem>
                  <SelectItem value="PROC-003">PROC-003 - Maria Santos - 2ª Via</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Entrega</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="interno" />
                    </FormControl>
                    <FormLabel className="font-normal">Entregador Próprio</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="parceiro" />
                    </FormControl>
                    <FormLabel className="font-normal">App Parceiro (Uber/99/Mottu)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchDeliveryType === "interno" ? (
          <FormField
            control={form.control}
            name="deliveryPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entregador</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um entregador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Carlos Silva</SelectItem>
                    <SelectItem value="2">Marcos Oliveira</SelectItem>
                    <SelectItem value="3">Pedro Santos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="deliveryPartner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Parceiro</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um app parceiro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="uber">Uber</SelectItem>
                    <SelectItem value="99">99</SelectItem>
                    <SelectItem value="mottu">Mottu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de Entrega</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Endereço completo com número, bairro, cidade e CEP" 
                  {...field} 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data/Hora Agendada</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruções de Entrega</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Instruções adicionais para a entrega" 
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormDescription>
                Informações adicionais como referências, instruções específicas para o entregador, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Agendar Entrega</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewDeliveryForm;
