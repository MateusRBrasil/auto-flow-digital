
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from './types';
import ColorPreview from './ColorPreview';

interface ColorFormFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

const ColorFormFields: React.FC<ColorFormFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField 
          control={form.control} 
          name="primaryColor" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor Principal</FormLabel>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-md border" 
                  style={{ backgroundColor: field.value }} 
                />
                <FormControl>
                  <Input placeholder="#1e40af" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Utilizada em títulos e botões principais.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="secondaryColor" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor Secundária</FormLabel>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-md border" 
                  style={{ backgroundColor: field.value || '#1d4ed8' }} 
                />
                <FormControl>
                  <Input placeholder="#1d4ed8" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Utilizada em botões secundários e destaques.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="accentColor" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor de Destaque</FormLabel>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-md border" 
                  style={{ backgroundColor: field.value || '#3b82f6' }} 
                />
                <FormControl>
                  <Input placeholder="#3b82f6" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Utilizada para elementos de destaque e ícones.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
      
      <ColorPreview watch={form.watch} />
    </>
  );
};

export default ColorFormFields;
