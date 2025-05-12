
import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TenantFormReturn } from './types';

interface ColorPreviewProps {
  watch: UseFormWatch<TenantFormReturn>;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({ watch }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
      <div className="text-center space-y-2">
        <h4 className="font-medium">Prévia das Cores</h4>
        <div className="flex justify-center gap-4">
          <Button 
            type="button" 
            style={{
              backgroundColor: watch('primaryColor'),
              color: '#ffffff'
            }}
          >
            Botão Principal
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            style={{
              borderColor: watch('secondaryColor'),
              color: watch('secondaryColor')
            }}
          >
            Botão Secundário
          </Button>
        </div>
        <div 
          className="mt-2 p-2 rounded-md" 
          style={{
            backgroundColor: watch('accentColor'),
            color: '#ffffff'
          }}
        >
          Elemento de Destaque
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;
