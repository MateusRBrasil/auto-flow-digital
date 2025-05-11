
import React, { useState } from 'react';
import { PlusCircle, Search, Filter } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import NewProcessForm from '@/components/forms/NewProcessForm';
import ProcessCard from '@/components/ProcessCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for processes
const mockProcesses = [
  {
    id: "PROC-001",
    clientName: "João Silva",
    clientType: "avulso" as const,
    processType: "Emplacamento",
    plateNumber: "ABC-1234",
    priority: false,
    status: "em_andamento" as const,
    createdAt: "2023-05-10T10:00:00Z"
  },
  {
    id: "PROC-002",
    clientName: "Despachante Rápido LTDA",
    clientType: "despachante" as const,
    processType: "Transferência",
    plateNumber: "DEF-5678",
    priority: true,
    status: "aguardando_documentos" as const,
    createdAt: "2023-05-09T15:30:00Z"
  },
  {
    id: "PROC-003",
    clientName: "Maria Santos",
    clientType: "avulso" as const,
    processType: "2ª Via de Placa",
    plateNumber: "GHI-9012",
    priority: false,
    status: "pendente" as const,
    createdAt: "2023-05-08T09:15:00Z"
  },
  {
    id: "PROC-004",
    clientName: "Auto Despachos S.A.",
    clientType: "despachante" as const,
    processType: "Emplacamento",
    plateNumber: "JKL-3456",
    priority: true,
    status: "concluido" as const,
    createdAt: "2023-05-07T14:45:00Z"
  },
  {
    id: "PROC-005",
    clientName: "Paulo Andrade",
    clientType: "avulso" as const,
    processType: "Licenciamento",
    plateNumber: "MNO-7890",
    priority: false,
    status: "pendente" as const,
    createdAt: "2023-05-06T11:20:00Z"
  },
  {
    id: "PROC-006",
    clientName: "Despachantes Unidos LTDA",
    clientType: "despachante" as const,
    processType: "Transferência",
    plateNumber: "PQR-1234",
    priority: false,
    status: "em_andamento" as const,
    createdAt: "2023-05-05T16:10:00Z"
  }
];

const Processes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState(false);
  const [processTypeFilter, setProcessTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredProcesses = mockProcesses.filter(process => {
    const matchesSearch = 
      process.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || process.status === statusFilter;
    const matchesClientType = clientTypeFilter === "all" || process.clientType === clientTypeFilter;
    const matchesPriority = !priorityFilter || process.priority === true;
    const matchesProcessType = 
      processTypeFilter === "all" || 
      process.processType.toLowerCase() === processTypeFilter;
    
    return matchesSearch && matchesStatus && matchesClientType && matchesPriority && matchesProcessType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Processos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Processo</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo processo
              </DialogDescription>
            </DialogHeader>
            <NewProcessForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, cliente ou placa..."
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
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="aguardando_documentos">Aguardando Docs</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Filtros Avançados</h4>
              <Separator />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Cliente</label>
                <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="avulso">Cliente Avulso</SelectItem>
                    <SelectItem value="despachante">Despachante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Processo</label>
                <Select value={processTypeFilter} onValueChange={setProcessTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de processo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="emplacamento">Emplacamento</SelectItem>
                    <SelectItem value="transferência">Transferência</SelectItem>
                    <SelectItem value="2ª via de placa">2ª Via de Placa</SelectItem>
                    <SelectItem value="licenciamento">Licenciamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="priority" 
                  checked={priorityFilter} 
                  onCheckedChange={(checked) => setPriorityFilter(checked as boolean)} 
                />
                <label 
                  htmlFor="priority" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apenas prioritários
                </label>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setClientTypeFilter("all");
                    setProcessTypeFilter("all");
                    setPriorityFilter(false);
                  }}
                  className="mr-2"
                >
                  Limpar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowFilters(false)}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProcesses.map(process => (
          <ProcessCard key={process.id} {...process} />
        ))}
      </div>
      
      {filteredProcesses.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum processo encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Processes;
