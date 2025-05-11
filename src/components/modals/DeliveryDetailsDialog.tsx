
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Pencil, FileText } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

interface Delivery {
  id: string;
  processId: string;
  clientName: string;
  address: string;
  scheduledDate: string;
  deliveryType: 'interno' | 'parceiro';
  deliveryPerson?: string;
  deliveryPartner?: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
}

interface DeliveryDetailsDialogProps {
  delivery: Delivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onViewProcess: () => void;
  onComplete?: () => void;
}

const getDeliveryStatusName = (status: string) => {
  switch (status) {
    case 'agendada':
      return 'Agendada';
    case 'em_andamento':
      return 'Em Andamento';
    case 'concluida':
      return 'Concluída';
    case 'cancelada':
      return 'Cancelada';
    default:
      return status;
  }
};

const DeliveryDetailsDialog: React.FC<DeliveryDetailsDialogProps> = ({
  delivery,
  open,
  onOpenChange,
  onEdit,
  onViewProcess,
  onComplete
}) => {
  if (!delivery) return null;

  const formattedDate = new Date(delivery.scheduledDate).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Entrega</span>
            <StatusBadge status={delivery.status === 'agendada' ? 'pendente' : 
                               delivery.status === 'concluida' ? 'concluido' : 
                               delivery.status === 'cancelada' ? 'cancelado' : 'em_andamento'} />
          </DialogTitle>
          <DialogDescription>
            Entrega {delivery.id} - Processo {delivery.processId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
            <p className="text-base">{delivery.clientName}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Endereço</h4>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{delivery.address}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Data e Hora Programada</h4>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formattedDate}</p>
            </div>
          </div>

          <Separator />
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Responsável pela Entrega</h4>
            <p className="text-sm">
              {delivery.deliveryType === 'interno' 
                ? `Entregador: ${delivery.deliveryPerson}` 
                : `App Parceiro: ${delivery.deliveryPartner}`}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
            <p className="text-sm font-medium">{getDeliveryStatusName(delivery.status)}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1 flex justify-start">
            <Button variant="outline" onClick={onViewProcess}>
              <FileText className="h-4 w-4 mr-2" />
              Ver Processo
            </Button>
          </div>
          
          <div className="space-x-2">
            {delivery.status === 'agendada' && (
              <Button variant="outline" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            
            {delivery.status === 'em_andamento' && onComplete && (
              <Button onClick={onComplete}>
                Marcar Concluída
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDetailsDialog;
