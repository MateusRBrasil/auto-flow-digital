
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ClientRegistration: React.FC = () => {
  const [clientType, setClientType] = useState<'avulso' | 'despachante'>('avulso');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulando cadastro bem-sucedido
    toast({
      title: "Cliente cadastrado com sucesso!",
      description: "O novo cliente foi adicionado ao sistema.",
      duration: 5000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Cliente</CardTitle>
        <CardDescription>
          Preencha os dados para cadastrar um novo cliente no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientType">Tipo de Cliente</Label>
            <RadioGroup 
              id="clientType" 
              value={clientType} 
              onValueChange={(value) => setClientType(value as 'avulso' | 'despachante')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="avulso" id="avulso" />
                <Label htmlFor="avulso" className="font-normal">Avulso (Pessoa Física)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="despachante" id="despachante" />
                <Label htmlFor="despachante" className="font-normal">Despachante / Parceiro</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome {clientType === 'despachante' ? 'da Empresa' : 'Completo'}</Label>
              <Input id="name" placeholder={clientType === 'despachante' ? 'Nome da empresa' : 'Nome completo'} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">{clientType === 'despachante' ? 'CNPJ' : 'CPF'}</Label>
              <Input id="document" placeholder={clientType === 'despachante' ? 'CNPJ' : 'CPF'} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="email@exemplo.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(11) 99999-9999" />
            </div>
          </div>

          {clientType === 'despachante' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input id="discount" type="number" placeholder="0" min="0" max="100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select defaultValue="normal">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full">Cadastrar Cliente</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientRegistration;
