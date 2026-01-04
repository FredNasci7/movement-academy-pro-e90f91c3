import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Users, Target, Baby, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Baby,
    title: "Ginástica de Formação",
    description: "A ginástica acrobática combina força, flexibilidade, coordenação e trabalho de equipa. Os atletas trabalham em grupos de 2, 3 ou 4, realizando elementos de equilíbrio e dinâmicos que desafiam os limites do corpo humano.",
    features: [
      "Trabalho em pares, trios ou grupos",
      "Elementos de equilíbrio e dinâmicos",
      "Coreografia com música",
      "Desenvolvimento de confiança e cooperação",
      "Preparação para competições",
    ],
    image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=600",
    color: "from-primary to-accent",
  },
  {
    icon: Star,
    title: "Iniciação (3-6 anos)",
    description: "O primeiro contacto com a ginástica de forma lúdica e divertida. Desenvolvemos as capacidades motoras básicas enquanto as crianças se divertem e ganham gosto pelo movimento.",
    features: [
      "Jogos e atividades lúdicas",
      "Desenvolvimento da coordenação",
      "Primeiros elementos básicos",
      "Socialização e trabalho em grupo",
      "Aulas adaptadas à idade",
    ],
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600",
    color: "from-accent to-primary",
  },
  {
    icon: Target,
    title: "Formação de Base (7-12 anos)",
    description: "Aprendizagem técnica fundamental para jovens ginastas. Nesta fase desenvolvemos as bases sólidas que permitirão progressão para níveis mais avançados.",
    features: [
      "Técnica individual aprofundada",
      "Introdução ao trabalho de grupo",
      "Flexibilidade e força específica",
      "Primeiras participações em eventos",
      "Acompanhamento do desenvolvimento",
    ],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600",
    color: "from-primary to-accent",
  },
  {
    icon: Trophy,
    title: "Competição",
    description: "Treino avançado para atletas que pretendem competir a nível regional e nacional. Formamos equipas competitivas com acompanhamento especializado.",
    features: [
      "Treinos intensivos (4-5x/semana)",
      "Preparação física específica",
      "Coreografias de competição",
      "Participação em campeonatos",
      "Acompanhamento nutricional",
    ],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600",
    color: "from-accent to-primary",
  },
  {
    icon: Users,
    title: "TeamGym",
    description: "Modalidade de ginástica em equipa que combina elementos de solo, mini-trampolim e tumbling. Ideal para quem gosta de trabalhar em grupo.",
    features: [
      "Trabalho em equipa (6-16 atletas)",
      "Três disciplinas: solo, trampolim, tumbling",
      "Coreografias sincronizadas",
      "Competições regionais e nacionais",
      "Espírito de equipa e cooperação",
    ],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600",
    color: "from-primary to-accent",
  },
  {
    icon: Sparkles,
    title: "Ginástica Recreativa",
    description: "Para quem quer praticar ginástica de forma recreativa, sem compromisso competitivo. Foco no bem-estar, diversão e desenvolvimento pessoal.",
    features: [
      "Sem pressão competitiva",
      "Treinos flexíveis",
      "Para todas as idades",
      "Desenvolvimento físico geral",
      "Ambiente descontraído",
    ],
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600",
    color: "from-accent to-primary",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              As Nossas{" "}
              <span className="text-primary">Modalidades</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Oferecemos programas completos de ginástica acrobática para crianças e jovens, 
              desde a iniciação até à competição nacional.
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
                    <Link to="/aula-experimental">
                      Experimentar
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
              Marca já a aula experimental gratuita do teu filho/a e descobre o mundo da ginástica acrobática.
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