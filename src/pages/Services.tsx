import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Dumbbell, Users, Target, Flame, StretchHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Sparkles,
    title: "Ginástica Artística",
    description: "Desenvolve força, flexibilidade, coordenação e elegância com o nosso programa completo de ginástica artística. Ideal para atletas de todas as idades e níveis.",
    features: [
      "Treino técnico em aparelhos",
      "Desenvolvimento de força e flexibilidade",
      "Preparação para competições",
      "Acompanhamento individual",
      "Turmas por nível e idade",
    ],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600",
    color: "from-primary to-accent",
  },
  {
    icon: Dumbbell,
    title: "Treino Personalizado",
    description: "Programas 100% personalizados, desenhados especificamente para os teus objetivos. Acompanhamento exclusivo com os nossos melhores treinadores.",
    features: [
      "Avaliação física completa",
      "Plano de treino personalizado",
      "Acompanhamento nutricional",
      "Monitorização de progressos",
      "Flexibilidade de horários",
    ],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600",
    color: "from-accent to-primary",
  },
  {
    icon: Users,
    title: "Aulas de Grupo",
    description: "Treina em comunidade com as nossas aulas dinâmicas e motivadoras. A energia do grupo leva-te mais longe do que imaginavas.",
    features: [
      "Variedade de modalidades",
      "Ambiente motivador",
      "Turmas para todos os níveis",
      "Música e energia contagiante",
      "Resultados comprovados",
    ],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600",
    color: "from-primary to-accent",
  },
  {
    icon: Target,
    title: "Treino Funcional",
    description: "Melhora a tua performance no dia-a-dia com exercícios que trabalham o corpo de forma integrada e funcional.",
    features: [
      "Movimentos naturais do corpo",
      "Melhoria da postura",
      "Prevenção de lesões",
      "Aumento da mobilidade",
      "Transferência para o quotidiano",
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600",
    color: "from-accent to-primary",
  },
  {
    icon: StretchHorizontal,
    title: "Flexibilidade & Mobilidade",
    description: "Ganha amplitude de movimento e liberdade corporal com as nossas aulas especializadas em flexibilidade.",
    features: [
      "Alongamento progressivo",
      "Técnicas de respiração",
      "Prevenção de rigidez",
      "Melhoria da postura",
      "Relaxamento muscular",
    ],
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600",
    color: "from-primary to-accent",
  },
  {
    icon: Flame,
    title: "HIIT & Cardio",
    description: "Queima calorias e aumenta a tua resistência com treinos de alta intensidade que maximizam resultados.",
    features: [
      "Treinos intensos e eficazes",
      "Queima calórica elevada",
      "Melhoria cardiovascular",
      "Aumento do metabolismo",
      "Sessões de 45 minutos",
    ],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600",
    color: "from-accent to-primary",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Os Nossos Serviços
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Programas Para Cada{" "}
              <span className="text-primary">Objetivo</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Descobre a modalidade perfeita para ti. Oferecemos programas completos 
              para todos os níveis, desde iniciantes até atletas de competição.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="section-container space-y-20">
          {services.map((service, index) => (
            <AnimatedSection key={service.title}>
              <div className={cn(
                "grid lg:grid-cols-2 gap-12 items-center",
                index % 2 === 1 && "lg:flex-row-reverse"
              )}>
                {/* Content */}
                <div className={cn(index % 2 === 1 && "lg:order-2")}>
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                    `bg-gradient-to-br ${service.color}`
                  )}>
                    <service.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild size="lg">
                    <Link to="/contacto">
                      Saber Mais
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Image */}
                <div className={cn(index % 2 === 1 && "lg:order-1")}>
                  <div className="relative">
                    <div className={cn(
                      "absolute -inset-4 rounded-3xl transform",
                      index % 2 === 0 ? "rotate-2 bg-primary/10" : "-rotate-2 bg-accent/10"
                    )} />
                    <img
                      src={service.image}
                      alt={service.title}
                      className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Pronto Para Começar?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Marca já a tua aula experimental gratuita e descobre qual o programa ideal para ti.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-primary">
              <Link to="/contacto">
                Aula Experimental Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
