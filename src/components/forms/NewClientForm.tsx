
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["avulso", "despachante"], {
    required_error: "Por favor selecione um tipo de cliente"
  }),
  document: z.string().min(11, "CPF/CNPJ deve ser válido"),
  email: z.string().email("Email deve ser válido"),
  phone: z.string().min(10, "Telefone deve ser válido"),
  discount: z.number().min(0).max(100).optional(),
});

const NewClientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "avulso",
      discount: 0,
    },
  });
  
  const watchType = form.watch("type");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Implementar lógica para salvar o cliente
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome / Razão Social</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo ou empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="avulso">Cliente Avulso (Pessoa Física)</SelectItem>
                  <SelectItem value="despachante">Despachante (PJ/Parceiro)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === "avulso" 
                  ? "Cliente avulso paga preço cheio, sem prioridade" 
                  : "Despachante recebe desconto e pode ter prioridade"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{watchType === "avulso" ? "CPF" : "CNPJ"}</FormLabel>
                <FormControl>
                  <Input placeholder={watchType === "avulso" ? "CPF" : "CNPJ"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === "despachante" && (
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    max="100"
                    placeholder="Percentual de desconto" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Percentual de desconto aplicado aos serviços
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter>
          <Button type="submit">Cadastrar Cliente</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewClientForm;
