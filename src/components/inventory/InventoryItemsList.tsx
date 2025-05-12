
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, Plus, Minus } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';
import InventoryItemDetailsDialog from '@/components/modals/InventoryItemDetailsDialog';
import AddInventoryMovementDialog from '@/components/modals/AddInventoryMovementDialog';

// Mock data - em produção viria do banco de dados
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Placa de Alumínio Padrão Mercosul',
    description: 'Placa veicular padrão Mercosul para carros',
    unit: 'unidade',
    currentQuantity: 150,
    minimumQuantity: 50,
    category: 'placa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Placa de Moto Padrão Mercosul',
    description: 'Placa veicular padrão Mercosul para motos',
    unit: 'unidade',
    currentQuantity: 45,
    minimumQuantity: 30,
    category: 'placa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Lacre de Segurança Plástico',
    description: 'Lacre de segurança para placas veiculares',
    unit: 'unidade',
    currentQuantity: 320,
    minimumQuantity: 100,
    category: 'lacre',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Suporte Dianteiro para Placas',
    description: 'Suporte para fixação de placas dianteiras',
    unit: 'unidade',
    currentQuantity: 75,
    minimumQuantity: 40,
    category: 'suporte',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Suporte Traseiro para Placas',
    description: 'Suporte para fixação de placas traseiras',
    unit: 'unidade',
    currentQuantity: 20,
    minimumQuantity: 30, // Abaixo do estoque mínimo
    category: 'suporte',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface InventoryItemsListProps {
  searchTerm: string;
}

const InventoryItemsList: React.FC<InventoryItemsListProps> = ({ searchTerm }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('entrada');

  // Filtra os items com base no termo de busca
  const filteredItems = mockInventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDetailsDialog(true);
  };

  const handleAddEntry = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementType('entrada');
    setShowMovementDialog(true);
  };

  const handleRemove = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementType('saida');
    setShowMovementDialog(true);
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'placa': 'Placa',
      'suporte': 'Suporte',
      'lacre': 'Lacre',
      'adesivo': 'Adesivo',
      'documento': 'Documento',
      'outro': 'Outro'
    };
    return categories[category] || category;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-center">Qtd. Atual</TableHead>
              <TableHead className="text-center">Qtd. Min</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  {searchTerm 
                    ? "Nenhum item encontrado para a busca realizada." 
                    : "Nenhum item cadastrado. Clique em 'Novo Item' para começar."}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-2">
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      {item.currentQuantity < item.minimumQuantity && (
                        <span className="mt-0.5">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${item.currentQuantity < item.minimumQuantity ? 'text-destructive' : ''}`}>
                      {item.currentQuantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.minimumQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleAddEntry(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleRemove(item)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleOpenDetails(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <>
          <InventoryItemDetailsDialog 
            item={selectedItem}
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
          />
          
          <AddInventoryMovementDialog 
            item={selectedItem}
            movementType={movementType}
            open={showMovementDialog}
            onOpenChange={setShowMovementDialog}
          />
        </>
      )}
    </>
  );
};

export default InventoryItemsList;
