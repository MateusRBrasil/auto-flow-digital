
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, informe seu e-mail.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro ao solicitar a redefinição de senha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-xl text-primary-foreground">V</span>
          </div>
          <h1 className="text-3xl font-bold">VeícSys</h1>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">E-mail enviado</CardTitle>
            <CardDescription className="text-center">
              Enviamos um link para redefinir sua senha para {email}.
              Verifique sua caixa de entrada.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/login">Voltar para o login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <span className="font-bold text-xl text-primary-foreground">V</span>
        </div>
        <h1 className="text-3xl font-bold">VeícSys</h1>
        <p className="text-muted-foreground max-w-md">
          Sistema completo para gestão de serviços de emplacamento e despachante veicular
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Esqueceu sua senha?</CardTitle>
          <CardDescription className="text-center">
            Informe seu e-mail para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                placeholder="exemplo@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar link de redefinição'}
            </Button>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Lembrou sua senha?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
