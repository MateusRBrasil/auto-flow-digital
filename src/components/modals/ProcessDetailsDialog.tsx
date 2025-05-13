
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

interface Process {
  id: string;
  clientName: string;
  clientType: 'avulso' | 'despachante';
  processType: string;
  plateNumber?: string;
  priority: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_documentos';
  createdAt: string;
  documents?: { name: string; url: string }[];
  observations?: string;
  deliveryAddress?: string;
}

interface ProcessDetailsDialogProps {
  process: Process | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onStatusChange: () => void;
}

const ProcessDetailsDialog: React.FC<ProcessDetailsDialogProps> = ({
  process,
  open,
  onOpenChange,
  onEdit,
  onStatusChange
}) => {
  if (!process) return null;

  const formattedDate = new Date(process.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Pedido {process.id}</span>
            <StatusBadge status={process.status} />
          </DialogTitle>
          <DialogDescription>
            Visualize todas as informações do pedido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {process.priority && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-2">
              Prioritário
            </Badge>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
              <p className="text-base">{process.clientName}</p>
              <p className="text-sm text-muted-foreground capitalize">{process.clientType}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Tipo de Pedido</h4>
              <p className="text-base">{process.processType}</p>
            </div>

            {process.plateNumber && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Placa</h4>
                <p className="text-base font-medium">{process.plateNumber}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Data de Entrada</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formattedDate}</p>
              </div>
            </div>
          </div>

          <Separator />
          
          {process.deliveryAddress && (
            <>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Endereço de Entrega</h4>
                <p className="text-sm">{process.deliveryAddress}</p>
              </div>
              <Separator />
            </>
          )}

          {process.observations && (
            <>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Observações</h4>
                <p className="text-sm">{process.observations}</p>
              </div>
              <Separator />
            </>
          )}

          {process.documents && process.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Documentos</h4>
              <div className="grid grid-cols-1 gap-2">
                {process.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">Visualizar</a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Histórico de alterações - visível apenas para administradores */}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">Histórico de Alterações</h4>
            </div>
            <div className="text-xs text-muted-foreground mt-1 p-2 bg-muted/30 rounded-md">
              <div className="flex justify-between mb-1">
                <span>Criação do pedido</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Status alterado para {process.status}</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1 flex justify-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O pedido será removido permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                    Sim, excluir pedido
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={onStatusChange}>
              Alterar Status
            </Button>
            <Button onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessDetailsDialog;
