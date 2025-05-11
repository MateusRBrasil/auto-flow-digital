
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} VeícSys. Todos os direitos reservados.
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <a href="#" className="hover:text-primary hover:underline">Termos de Uso</a>
          <a href="#" className="hover:text-primary hover:underline">Privacidade</a>
          <a href="#" className="hover:text-primary hover:underline">Suporte</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
