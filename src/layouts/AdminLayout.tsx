
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import BaseLayout from './BaseLayout';

const AdminLayout: React.FC = () => {
  return (
    <BaseLayout sidebar={<AdminSidebar />}>
      <Outlet />
    </BaseLayout>
  );
};

export default AdminLayout;
