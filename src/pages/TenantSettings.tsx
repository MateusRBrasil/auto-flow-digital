
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPalette, TenantSettings as TenantSettingsType } from '@/types/tenant';
import { Facebook, Instagram, Linkedin, Twitter, Phone, MapPin, Mail, MessageCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Pre-defined color palettes
const colorPalettes: ColorPalette[] = [
  {
    id: 'blue',
    name: 'Azul Corporativo',
    colors: {
      primary: '#1e40af',
      secondary: '#1d4ed8',
      accent: '#3b82f6',
      background: '#f8fafc',
      text: '#1e293b',
      heading: '#0f172a'
    }
  },
  {
    id: 'green',
    name: 'Verde Natureza',
    colors: {
      primary: '#15803d',
      secondary: '#16a34a',
      accent: '#22c55e',
      background: '#f0fdf4',
      text: '#1e293b',
      heading: '#14532d'
    }
  },
  {
    id: 'red',
    name: 'Vermelho Energia',
    colors: {
      primary: '#b91c1c',
      secondary: '#dc2626',
      accent: '#ef4444',
      background: '#fef2f2',
      text: '#1e293b',
      heading: '#7f1d1d'
    }
  },
  {
    id: 'purple',
    name: 'Roxo Criativo',
    colors: {
      primary: '#7e22ce',
      secondary: '#9333ea',
      accent: '#a855f7',
      background: '#faf5ff',
      text: '#1e293b',
      heading: '#581c87'
    }
  }
];

// Mock data para o exemplo
const mockTenantData: TenantSettingsType = {
  id: '1',
  companyName: 'Placas João Emplacamentos',
  subdomain: 'placasjoao',
  logo: '/placeholder.svg',
  welcomeTitle: 'Bem-vindo à Placas João',
  welcomeDescription: 'Serviços de emplacamento Mercosul com agilidade e segurança. Emplacamos qualquer veículo com rapidez.',
  aboutText: 'A Placas João atua no mercado de emplacamento desde 2010, oferecendo serviços de alta qualidade para concessionárias, despachantes e clientes finais. Nosso compromisso é com a agilidade e conformidade com as exigências do DETRAN.',
  contactPhone: '(11) 99999-8888',
  contactWhatsApp: '5511999998888',
  contactEmail: 'contato@placasjoao.com.br',
  address: 'Av. das Placas, 123 - Centro - São Paulo/SP',
  socialLinks: {
    facebook: 'https://facebook.com/placasjoao',
    instagram: 'https://instagram.com/placasjoao',
  },
  colors: {
    primary: '#1e40af',
    secondary: '#1d4ed8',
  },
  colorPalette: 'blue',
  publicPageEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const formSchema = z.object({
  companyName: z.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres"),
  subdomain: z.string().min(3, "O subdomínio deve ter pelo menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "O subdomínio deve conter apenas letras minúsculas, números e hífens"),
  welcomeTitle: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  welcomeDescription: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  aboutText: z.string().min(20, "O texto sobre a empresa deve ter pelo menos 20 caracteres"),
  contactPhone: z.string().optional(),
  contactWhatsApp: z.string().optional(),
  contactEmail: z.string().email("Digite um e-mail válido").optional(),
  address: z.string().optional(),
  facebook: z.string().url("Digite uma URL válida").optional().or(z.literal('')),
  instagram: z.string().url("Digite uma URL válida").optional().or(z.literal('')),
  twitter: z.string().url("Digite uma URL válida").optional().or(z.literal('')),
  linkedin: z.string().url("Digite uma URL válida").optional().or(z.literal('')),
  colorPalette: z.string(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Digite uma cor hexadecimal válida"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Digite uma cor hexadecimal válida").optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Digite uma cor hexadecimal válida").optional(),
  publicPageEnabled: z.boolean().default(false),
});

const TenantSettings: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<string>(mockTenantData.colorPalette || 'blue');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: mockTenantData.companyName,
      subdomain: mockTenantData.subdomain,
      welcomeTitle: mockTenantData.welcomeTitle,
      welcomeDescription: mockTenantData.welcomeDescription,
      aboutText: mockTenantData.aboutText,
      contactPhone: mockTenantData.contactPhone,
      contactWhatsApp: mockTenantData.contactWhatsApp,
      contactEmail: mockTenantData.contactEmail,
      address: mockTenantData.address,
      facebook: mockTenantData.socialLinks?.facebook || '',
      instagram: mockTenantData.socialLinks?.instagram || '',
      twitter: mockTenantData.socialLinks?.twitter || '',
      linkedin: mockTenantData.socialLinks?.linkedin || '',
      colorPalette: mockTenantData.colorPalette || 'blue',
      primaryColor: mockTenantData.colors?.primary || '#1e40af',
      secondaryColor: mockTenantData.colors?.secondary || '#1d4ed8',
      accentColor: mockTenantData.colors?.accent || '#3b82f6',
      publicPageEnabled: mockTenantData.publicPageEnabled,
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Aqui seria implementada a lógica para salvar as configurações
    toast.success("Configurações salvas com sucesso!");
  };

  const handlePreview = () => {
    // Em um ambiente real, isso abriria a prévia em uma nova aba
    const subdomain = form.getValues('subdomain');
    setPreviewUrl(`/public/${subdomain}`);
    toast.info("Em um ambiente de produção, a página seria aberta em uma nova aba.", {
      action: {
        label: "Visualizar",
        onClick: () => window.open(`/public/${subdomain}`, '_blank')
      }
    });
  };

  const handlePaletteChange = (paletteId: string) => {
    setSelectedPalette(paletteId);
    const palette = colorPalettes.find(p => p.id === paletteId);
    if (palette) {
      form.setValue('primaryColor', palette.colors.primary);
      form.setValue('secondaryColor', palette.colors.secondary);
      form.setValue('accentColor', palette.colors.accent);
      form.setValue('colorPalette', paletteId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Página Pública</h1>
        <p className="text-muted-foreground">
          Personalize sua página institucional que será exibida aos seus clientes.
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="content" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium">Logotipo</h3>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-md border flex items-center justify-center bg-slate-100">
                        <img 
                          src={mockTenantData.logo || "/placeholder.svg"} 
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
                    
                    <FormField
                      control={form.control}
                      name="colorPalette"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup 
                              onValueChange={(value) => {
                                field.onChange(value);
                                handlePaletteChange(value);
                              }}
                              defaultValue={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                              {colorPalettes.map((palette) => (
                                <div key={palette.id} className={`flex items-center space-x-2 border rounded-lg p-4 ${selectedPalette === palette.id ? 'ring-2 ring-primary' : ''}`}>
                                  <RadioGroupItem value={palette.id} id={palette.id} />
                                  <div className="flex flex-col">
                                    <label htmlFor={palette.id} className="font-medium">{palette.name}</label>
                                    <div className="flex gap-2 mt-2">
                                      <div style={{ backgroundColor: palette.colors.primary }} className="w-6 h-6 rounded" />
                                      <div style={{ backgroundColor: palette.colors.secondary }} className="w-6 h-6 rounded" />
                                      <div style={{ backgroundColor: palette.colors.accent }} className="w-6 h-6 rounded" />
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
                  </div>
                  
                  <Separator />
                  
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
                  
                  <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                    <div className="text-center space-y-2">
                      <h4 className="font-medium">Prévia das Cores</h4>
                      <div className="flex justify-center gap-4">
                        <Button 
                          type="button"
                          style={{ backgroundColor: form.watch('primaryColor'), color: '#ffffff' }}
                        >
                          Botão Principal
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          style={{ 
                            borderColor: form.watch('secondaryColor'),
                            color: form.watch('secondaryColor')
                          }}
                        >
                          Botão Secundário
                        </Button>
                      </div>
                      <div 
                        className="mt-2 p-2 rounded-md"
                        style={{ backgroundColor: form.watch('accentColor'), color: '#ffffff' }}
                      >
                        Elemento de Destaque
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Telefone
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 0000-0000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Telefone de contato da sua empresa.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactWhatsApp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="5500000000000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Número completo com código do país (Ex: 5511999998888).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="contato@suaempresa.com.br" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Endereço
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, número, bairro - Cidade/UF" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Redes Sociais</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Facebook className="h-4 w-4" /> Facebook
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/suaempresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Instagram className="h-4 w-4" /> Instagram
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/suaempresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Twitter className="h-4 w-4" /> Twitter
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/suaempresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/company/suaempresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/20 mt-4">
                    <h4 className="font-medium mb-2">Prévia do Cartão de Contato</h4>
                    <div className="bg-background rounded-md p-4 border">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{form.watch('contactPhone') || '(11) 99999-8888'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MessageCircle className="h-4 w-4 text-primary" />
                            <span>{form.watch('contactPhone') || '(11) 99999-8888'} (WhatsApp)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>{form.watch('contactEmail') || 'contato@empresa.com.br'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{form.watch('address') || 'Av. Principal, 123 - Centro'}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          {form.watch('facebook') && (
                            <a href="#" className="p-2 rounded-full hover:bg-muted">
                              <Facebook className="h-5 w-5" />
                            </a>
                          )}
                          {form.watch('instagram') && (
                            <a href="#" className="p-2 rounded-full hover:bg-muted">
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {form.watch('twitter') && (
                            <a href="#" className="p-2 rounded-full hover:bg-muted">
                              <Twitter className="h-5 w-5" />
                            </a>
                          )}
                          {form.watch('linkedin') && (
                            <a href="#" className="p-2 rounded-full hover:bg-muted">
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {form.watch('contactWhatsApp') && (
                            <a href="#" className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
                              <MessageCircle className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
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
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePreview}
              >
                Visualizar Página
              </Button>
              
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </Form>
      </Tabs>
      
      {previewUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-5xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">Pré-visualização da Página</h3>
              <Button 
                variant="ghost" 
                onClick={() => setPreviewUrl(null)}
              >
                Fechar
              </Button>
            </div>
            <div className="flex-grow overflow-hidden">
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0"
                title="Website Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSettings;
