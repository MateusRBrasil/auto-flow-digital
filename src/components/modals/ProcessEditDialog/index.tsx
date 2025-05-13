
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
import ProcessEditForm from './ProcessEditForm';
import { Process, ProcessFormData } from './types';

interface ProcessEditDialogProps {
  process: Process | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProcessFormData) => void;
}

const ProcessEditDialog: React.FC<ProcessEditDialogProps> = ({
  process,
  open,
  onOpenChange,
  onSave
}) => {
  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Pedido {process.id}</DialogTitle>
          <DialogDescription>
            Atualize as informações do pedido. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <ProcessEditForm 
          process={process} 
          onSave={onSave} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProcessEditDialog;
