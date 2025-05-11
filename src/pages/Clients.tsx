
import React, { useState } from 'react';
import { PlusCircle, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import NewClientForm from '@/components/forms/NewClientForm';

// Mock data for clients
const mockClients = [
  {
    id: "CLI-001",
    name: "João Silva",
    type: "avulso",
    document: "123.456.789-00",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    processesCount: 3
  },
  {
    id: "CLI-002",
    name: "Despachante Rápido LTDA",
    type: "despachante",
    document: "12.345.678/0001-90",
    email: "contato@despachanterepido.com",
    phone: "(11) 3456-7890",
    discount: 15,
    processesCount: 12
  },
  {
    id: "CLI-003",
    name: "Maria Santos",
    type: "avulso",
    document: "987.654.321-00",
    email: "maria.santos@email.com",
    phone: "(11) 91234-5678",
    processesCount: 1
  },
  {
    id: "CLI-004",
    name: "Auto Despachos S.A.",
    type: "despachante",
    document: "98.765.432/0001-10",
    email: "contato@autodespachos.com",
    phone: "(11) 2345-6789",
    discount: 20,
    processesCount: 27
  }
];

const ClientCard: React.FC<{ client: any }> = ({ client }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              client.type === 'despachante' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {client.type === 'despachante' ? 'Despachante' : 'Cliente Avulso'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">{client.id}</div>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-muted-foreground">Documento:</div>
              <div>{client.document}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Processos:</div>
              <div>{client.processesCount}</div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground">Email:</div>
              <div>{client.email}</div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground">Telefone:</div>
              <div>{client.phone}</div>
            </div>
            {client.discount && (
              <div className="col-span-2">
                <div className="text-muted-foreground">Desconto:</div>
                <div className="text-green-600 dark:text-green-400 font-medium">{client.discount}%</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="secondary" size="sm">Ver Detalhes</Button>
          <Button variant="outline" size="sm">Editar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.document.includes(searchTerm) ||
                          client.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo cliente
              </DialogDescription>
            </DialogHeader>
            <NewClientForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, documento ou ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="avulso">Cliente Avulso</SelectItem>
            <SelectItem value="despachante">Despachante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum cliente encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;
