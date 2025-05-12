
import { z } from "zod";

export const formSchema = z.object({
  companyName: z.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres"),
  subdomain: z.string().min(3, "O subdomínio deve ter pelo menos 3 caracteres").regex(/^[a-z0-9-]+$/, "O subdomínio deve conter apenas letras minúsculas, números e hífens"),
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
  publicPageEnabled: z.boolean().default(false)
});
