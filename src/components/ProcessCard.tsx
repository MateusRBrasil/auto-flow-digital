
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from './StatusBadge';

interface ProcessCardProps {
  id: string;
  clientName: string;
  clientType: 'avulso' | 'despachante';
  processType: string;
  plateNumber?: string;
  priority: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_documentos';
  createdAt: string;
  onClick?: () => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  id,
  clientName,
  clientType,
  processType,
  plateNumber,
  priority,
  status,
  createdAt,
  onClick
}) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start space-y-0">
        <div>
          <div className="text-sm font-medium text-muted-foreground">{id}</div>
          <h3 className="font-semibold">{clientName}</h3>
        </div>
        <div className="flex flex-col items-end">
          <StatusBadge status={status} />
          {priority && (
            <span className="text-xs font-medium text-amber-600 mt-1">Prioritário</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p className="font-medium">{processType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cliente</p>
            <p className="font-medium capitalize">{clientType}</p>
          </div>
          {plateNumber && (
            <div className="col-span-2">
              <p className="text-muted-foreground">Placa</p>
              <p className="font-medium">{plateNumber}</p>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-muted-foreground">Data</p>
            <p className="font-medium">{new Date(createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/30 border-t flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClick}>
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProcessCard;
