
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InventoryMovement } from '@/types/inventory';

// Mock data - em produção viria do banco de dados
const mockInventoryMovements: (InventoryMovement & { itemName: string; userName: string })[] = [
  {
    id: '1',
    itemId: '1',
    itemName: 'Placa de Alumínio Padrão Mercosul',
    quantity: 50,
    previousQuantity: 100,
    newQuantity: 150,
    movementType: 'entrada',
    reason: 'Reposição de estoque',
    userId: 'user1',
    userName: 'Admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    itemId: '1',
    itemName: 'Placa de Alumínio Padrão Mercosul',
    quantity: 2,
    previousQuantity: 152,
    newQuantity: 150,
    movementType: 'saida',
    processId: 'process123',
    reason: 'Emplacamento - Processo #123',
    userId: 'user2',
    userName: 'Carlos Silva',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
  },
  {
    id: '3',
    itemId: '3',
    itemName: 'Lacre de Segurança Plástico',
    quantity: 100,
    previousQuantity: 220,
    newQuantity: 320,
    movementType: 'entrada',
    reason: 'Compra de fornecedor',
    userId: 'user1',
    userName: 'Admin',
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 dias atrás
  },
  {
    id: '4',
    itemId: '4',
    itemName: 'Suporte Dianteiro para Placas',
    quantity: 5,
    previousQuantity: 80,
    newQuantity: 75,
    movementType: 'saida',
    processId: 'process124',
    reason: 'Transferência - Processo #124',
    userId: 'user2',
    userName: 'Carlos Silva',
    createdAt: new Date(Date.now() - 259200000).toISOString() // 3 dias atrás
  },
  {
    id: '5',
    itemId: '5',
    itemName: 'Suporte Traseiro para Placas',
    quantity: 10,
    previousQuantity: 30,
    newQuantity: 20,
    movementType: 'saida',
    processId: 'process125',
    reason: 'Emplacamento - Processo #125',
    userId: 'user3',
    userName: 'Ana Santos',
    createdAt: new Date(Date.now() - 345600000).toISOString() // 4 dias atrás
  }
];

interface InventoryMovementsListProps {
  searchTerm: string;
}

const InventoryMovementsList: React.FC<InventoryMovementsListProps> = ({ searchTerm }) => {
  // Filtra os movimentos com base no termo de busca
  const filteredMovements = mockInventoryMovements.filter(movement => 
    movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Usuário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                {searchTerm 
                  ? "Nenhuma movimentação encontrada para a busca realizada." 
                  : "Nenhuma movimentação registrada no sistema."}
              </TableCell>
            </TableRow>
          ) : (
            filteredMovements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{formatDate(movement.createdAt)}</TableCell>
                <TableCell className="font-medium">{movement.itemName}</TableCell>
                <TableCell>
                  <Badge variant={movement.movementType === 'entrada' ? 'success' : 'destructive'}>
                    {movement.movementType === 'entrada' ? 'Entrada' : 'Saída'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`font-medium ${movement.movementType === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.movementType === 'entrada' ? '+' : '-'}{movement.quantity}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {movement.previousQuantity} → {movement.newQuantity}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{movement.reason}</TableCell>
                <TableCell>{movement.userName}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryMovementsList;
