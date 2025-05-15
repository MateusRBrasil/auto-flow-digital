
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, UserPlus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Cliente {
  id: string;
  tipo: string;
  perfil: {
    nome: string;
    email: string;
    documento: string | null;
    telefone: string | null;
  };
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
}

const AdminClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select(`
            id, 
            tipo, 
            endereco, 
            cidade, 
            estado,
            perfis:id (
              nome, 
              email,
              documento,
              telefone
            )
          `)
          .order('id');

        if (error) {
          throw error;
        }

        // Transform data to match Cliente interface
        const formattedClientes = data.map((cliente: any) => ({
          ...cliente,
          perfil: cliente.perfis
        }));

        setClientes(formattedClientes);
        setFilteredClientes(formattedClientes);
      } catch (error) {
        console.error('Error fetching clientes:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClientes(clientes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clientes.filter(cliente => 
      (cliente.perfil?.nome && cliente.perfil.nome.toLowerCase().includes(query)) ||
      (cliente.perfil?.email && cliente.perfil.email.toLowerCase().includes(query)) ||
      (cliente.perfil?.documento && cliente.perfil.documento.toLowerCase().includes(query)) ||
      (cliente.tipo && cliente.tipo.toLowerCase().includes(query)) ||
      (cliente.cidade && cliente.cidade.toLowerCase().includes(query))
    );

    setFilteredClientes(filtered);
  }, [searchQuery, clientes]);

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'avulso': return 'Cliente Avulso';
      case 'despachante': return 'Despachante';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os clientes cadastrados no sistema.
          </p>
        </div>
        
        <Button asChild className="sm:self-start">
          <Link to="/admin/clientes/cadastrar">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            Carregando clientes...
          </div>
        ) : filteredClientes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Telefone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.perfil?.nome || 'N/A'}</TableCell>
                  <TableCell>{cliente.perfil?.email || 'N/A'}</TableCell>
                  <TableCell>{cliente.perfil?.documento || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      cliente.tipo === 'despachante' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {getTipoLabel(cliente.tipo)}
                    </span>
                  </TableCell>
                  <TableCell>{cliente.cidade && cliente.estado ? `${cliente.cidade}/${cliente.estado}` : 'N/A'}</TableCell>
                  <TableCell>{cliente.perfil?.telefone || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientes;
