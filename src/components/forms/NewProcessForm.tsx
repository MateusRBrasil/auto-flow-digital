
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

const formSchema = z.object({
  clientId: z.string({
    required_error: "Por favor selecione um cliente",
  }),
  processType: z.string({
    required_error: "Por favor selecione um tipo de processo",
  }),
  plateNumber: z.string().optional(),
  documentNumber: z.string().min(1, "Por favor insira um número do documento"),
  priority: z.boolean().default(false),
  notes: z.string().optional(),
});

const NewProcessForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: false,
      notes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Implementar lógica para salvar o processo
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
