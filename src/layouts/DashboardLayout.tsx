
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from '@/hooks/use-theme';
import Header from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';

const DashboardLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <SidebarProvider>
          <div className="flex w-full h-screen">
            <MainSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-4 sm:p-6 md:p-8">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;
