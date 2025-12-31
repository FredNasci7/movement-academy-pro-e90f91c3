import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";

const values = [
  {
    icon: Target,
    title: "Movimento",
    description: "Acreditamos que o movimento é a base de uma vida saudável e plena. Cada exercício é uma oportunidade de evolução.",
  },
  {
    icon: Heart,
    title: "Paixão",
    description: "A nossa equipa vive e respira ginástica. Transmitimos essa paixão a cada atleta que passa pelas nossas portas.",
  },
  {
    icon: Zap,
    title: "Superação",
    description: "Encorajamos todos a ultrapassar os seus limites, celebrando cada pequena vitória no caminho para o sucesso.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Procuramos a excelência em tudo o que fazemos, desde o treino técnico até ao acompanhamento personalizado.",
  },
];

const stats = [
  { value: "2008", label: "Ano de Fundação" },
  { value: "500+", label: "Atletas Formados" },
  { value: "50+", label: "Medalhas Conquistadas" },
  { value: "15+", label: "Anos de Experiência" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Sobre Nós
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Uma Academia Dedicada ao{" "}
              <span className="text-primary">Movimento</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Desde 2008, a Movement Academy tem sido referência em ginástica artística, 
              treino personalizado e desenvolvimento atlético. A nossa missão é transformar 
              vidas através do movimento.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform -rotate-2" />
                <img
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800"
                  alt="Academia Movement Academy"
                  className="relative rounded-2xl shadow-lg w-full"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-6">
                A Nossa História
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A Movement Academy nasceu da paixão de um grupo de ex-atletas de ginástica 
                  que sonhavam criar um espaço onde o movimento fosse celebrado em todas as 
                  suas formas.
                </p>
                <p>
                  Começámos num pequeno ginásio com apenas 20 alunos. Hoje, somos uma das 
                  academias de referência no país, com instalações modernas e uma equipa de 
                  treinadores altamente qualificados.
                </p>
                <p>
                  O nosso compromisso vai além do treino físico. Acreditamos no desenvolvimento 
                  integral de cada atleta, promovendo valores como disciplina, respeito e 
                  superação pessoal.
                </p>
              </div>
              <Button asChild className="mt-8" size="lg">
                <Link to="/equipa">
                  Conhecer a Equipa
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 100}>
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-heading font-bold text-primary-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/80">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Os Nossos Valores
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              O Que Nos <span className="text-primary">Define</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os valores que guiam cada decisão, cada treino e cada interação na Movement Academy.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 100}>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 h-full card-hover">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-muted/50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-6">
                A Nossa Missão
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                "Transformar vidas através do movimento, desenvolvendo atletas completos 
                que levam os valores do desporto para todas as áreas da vida."
              </p>
              <Button asChild size="lg">
                <Link to="/contacto">
                  Junta-te a Nós
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
