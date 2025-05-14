
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const VendedorCadastrarCliente: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cadastrar Cliente</h1>
        <p className="text-muted-foreground">
          Adicione um novo cliente à sua carteira.
        </p>
      </div>
      
      <Separator />
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">Formulário em desenvolvimento</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendedorCadastrarCliente;
