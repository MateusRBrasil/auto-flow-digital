
import React from 'react';
import { Outlet } from 'react-router-dom';
import ClienteSidebar from '@/components/ClienteSidebar';
import BaseLayout from './BaseLayout';

const ClienteLayout: React.FC = () => {
  return (
    <BaseLayout sidebar={<ClienteSidebar />}>
      <Outlet />
    </BaseLayout>
  );
};

export default ClienteLayout;
