
import { ColorPalette, TenantSettings } from '@/types/tenant';

// Re-export types
export type { ColorPalette, TenantSettings };

// Form schema type for tenant settings
export interface TenantFormValues {
  companyName: string;
  subdomain: string;
  welcomeTitle: string;
  welcomeDescription: string;
  aboutText: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  colorPalette: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  publicPageEnabled: boolean;
}

// For use with React Hook Form
export type TenantFormReturn = Partial<TenantFormValues> & {
  companyName: string;
  subdomain: string;
  welcomeTitle: string;
  welcomeDescription: string;
  aboutText: string;
  colorPalette: string;
  primaryColor: string;
  publicPageEnabled: boolean;
};
