
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_documentos';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'aguardando_documentos':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      case 'aguardando_documentos':
        return 'Aguardando Documentos';
      default:
        return status;
    }
  };

  return (
    <span 
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium rounded-full border', 
        getStatusStyles(),
        className
      )}
    >
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
