
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronDown, FileText, Truck, Users, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary">
            VeícSys
          </h1>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Cadastre-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simplifique a gestão de processos veiculares
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Plataforma completa para emplacadoras e despachantes, com controle de processos, 
                clientes e entregas em um só lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comece agora
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Conheça mais
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <img 
                src="https://placehold.co/600x400/e2e8f0/64748b?text=VeicSys+Dashboard" 
                alt="VeícSys Dashboard" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça as principais funcionalidades do VeícSys que vão transformar 
              a gestão da sua emplacadora ou despachante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gestão de Processos</CardTitle>
                <CardDescription>
                  Controle total de emplacamentos, transferências e outros processos veiculares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Acompanhamento por status</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Documentos digitais</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Histórico completo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Cadastro de Clientes</CardTitle>
                <CardDescription>
                  Organize seus clientes avulsos e despachantes parceiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Descontos por cliente</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Histórico de serviços</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Acompanhamento de faturamento</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Controle de Entregas</CardTitle>
                <CardDescription>
                  Gerencie suas entregas e integre com aplicativos parceiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Agendamento inteligente</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Integração com Uber/99/Mottu</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Confirmação por WhatsApp</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos e Preços</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho da sua operação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <CardDescription>Para pequenas emplacadoras</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ 199</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Até 50 processos/mês</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>2 usuários</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Gestão de processos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Cadastro de clientes</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Escolher plano</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <div className="py-1 px-3 rounded-full bg-primary text-primary-foreground text-xs font-medium w-fit">Mais popular</div>
                <CardTitle className="mt-4">Profissional</CardTitle>
                <CardDescription>Para emplacadoras médias</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ 399</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Até 200 processos/mês</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>5 usuários</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Tudo do plano Básico</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Controle de entregas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>WhatsApp integrado</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Escolher plano</Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Empresarial</CardTitle>
                <CardDescription>Para grandes operações</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ 799</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Processos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Usuários ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Tudo do Profissional</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Escolher plano</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confira os depoimentos de quem já utiliza o VeícSys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mb-4">
                  "O VeícSys transformou nossa operação. Antes, passávamos horas com planilhas e agora tudo é automatizado. Recomendo muito!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <span className="font-medium">MS</span>
                  </div>
                  <div>
                    <p className="font-medium">Marcos Silva</p>
                    <p className="text-sm text-muted-foreground">Despachante Rápido LTDA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mb-4">
                  "A integração com aplicativos de entrega e o controle de processos nos permitiram aumentar a produtividade em 40%. Investimento que valeu a pena!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <span className="font-medium">AP</span>
                  </div>
                  <div>
                    <p className="font-medium">Ana Paula</p>
                    <p className="text-sm text-muted-foreground">Emplacadora Center</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#E2E8F0" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <p className="mb-4">
                  "O sistema é muito bom e intuitivo. Os clientes adoraram a transparência de poder acompanhar os processos. Só poderia melhorar alguns relatórios."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <span className="font-medium">RS</span>
                  </div>
                  <div>
                    <p className="font-medium">Roberto Souza</p>
                    <p className="text-sm text-muted-foreground">RS Veículos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para transformar sua operação?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Simplifique seus processos, aumente a satisfação dos clientes e melhore seus resultados
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button variant="secondary" size="lg">
                Cadastre-se gratuitamente
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Fale com um consultor
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
