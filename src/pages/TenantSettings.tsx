
import React from 'react';
import { Separator } from '@/components/ui/separator';
import TenantSettingsForm from '@/components/tenant-settings/TenantSettingsForm';

const TenantSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Página Pública</h1>
        <p className="text-muted-foreground">
          Personalize sua página institucional que será exibida aos seus clientes.
        </p>
      </div>
      
      <Separator />
      
      <TenantSettingsForm />
    </div>
  );
};

export default TenantSettings;
