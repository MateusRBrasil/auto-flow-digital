
import React from 'react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">
            VeícSys
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">Ajuda</Button>
          <Button variant="ghost" size="sm">Notificações</Button>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
