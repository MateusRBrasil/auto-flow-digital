
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import ClientRegistration from '@/components/ClientRegistration';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Index = () => {
  const [showClientForm, setShowClientForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao VeícSys</h2>
            <Button 
              onClick={() => setShowClientForm(!showClientForm)}
              className="bg-primary hover:bg-primary/90"
            >
              {showClientForm ? 'Voltar ao Dashboard' : 'Novo Cliente'}
            </Button>
          </div>
          
          {showClientForm ? (
            <div className="max-w-3xl mx-auto">
              <ClientRegistration />
            </div>
          ) : (
            <Tabs defaultValue="dashboard" className="space-y-4">
              <div className="border-b">
                <TabsList className="mb-[-1px]">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="processes">Processos</TabsTrigger>
                  <TabsTrigger value="clients">Clientes</TabsTrigger>
                  <TabsTrigger value="deliveries">Entregas</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="dashboard" className="p-0 border-0">
                <Dashboard />
              </TabsContent>
              
              <TabsContent value="processes" className="p-0 border-0">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-medium mb-4">Módulo de Processos</h3>
                  <p className="text-muted-foreground">
                    Aqui você poderá gerenciar todos os tipos de processos veiculares, como emplacamentos, 
                    transferências, segundas vias e muito mais. Esta funcionalidade será implementada na próxima versão.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="clients" className="p-0 border-0">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-medium mb-4">Gestão de Clientes</h3>
                  <p className="text-muted-foreground">
                    Visualize e gerencie todos os seus clientes, tanto avulsos quanto despachantes parceiros.
                    Configure regras de preço, descontos e prioridades. Esta funcionalidade será implementada na próxima versão.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="deliveries" className="p-0 border-0">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-medium mb-4">Controle de Entregas</h3>
                  <p className="text-muted-foreground">
                    Gerencie entregas, atribua entregadores e rastreie o status em tempo real.
                    Esta funcionalidade será implementada na próxima versão.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
