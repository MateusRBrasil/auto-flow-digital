
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido.",
  }),
});

const ForgotPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error) {
      console.error("Error in password reset:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">VeícSys</h1>
          <p className="text-muted-foreground">Sistema de Gestão para Emplacadoras</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>
              {!isSubmitted 
                ? "Digite seu email para receber um link de recuperação de senha" 
                : "Email enviado! Verifique sua caixa de entrada."}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="exemplo@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          ) : (
            <CardContent>
              <div className="text-center p-4">
                <p className="mb-4">Um email foi enviado para o endereço fornecido.</p>
                <p>Siga as instruções no email para redefinir sua senha.</p>
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center">
              <Link to="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
