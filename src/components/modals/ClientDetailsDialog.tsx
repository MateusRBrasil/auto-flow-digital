
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
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Mail, Phone, Pencil } from "lucide-react";

interface Client {
  id: string;
  name: string;
  type: 'avulso' | 'despachante';
  document: string;
  email: string;
  phone: string;
  billingAddress?: string;
  deliveryAddress?: string;
  discount?: number;
  processesCount: number;
}

interface ClientDetailsDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onViewProcesses: () => void;
}

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({
  client,
  open,
  onOpenChange,
  onEdit,
  onViewProcesses
}) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{client.name}</span>
            <Badge variant="outline" className={client.type === 'despachante' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}>
              {client.type === 'despachante' ? 'Despachante' : 'Cliente Avulso'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {client.id} - {client.document}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          </div>

          <Separator />
          
          {client.billingAddress && (
            <>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Endereço de Cobrança</h4>
                <p className="text-sm">{client.billingAddress}</p>
              </div>
            </>
          )}
          
          {client.deliveryAddress && (
            <>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Endereço de Entrega</h4>
                <p className="text-sm">{client.deliveryAddress}</p>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Processos</h4>
              <p className="text-base font-medium">{client.processesCount}</p>
            </div>
            
            {client.type === 'despachante' && client.discount && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Desconto</h4>
                <p className="text-base font-medium text-green-600">{client.discount}%</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1 flex justify-start">
            <Button variant="outline" onClick={onViewProcesses}>
              <FileText className="h-4 w-4 mr-2" />
              Ver Processos
            </Button>
          </div>
          
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
