
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from './StatusBadge';
import { Eye, Pencil } from "lucide-react";
import ProcessDetailsDialog from './modals/ProcessDetailsDialog';
import ProcessEditDialog from './modals/ProcessEditDialog';
import StatusChangeDialog from './modals/StatusChangeDialog';
import { toast } from "sonner";

interface ProcessCardProps {
  id: string;
  clientName: string;
  clientType: 'avulso' | 'despachante';
  processType: string;
  plateNumber?: string;
  priority: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_documentos';
  createdAt: string;
  observations?: string;
  deliveryAddress?: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  id,
  clientName,
  clientType,
  processType,
  plateNumber,
  priority,
  status,
  createdAt,
  observations,
  deliveryAddress
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);

  // Dados simulados de documentos para o exemplo
  const dummyDocuments = [
    { name: "Documento do Veículo.pdf", url: "#" },
    { name: "Comprovante de Pagamento.pdf", url: "#" }
  ];

  // Dados completos do processo para os modais
  const processData = {
    id,
    clientName,
    clientType,
    processType,
    plateNumber,
    priority,
    status,
    createdAt,
    observations,
    deliveryAddress,
    documents: dummyDocuments
  };

  const handleEditSave = (data: any) => {
    console.log("Dados editados:", data);
    // Aqui você implementaria a lógica para salvar as alterações
    toast.success(`Processo ${id} atualizado com sucesso!`);
  };

  const handleStatusChange = (newStatus: string, comment: string) => {
    console.log(`Status alterado para: ${newStatus}. Comentário: ${comment}`);
    // Aqui você implementaria a lógica para alterar o status
    toast.success(`Status do processo ${id} alterado para ${newStatus}`);
  };

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start space-y-0">
          <div>
            <div className="text-sm font-medium text-muted-foreground">{id}</div>
            <h3 className="font-semibold">{clientName}</h3>
          </div>
          <div className="flex flex-col items-end">
            <StatusBadge status={status} />
            {priority && (
              <span className="text-xs font-medium text-amber-600 mt-1">Prioritário</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Tipo</p>
              <p className="font-medium">{processType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cliente</p>
              <p className="font-medium capitalize">{clientType}</p>
            </div>
            {plateNumber && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Placa</p>
                <p className="font-medium">{plateNumber}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-muted-foreground">Data</p>
              <p className="font-medium">{new Date(createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-muted/30 border-t flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsDetailsOpen(true)}>
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
        </CardFooter>
      </Card>

      {/* Modais */}
      <ProcessDetailsDialog 
        process={processData}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={() => {
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
        onStatusChange={() => {
          setIsDetailsOpen(false);
          setIsStatusChangeOpen(true);
        }}
      />
      
      <ProcessEditDialog 
        process={processData}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleEditSave}
      />

      <StatusChangeDialog
        currentStatus={status}
        processId={id}
        open={isStatusChangeOpen}
        onOpenChange={setIsStatusChangeOpen}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default ProcessCard;
