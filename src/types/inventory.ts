
export type InventoryItemCategory = 
  | 'placa'
  | 'suporte'
  | 'lacre'
  | 'adesivo'
  | 'documento'
  | 'outro';

export type InventoryUnit = 'unidade' | 'par' | 'kit' | 'caixa' | 'metro' | 'litro';

export type InventoryItemMovementType = 'entrada' | 'saida' | 'ajuste';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  unit: InventoryUnit;
  currentQuantity: number;
  minimumQuantity: number; // Quantidade que dispara o alerta
  category: InventoryItemCategory;
  createdAt: string; // Data ISO
  updatedAt: string; // Data ISO
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  movementType: InventoryItemMovementType;
  reason?: string;
  processId?: string; // Se for vinculado a um processo
  userId: string;
  createdAt: string; // Data ISO
}

// Mapeamento de consumo de itens por tipo de serviço e veículo
export interface ConsumptionRule {
  serviceType: string;
  vehicleType: string;
  itemId: string;
  suggestedQuantity: number;
}
