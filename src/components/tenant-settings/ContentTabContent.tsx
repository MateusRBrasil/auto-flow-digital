
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormReturn } from './types';

interface ContentTabContentProps {
  form: UseFormReturn<TenantFormReturn>;
}

const ContentTabContent: React.FC<ContentTabContentProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <FormField 
          control={form.control} 
          name="welcomeTitle" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de Boas-vindas</FormLabel>
              <FormControl>
                <Input placeholder="Bem-vindo à sua empresa" {...field} />
              </FormControl>
              <FormDescription>
                Este título será exibido no topo da sua página.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="welcomeDescription" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição de Boas-vindas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Uma breve descrição sobre os serviços da sua empresa" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Esta descrição será exibida logo abaixo do título de boas-vindas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="aboutText" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto Sobre a Empresa</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações detalhadas sobre sua empresa, histórico, missão, etc." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Este texto será exibido na seção "Sobre Nós" da sua página.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
      </CardContent>
    </Card>
  );
};

export default ContentTabContent;
