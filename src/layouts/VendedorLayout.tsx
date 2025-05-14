
import React from 'react';
import { Outlet } from 'react-router-dom';
import VendedorSidebar from '@/components/VendedorSidebar';
import BaseLayout from './BaseLayout';

const VendedorLayout: React.FC = () => {
  return (
    <BaseLayout sidebar={<VendedorSidebar />}>
      <Outlet />
    </BaseLayout>
  );
};

export default VendedorLayout;
