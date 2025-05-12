
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { colorPalettes } from './color-palettes';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormReturn } from './types';

interface ColorPaletteSelectorProps {
  form: UseFormReturn<TenantFormReturn>;
  selectedPalette: string;
  onPaletteChange: (paletteId: string) => void;
}

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({
  form,
  selectedPalette,
  onPaletteChange
}) => {
  return (
    <FormField 
      control={form.control} 
      name="colorPalette" 
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup 
              onValueChange={(value) => {
                field.onChange(value);
                onPaletteChange(value);
              }} 
              defaultValue={field.value} 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {colorPalettes.map(palette => (
                <div 
                  key={palette.id} 
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${selectedPalette === palette.id ? 'ring-2 ring-primary' : ''}`}
                >
                  <RadioGroupItem value={palette.id} id={palette.id} />
                  <div className="flex flex-col">
                    <label htmlFor={palette.id} className="font-medium">{palette.name}</label>
                    <div className="flex gap-2 mt-2">
                      <div 
                        style={{ backgroundColor: palette.colors.primary }} 
                        className="w-6 h-6 rounded" 
                      />
                      <div 
                        style={{ backgroundColor: palette.colors.secondary }} 
                        className="w-6 h-6 rounded" 
                      />
                      <div 
                        style={{ backgroundColor: palette.colors.accent }} 
                        className="w-6 h-6 rounded" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};

export default ColorPaletteSelector;
