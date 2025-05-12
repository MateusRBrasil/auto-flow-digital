
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileDown, FileUp, AlertTriangle } from 'lucide-react';
import InventoryItemsList from '@/components/inventory/InventoryItemsList';
import InventoryMovementsList from '@/components/inventory/InventoryMovementsList';
import NewInventoryItemDialog from '@/components/modals/NewInventoryItemDialog';
import InventoryImportExport from '@/components/inventory/InventoryImportExport';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('items');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Controle de Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie materiais, controle estoque e visualize movimentações
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setShowNewItemDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Item</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <FileUp className="h-4 w-4" />
            <span>Importar</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <Tabs defaultValue="items" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Itens</TabsTrigger>
              <TabsTrigger value="movements">Movimentações</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div>
        <TabsContent value="items" className="mt-0 p-0" hidden={activeTab !== "items"}>
          <InventoryItemsList searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="movements" className="mt-0 p-0" hidden={activeTab !== "movements"}>
          <InventoryMovementsList searchTerm={searchTerm} />
        </TabsContent>
      </div>

      <NewInventoryItemDialog 
        open={showNewItemDialog} 
        onOpenChange={setShowNewItemDialog}
      />
    </div>
  );
};

export default Inventory;
