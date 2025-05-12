
export interface TenantSettings {
  id: string;
  companyName: string;
  subdomain: string;
  logo?: string;
  welcomeTitle: string;
  welcomeDescription: string;
  aboutText: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  colors?: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  customCSS?: string;
  publicPageEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
