
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormReturn } from './types';

interface SettingsTabContentProps {
  form: UseFormReturn<TenantFormReturn>;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="companyName" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nome oficial da sua empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="subdomain" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdomínio</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input placeholder="suaempresa" {...field} />
                  </FormControl>
                  <div className="flex items-center bg-muted px-3 border border-l-0 rounded-r-md text-muted-foreground whitespace-nowrap">
                    .veicsys.com.br
                  </div>
                </div>
                <FormDescription>
                  Este será o endereço da sua página pública.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
        
        <FormField 
          control={form.control} 
          name="publicPageEnabled" 
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Página Pública Ativa</FormLabel>
                <FormDescription>
                  Quando ativada, sua página pública estará disponível na web.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )} 
        />
      </CardContent>
    </Card>
  );
};

export default SettingsTabContent;
