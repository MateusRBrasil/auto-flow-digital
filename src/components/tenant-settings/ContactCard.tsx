
import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { TenantFormValues } from './types';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface ContactCardProps {
  watch: UseFormWatch<TenantFormValues>;
}

const ContactCard: React.FC<ContactCardProps> = ({ watch }) => {
  return (
    <div className="p-4 border rounded-md bg-muted/20 mt-4">
      <h4 className="font-medium mb-2">Prévia do Cartão de Contato</h4>
      <div className="bg-background rounded-md p-4 border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>{watch('contactPhone') || '(11) 99999-8888'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>{watch('contactPhone') || '(11) 99999-8888'} (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>{watch('contactEmail') || 'contato@empresa.com.br'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{watch('address') || 'Av. Principal, 123 - Centro'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {watch('facebook') && (
              <a href="#" className="p-2 rounded-full hover:bg-muted">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {watch('instagram') && (
              <a href="#" className="p-2 rounded-full hover:bg-muted">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {watch('twitter') && (
              <a href="#" className="p-2 rounded-full hover:bg-muted">
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {watch('linkedin') && (
              <a href="#" className="p-2 rounded-full hover:bg-muted">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {watch('contactWhatsApp') && (
              <a href="#" className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
                <MessageCircle className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
