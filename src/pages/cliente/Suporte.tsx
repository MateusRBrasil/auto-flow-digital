
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ClienteSuporte: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
        <p className="text-muted-foreground">
          Entre em contato conosco para obter ajuda.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Enviar Mensagem</h3>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Assunto</label>
              <Input id="subject" placeholder="Sobre o que deseja falar?" />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Mensagem</label>
              <Textarea id="message" placeholder="Descreva sua dúvida ou problema em detalhes..." className="min-h-[150px]" />
            </div>
            
            <Button className="w-full">Enviar Mensagem</Button>
          </form>
        </div>
        
        <div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border mb-6">
            <h3 className="text-lg font-medium mb-2">Contato</h3>
            <p className="text-muted-foreground mb-4">Outras formas de nos contatar:</p>
            
            <div className="space-y-2">
              <p><strong>Email:</strong> suporte@exemplo.com</p>
              <p><strong>Telefone:</strong> (11) 1234-5678</p>
              <p><strong>WhatsApp:</strong> (11) 98765-4321</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Horário de Atendimento</h3>
            <p className="text-muted-foreground">Segunda a Sexta: 8h às 18h</p>
            <p className="text-muted-foreground">Sábado: 9h às 13h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteSuporte;
