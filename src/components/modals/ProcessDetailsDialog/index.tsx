
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
import { Process } from '../ProcessEditDialog/types';
import ProcessDetailContent from './ProcessDetailContent';
import ProcessActions from './ProcessActions';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Pedido {process.id}</span>
          </DialogTitle>
          <DialogDescription>
            Visualize todas as informações do pedido
          </DialogDescription>
        </DialogHeader>

        <ProcessDetailContent process={process} />
        
        <DialogFooter>
          <ProcessActions 
            process={process} 
            onClose={() => onOpenChange(false)} 
            onEdit={onEdit} 
            onStatusChange={onStatusChange} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessDetailsDialog;
