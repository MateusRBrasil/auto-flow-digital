
import React from 'react';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';

// Dados mockados para simulação
const mockTenants: Record<string, any> = {
  'placasjoao': {
    id: '1',
    companyName: 'Placas João Emplacamentos',
    logo: '/placeholder.svg',
    welcomeTitle: 'Bem-vindo à Placas João',
    welcomeDescription: 'Serviços de emplacamento Mercosul com agilidade e segurança. Emplacamos qualquer veículo com rapidez.',
    aboutText: 'A Placas João atua no mercado de emplacamento desde 2010, oferecendo serviços de alta qualidade para concessionárias, despachantes e clientes finais. Nosso compromisso é com a agilidade e conformidade com as exigências do DETRAN.',
    contactPhone: '(11) 99999-8888',
    contactWhatsApp: '5511999998888',
    contactEmail: 'contato@placasjoao.com.br',
    address: 'Av. das Placas, 123 - Centro - São Paulo/SP',
    socialLinks: {
      facebook: 'https://facebook.com/placasjoao',
      instagram: 'https://instagram.com/placasjoao',
    },
    colors: {
      primary: '#1e40af',
      secondary: '#1d4ed8',
    },
    publicPageEnabled: true
  },
  'rapidaplacas': {
    id: '2',
    companyName: 'Rápida Placas Despachante',
    logo: '/placeholder.svg',
    welcomeTitle: 'Rápida Placas - Seu despachante de confiança',
    welcomeDescription: 'Emplacamento, transferência, licenciamento e muito mais. Atendemos em todo o estado.',
    aboutText: 'Com mais de 15 anos no mercado, a Rápida Placas se destaca pelo atendimento personalizado e rapidez no serviço. Toda nossa equipe é certificada e treinada para oferecer soluções completas em documentação veicular.',
    contactPhone: '(11) 3333-4444',
    contactWhatsApp: '5511987654321',
    contactEmail: 'atendimento@rapidaplacas.com.br',
    address: 'Rua dos Documentos, 456 - Vila Nova - São Paulo/SP',
    socialLinks: {
      facebook: 'https://facebook.com/rapidaplacas',
      instagram: 'https://instagram.com/rapidaplacas',
      linkedin: 'https://linkedin.com/company/rapidaplacas',
    },
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
    },
    publicPageEnabled: true
  }
};

const PublicHome: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const tenant = tenantId ? mockTenants[tenantId] : null;
  
  // Se o tenant não existir ou não estiver ativo
  if (!tenant || !tenant.publicPageEnabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          O endereço que você acessou não está disponível ou foi desativado.
        </p>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    );
  }

  // Estilo dinâmico baseado nas cores do tenant
  const primaryColor = tenant.colors?.primary || '#1e40af';
  const secondaryColor = tenant.colors?.secondary || '#1d4ed8';
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className="py-4 px-6 shadow-sm" 
        style={{ backgroundColor: primaryColor, color: 'white' }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.companyName} className="h-10 w-10" />
            ) : (
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center font-bold text-lg" style={{ color: primaryColor }}>
                {tenant.companyName.charAt(0)}
              </div>
            )}
            <span className="font-bold text-lg">{tenant.companyName}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="#sobre" className="hover:text-white/80">Sobre</a>
            <a href="#servicos" className="hover:text-white/80">Serviços</a>
            <a href="#contato" className="hover:text-white/80">Contato</a>
            <Link to={`/cliente/${tenantId}`}>
              <Button 
                variant="secondary"
                style={{ 
                  backgroundColor: 'white', 
                  color: primaryColor,
                  '--shadow': 'none'
                } as React.CSSProperties}
              >
                Área do Cliente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: primaryColor }}>
              {tenant.welcomeTitle}
            </h1>
            <p className="text-lg text-slate-700">
              {tenant.welcomeDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              {tenant.contactWhatsApp && (
                <a 
                  href={`https://wa.me/${tenant.contactWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg"
                    style={{ 
                      backgroundColor: secondaryColor,
                      borderColor: secondaryColor,
                      '--shadow': 'none'
                    } as React.CSSProperties}
                  >
                    Fale pelo WhatsApp
                  </Button>
                </a>
              )}
              <Link to={`/cliente/${tenantId}`}>
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ 
                    borderColor: secondaryColor,
                    color: secondaryColor,
                    '--shadow': 'none'
                  } as React.CSSProperties}
                >
                  Acompanhar meu processo
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md h-64 rounded-lg bg-white shadow-md overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Serviços" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
            Sobre Nós
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-slate-700 whitespace-pre-line">
                {tenant.aboutText}
              </p>
            </div>
            <div className="bg-slate-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                Nossos Diferenciais
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Atendimento personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Rapidez na entrega</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Equipe especializada</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Conformidade com a legislação</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: primaryColor }}>
            Nossos Serviços
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Emplacamento',
                description: 'Serviço completo de primeiro emplacamento para veículos novos.',
                icon: '🚗'
              },
              {
                title: 'Transferência',
                description: 'Transferência de propriedade de veículos com toda documentação.',
                icon: '📄'
              },
              {
                title: '2ª Via de Placas',
                description: 'Substituição de placas danificadas ou perdidas.',
                icon: '🔢'
              },
              {
                title: 'Licenciamento Anual',
                description: 'Renovação do licenciamento de seu veículo com praticidade.',
                icon: '📅'
              },
              {
                title: 'Vistoria',
                description: 'Vistoria completa para transferência ou outros serviços.',
                icon: '🔍'
              },
              {
                title: 'Consultoria',
                description: 'Consultoria para regularização de documentação veicular.',
                icon: '💼'
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-4 flex-grow">
                  {service.description}
                </p>
                <Button 
                  variant="outline"
                  className="w-full mt-4"
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor,
                    '--shadow': 'none'
                  } as React.CSSProperties}
                >
                  Saiba mais
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
            Entre em Contato
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-lg">
                Estamos prontos para atender e solucionar suas necessidades com agilidade e profissionalismo.
              </p>
              
              <div className="space-y-4">
                {tenant.contactPhone && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Telefone</p>
                      <a href={`tel:${tenant.contactPhone.replace(/\D/g, '')}`} className="text-slate-600">
                        {tenant.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                
                {tenant.contactWhatsApp && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a 
                        href={`https://wa.me/${tenant.contactWhatsApp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-600"
                      >
                        {tenant.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                
                {tenant.contactEmail && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${tenant.contactEmail}`} className="text-slate-600">
                        {tenant.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                
                {tenant.address && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Endereço</p>
                      <address className="text-slate-600 not-italic">
                        {tenant.address}
                      </address>
                    </div>
                  </div>
                )}
              </div>

              {tenant.socialLinks && (
                <div className="pt-4">
                  <p className="font-medium mb-3">Siga-nos nas redes sociais</p>
                  <div className="flex gap-4">
                    {tenant.socialLinks.facebook && (
                      <a 
                        href={tenant.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                        </svg>
                      </a>
                    )}
                    
                    {tenant.socialLinks.instagram && (
                      <a 
                        href={tenant.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                      >
                        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428.247-.66.597-1.216 1.153-1.772.5-.509 1.105-.902 1.772-1.153.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                        </svg>
                      </a>
                    )}
                    
                    {tenant.socialLinks.twitter && (
                      <a 
                        href={tenant.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                      >
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                        </svg>
                      </a>
                    )}
                    
                    {tenant.socialLinks.linkedin && (
                      <a 
                        href={tenant.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                      >
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                Envie uma mensagem
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium">
                    Assunto
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary"
                  ></textarea>
                </div>
                
                <div>
                  <Button 
                    type="submit"
                    className="w-full"
                    style={{ 
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      '--shadow': 'none'
                    } as React.CSSProperties}
                  >
                    Enviar Mensagem
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-800 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{tenant.companyName}</h3>
              <p className="text-slate-300">
                Soluções completas em serviços de emplacamento e documentação veicular.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Início</a></li>
                <li><a href="#sobre" className="text-slate-300 hover:text-white">Sobre Nós</a></li>
                <li><a href="#servicos" className="text-slate-300 hover:text-white">Serviços</a></li>
                <li><a href="#contato" className="text-slate-300 hover:text-white">Contato</a></li>
                <li>
                  <Link to={`/cliente/${tenantId}`} className="text-slate-300 hover:text-white">
                    Área do Cliente
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contato</h3>
              {tenant.address && (
                <address className="not-italic text-slate-300 mb-2">
                  {tenant.address}
                </address>
              )}
              {tenant.contactPhone && (
                <p className="text-slate-300 mb-1">
                  <span className="font-medium">Tel:</span> {tenant.contactPhone}
                </p>
              )}
              {tenant.contactEmail && (
                <p className="text-slate-300">
                  <span className="font-medium">Email:</span> {tenant.contactEmail}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} {tenant.companyName}. Todos os direitos reservados.
            </p>
            <p className="text-slate-400 text-sm mt-2 sm:mt-0">
              Desenvolvido com ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
