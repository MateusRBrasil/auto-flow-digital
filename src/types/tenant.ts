
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
    background?: string;
    text?: string;
    heading?: string;
  };
  colorPalette?: string; // To store the selected pre-defined color palette
  customCSS?: string;
  publicPageEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    heading: string;
  };
}
