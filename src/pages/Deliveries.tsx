
import React, { useState } from 'react';
import { PlusCircle, Search, MapPin, Calendar } from "lucide-react";
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
import NewDeliveryForm from '@/components/forms/NewDeliveryForm';
import StatusBadge from '@/components/StatusBadge';

// Mock data for deliveries
const mockDeliveries = [
  {
    id: "DEL-001",
    processId: "PROC-001",
    clientName: "João Silva",
    address: "Rua das Flores, 123, Centro, São Paulo/SP",
    scheduledDate: "2023-05-12T14:00:00Z",
    deliveryType: "interno",
    deliveryPerson: "Carlos Silva",
    status: "agendada"
  },
  {
    id: "DEL-002",
    processId: "PROC-002",
    clientName: "Despachante Rápido LTDA",
    address: "Av. Paulista, 1000, Bela Vista, São Paulo/SP",
    scheduledDate: "2023-05-11T10:30:00Z",
    deliveryType: "parceiro",
    deliveryPartner: "Uber",
    status: "em_andamento"
  },
  {
    id: "DEL-003",
    processId: "PROC-003",
    clientName: "Maria Santos",
    address: "Rua dos Pinheiros, 500, Pinheiros, São Paulo/SP",
    scheduledDate: "2023-05-10T16:15:00Z",
    deliveryType: "interno",
    deliveryPerson: "Pedro Santos",
    status: "concluida"
  },
  {
    id: "DEL-004",
    processId: "PROC-004",
    clientName: "Auto Despachos S.A.",
    address: "Av. Faria Lima, 2000, Itaim Bibi, São Paulo/SP",
    scheduledDate: "2023-05-13T09:45:00Z",
    deliveryType: "parceiro",
    deliveryPartner: "99",
    status: "agendada"
  }
];

const DeliveryCard: React.FC<{ delivery: any }> = ({ delivery }) => {
  const formattedDate = new Date(delivery.scheduledDate).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendada':
        return <StatusBadge status="pendente" />;
      case 'em_andamento':
        return <StatusBadge status="em_andamento" />;
      case 'concluida':
        return <StatusBadge status="concluido" />;
      case 'cancelada':
        return <StatusBadge status="cancelado" />;
      default:
        return <StatusBadge status="pendente" />;
    }
  };
  
  const getDeliveryTypeLabel = () => {
    if (delivery.deliveryType === 'interno') {
      return `Entregador: ${delivery.deliveryPerson}`;
    } else {
      return `App: ${delivery.deliveryPartner}`;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{delivery.clientName}</h3>
            <div className="text-sm text-muted-foreground">{delivery.processId}</div>
          </div>
          <div>
            {getStatusBadge(delivery.status)}
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">{delivery.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground mr-1">Entrega:</span>
            {getDeliveryTypeLabel()}
          </div>
        </div>
        
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="secondary" size="sm">Ver Detalhes</Button>
          
          {delivery.status === 'agendada' && (
            <Button variant="outline" size="sm">Editar</Button>
          )}
          
          {delivery.status === 'em_andamento' && (
            <Button size="sm">Marcar Concluída</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Deliveries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.processId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    const matchesType = typeFilter === "all" || delivery.deliveryType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Entregas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Entrega
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Entrega</DialogTitle>
              <DialogDescription>
                Preencha os dados para agendar uma nova entrega
              </DialogDescription>
            </DialogHeader>
            <NewDeliveryForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, cliente, processo ou endereço..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="agendada">Agendada</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="interno">Entregador Próprio</SelectItem>
            <SelectItem value="parceiro">App Parceiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map(delivery => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))}
      </div>
      
      {filteredDeliveries.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhuma entrega encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Deliveries;
