
import React from 'react';
import Header from '@/components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, sidebar }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-950">
        {sidebar}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BaseLayout;
