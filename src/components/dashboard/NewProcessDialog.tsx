
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewProcessForm from '@/components/forms/NewProcessForm';
import { Plus } from 'lucide-react';

const NewProcessDialog: React.FC = () => {
  return (
    <Dialog>
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
        <NewProcessForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewProcessDialog;
