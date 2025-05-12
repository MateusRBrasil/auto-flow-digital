
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormReturn } from './types';
import ColorPaletteSelector from './ColorPaletteSelector';
import ColorFormFields from './ColorFormFields';

interface AppearanceTabContentProps {
  form: UseFormReturn<TenantFormReturn>;
  selectedPalette: string;
  handlePaletteChange: (paletteId: string) => void;
  logoUrl: string;
}

const AppearanceTabContent: React.FC<AppearanceTabContentProps> = ({
  form,
  selectedPalette,
  handlePaletteChange,
  logoUrl
}) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Logotipo</h3>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-20 h-20 rounded-md border flex items-center justify-center bg-slate-100">
              <img 
                src={logoUrl || "/placeholder.svg"} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
            <Button variant="outline" type="button">
              Alterar Logo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Formatos recomendados: PNG ou SVG. Tamanho máximo: 2MB.
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Paletas de Cores</h3>
          <p className="text-sm text-muted-foreground">
            Escolha uma paleta de cores predefinida ou personalize as cores individuais.
          </p>
          
          <ColorPaletteSelector 
            form={form} 
            selectedPalette={selectedPalette} 
            onPaletteChange={handlePaletteChange} 
          />
        </div>
        
        <Separator />
        
        <ColorFormFields form={form} />
      </CardContent>
    </Card>
  );
};

export default AppearanceTabContent;
