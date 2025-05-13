
import React, { useState, useEffect } from 'react';
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
import { Loader2, Search } from "lucide-react";
import { useCNPJQuery } from "@/hooks/use-cnpj-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["avulso", "despachante"], {
    required_error: "Por favor selecione um tipo de cliente"
  }),
  document: z.string().min(11, "CPF/CNPJ deve ser válido"),
  email: z.string().email("Email deve ser válido"),
  phone: z.string().min(10, "Telefone deve ser válido"),
  discount: z.number().min(0).max(100).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
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
  const watchDocument = form.watch("document");
  const { consultarCNPJ, loading, error, data } = useCNPJQuery();
  const [lastQueried, setLastQueried] = useState<string>("");

  const handleConsultaCNPJ = async () => {
    const document = form.getValues("document");
    if (!document || document.length < 14 || watchType !== "despachante") return;
    
    setLastQueried(document);
    const result = await consultarCNPJ(document);
    
    if (result) {
      form.setValue("name", result.nome || "");
      if (result.fantasia) form.setValue("name", result.fantasia);
      form.setValue("email", result.email || "");
      form.setValue("phone", result.telefone ? result.telefone.replace(/\D/g, '') : "");
      
      const address = [
        result.logradouro,
        result.numero ? `Nº ${result.numero}` : "",
        result.complemento
      ].filter(Boolean).join(", ");
      
      form.setValue("address", address || "");
      form.setValue("city", result.municipio || "");
      form.setValue("state", result.uf || "");
      form.setValue("zipCode", result.cep ? result.cep.replace(/\D/g, '') : "");
      
      toast.success("Dados do CNPJ carregados com sucesso!");
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast.success("Cliente cadastrado com sucesso!");
    // Implementar lógica para salvar o cliente
  };

  // Se mudar o tipo de cliente e for PJ, limpa o campo de documento
  useEffect(() => {
    if (watchType === "despachante") {
      form.setValue("document", "");
    }
  }, [watchType, form]);

  // Se mudar o documento e for longo o suficiente para ser um CNPJ, consulta automaticamente
  useEffect(() => {
    if (watchType === "despachante" && 
        watchDocument && 
        watchDocument.replace(/\D/g, '').length === 14 && 
        watchDocument !== lastQueried) {
      handleConsultaCNPJ();
    }
  }, [watchDocument, watchType]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{watchType === "avulso" ? "CPF" : "CNPJ"}</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    placeholder={watchType === "avulso" ? "CPF" : "CNPJ"} 
                    {...field} 
                  />
                </FormControl>
                {watchType === "despachante" && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleConsultaCNPJ} 
                    disabled={loading || !watchDocument || watchDocument.length < 14}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, complemento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="UF" {...field} maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="CEP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
