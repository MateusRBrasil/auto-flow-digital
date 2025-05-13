
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Process } from '../ProcessEditDialog/types';

interface ProcessActionsProps {
  process: Process;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
}

const ProcessActions: React.FC<ProcessActionsProps> = ({
  process,
  onClose,
  onEdit,
  onStatusChange
}) => {
  return (
    <>
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
    </>
  );
};

export default ProcessActions;
