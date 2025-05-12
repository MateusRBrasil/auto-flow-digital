
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { formSchema } from './form-schema';
import { colorPalettes } from './color-palettes';
import { mockTenantData } from './mock-data';
import { TenantFormValues } from './types';
import ContentTabContent from './ContentTabContent';
import AppearanceTabContent from './AppearanceTabContent';
import ContactTabContent from './ContactTabContent';
import SettingsTabContent from './SettingsTabContent';
import PreviewDialog from './PreviewDialog';

const TenantSettingsForm: React.FC = () => {
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
      publicPageEnabled: mockTenantData.publicPageEnabled
    }
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <ContentTabContent form={form} />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <AppearanceTabContent 
                form={form} 
                selectedPalette={selectedPalette} 
                handlePaletteChange={handlePaletteChange}
                logoUrl={mockTenantData.logo || ''}
              />
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <ContactTabContent form={form} />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <SettingsTabContent form={form} />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePreview}>
              Visualizar Página
            </Button>
            
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </Form>
      
      <PreviewDialog 
        previewUrl={previewUrl} 
        onClose={() => setPreviewUrl(null)} 
      />
    </>
  );
};

export default TenantSettingsForm;
