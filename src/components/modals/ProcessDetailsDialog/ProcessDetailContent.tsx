
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Process } from '../ProcessEditDialog/types';

interface ProcessDetailContentProps {
  process: Process;
}

const ProcessDetailContent: React.FC<ProcessDetailContentProps> = ({ process }) => {
  const formattedDate = new Date(process.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <StatusBadge status={process.status} />
        {process.priority && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Prioritário
          </Badge>
        )}
      </div>
      
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
  );
};

export default ProcessDetailContent;
