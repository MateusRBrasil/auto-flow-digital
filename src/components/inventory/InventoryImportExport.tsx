
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FileDown, FileUp, Download, Upload } from 'lucide-react';

const InventoryImportExport: React.FC = () => {
  const handleExportCSV = () => {
    // Implementação da exportação para CSV
    console.log('Exportando para CSV...');
  };

  const handleExportExcel = () => {
    // Implementação da exportação para Excel
    console.log('Exportando para Excel...');
  };

  const handleImport = () => {
    // Implementação da importação
    console.log('Importando...');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileDown className="mr-2 h-5 w-5" />
            Exportar Dados
          </CardTitle>
          <CardDescription>
            Exporte seus dados de estoque para uso externo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Escolha o formato desejado para exportar todos os itens de estoque e suas movimentações.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="w-full" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button className="w-full ml-2" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileUp className="mr-2 h-5 w-5" />
            Importar Dados
          </CardTitle>
          <CardDescription>
            Importe dados de estoque de um arquivo externo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Carregue um arquivo CSV ou Excel com seus itens de estoque. O formato deve seguir o modelo padrão.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Arquivo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InventoryImportExport;
