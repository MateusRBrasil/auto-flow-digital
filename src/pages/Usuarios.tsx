
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const Usuarios: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os usuários do sistema.
          </p>
        </div>
        <Button asChild>
          <Link to="/usuarios/novo">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Link>
        </Button>
      </div>
      
      <Separator />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Lista de Usuários</h3>
        <p className="text-muted-foreground">Nenhum usuário cadastrado</p>
      </div>
    </div>
  );
};

export default Usuarios;
