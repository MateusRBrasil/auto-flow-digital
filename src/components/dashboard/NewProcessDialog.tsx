
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewProcessForm from '@/components/forms/NewProcessForm';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface NewProcessDialogProps {
  onProcessCreated?: () => void;
}

const NewProcessDialog: React.FC<NewProcessDialogProps> = ({ onProcessCreated }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleProcessSubmit = () => {
    toast.success("Processo criado com sucesso!");
    setOpen(false);
    if (onProcessCreated) {
      onProcessCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
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
        <NewProcessForm onSubmitSuccess={handleProcessSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewProcessDialog;
