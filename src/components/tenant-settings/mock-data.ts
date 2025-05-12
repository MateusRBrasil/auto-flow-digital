
import { TenantSettings } from '@/types/tenant';

// Mock data for example
export const mockTenantData: TenantSettings = {
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
    instagram: 'https://instagram.com/placasjoao'
  },
  colors: {
    primary: '#1e40af',
    secondary: '#1d4ed8'
  },
  colorPalette: 'blue',
  publicPageEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
