
import React from 'react';
import { Button } from '@/components/ui/button';

interface PreviewDialogProps {
  previewUrl: string | null;
  onClose: () => void;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({ previewUrl, onClose }) => {
  if (!previewUrl) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-5xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-zinc-950 text-left">Pré-visualização da Página</h3>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="bg-red-600 hover:bg-red-500"
          >
            Fechar
          </Button>
        </div>
        <div className="flex-grow overflow-hidden">
          <iframe 
            src={previewUrl} 
            className="w-full h-full border-0" 
            title="Website Preview" 
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewDialog;
