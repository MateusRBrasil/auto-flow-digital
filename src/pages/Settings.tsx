
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema e suas preferências
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome completo" defaultValue="Administrador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Seu email" defaultValue="admin@veicsys.com.br" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="Seu telefone" defaultValue="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" placeholder="Seu cargo" defaultValue="Administrador" readOnly />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Atualize sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Alterar Senha</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Atualize as informações da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" placeholder="Nome da empresa" defaultValue="VeícSys Emplacamentos LTDA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-cnpj">CNPJ</Label>
                  <Input id="company-cnpj" placeholder="CNPJ" defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Input id="company-address" placeholder="Endereço" defaultValue="Rua dos Veículos, 123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-city">Cidade/UF</Label>
                  <Input id="company-city" placeholder="Cidade/UF" defaultValue="São Paulo/SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input id="company-phone" placeholder="Telefone" defaultValue="(11) 3456-7890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input id="company-email" type="email" placeholder="Email" defaultValue="contato@veicsys.com.br" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuários do Sistema</CardTitle>
                <CardDescription>
                  Gerencie os usuários que têm acesso ao sistema
                </CardDescription>
              </div>
              <Button>Adicionar Usuário</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Administrador</p>
                      <p className="text-sm text-muted-foreground">admin@veicsys.com.br</p>
                      <p className="text-xs text-muted-foreground mt-1">Cargo: Administrador</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Remover</Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Carlos Silva</p>
                      <p className="text-sm text-muted-foreground">carlos@veicsys.com.br</p>
                      <p className="text-xs text-muted-foreground mt-1">Cargo: Vendedor</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Remover</Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Ana Santos</p>
                      <p className="text-sm text-muted-foreground">ana@veicsys.com.br</p>
                      <p className="text-xs text-muted-foreground mt-1">Cargo: Vendedor</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Remover</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por email sobre novos processos e entregas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações por WhatsApp para clientes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Alternar entre tema claro e escuro
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backup e Exportação</CardTitle>
              <CardDescription>
                Gerenciamento de dados do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Exportar Dados</Label>
                <p className="text-sm text-muted-foreground">
                  Exporte todos os dados do sistema no formato CSV ou Excel
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Exportar CSV</Button>
                <Button variant="outline">Exportar Excel</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-1">
                <Label>Backup do Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Crie um backup completo do sistema
                </p>
              </div>
              <Button>Gerar Backup</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
