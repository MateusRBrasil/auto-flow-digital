
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from '@/components/MainSidebar';
import BaseLayout from './BaseLayout';

const DashboardLayout: React.FC = () => {
  return (
    <BaseLayout sidebar={<MainSidebar />}>
      <Outlet />
    </BaseLayout>
  );
};

export default DashboardLayout;
