import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Zap, Award, Instagram, GraduationCap } from "lucide-react";
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
  { value: "2021", label: "Ano de Fundação" },
  { value: "200+", label: "Atletas Ativos" },
  { value: "7", label: "Equipas" },
  { value: "4+", label: "Anos de Experiência" },
];

const trainers = [
  {
    name: "Beatriz Pinto",
    role: "Fundadora e Diretora Técnica",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop",
    specialties: ["Ginástica Acrobática", "Gestão Desportiva", "Formação de Atletas"],
    bio: "Fundadora da IMA em 2021, durante a pandemia. Com paixão e dedicação, transformou um sonho em realidade, criando uma referência em ginástica acrobática em Sintra.",
    certifications: ["Treinadora de Ginástica Acrobática"],
    instagram: "@ima.academy",
  },
  {
    name: "Carolina Teixeira",
    role: "Treinadora",
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=500&fit=crop",
    specialties: ["Ginástica Acrobática", "Trabalho de Base", "Competição"],
    bio: "Dedicada ao desenvolvimento técnico de cada atleta, acompanha os grupos desde a iniciação até à competição.",
    certifications: ["Treinadora de Ginástica"],
    instagram: "@ima.academy",
  },
  {
    name: "David F.",
    role: "Treinador",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop",
    specialties: ["Ginástica Acrobática", "Preparação Física", "Dinâmicos"],
    bio: "Especialista em preparação física e elementos dinâmicos, ajuda os atletas a superarem os seus limites.",
    certifications: ["Treinador de Ginástica"],
    instagram: "@ima.academy",
  },
  {
    name: "Tiago Correia",
    role: "Treinador",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
    specialties: ["Ginástica Acrobática", "Desenvolvimento Motor", "Iniciação"],
    bio: "Apaixonado por ensinar os mais novos, especialista em introduzir crianças ao mundo da ginástica acrobática.",
    certifications: ["Treinador de Ginástica"],
    instagram: "@ima.academy",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Quem Somos
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Uma Academia Dedicada ao{" "}
              <span className="text-primary">Movimento</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Desde 2021, a IMA - Intuitive Movement Academy tem sido referência em ginástica acrobática 
              em Sintra. Nascida durante a pandemia com muito esforço e dedicação, a nossa missão é 
              transformar vidas através do movimento.
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
                  A IMA - Intuitive Movement Academy nasceu em 2021, durante a pandemia, 
                  graças ao esforço e dedicação da nossa fundadora Beatriz Pinto. Com uma 
                  paixão inabalável pela ginástica acrobática, transformou um sonho em realidade.
                </p>
                <p>
                  Começámos com um pequeno grupo de atletas e hoje contamos com mais de 200 
                  atletas distribuídos por 7 equipas: BABY'MOVE, MINI'MOVE, MOVE'TEAM, MOVE'KIDS, 
                  MINI'TEAM, MOVE'TEAM e MA'TEAM. A nossa academia tornou-se referência em 
                  Sintra, Colares.
                </p>
                <p>
                  Trabalhamos com atletas dos 3 aos 18 anos, promovendo valores como disciplina, 
                  respeito, trabalho em equipa e superação pessoal. O nosso compromisso vai 
                  além do treino físico - acreditamos no desenvolvimento integral de cada atleta.
                </p>
              </div>
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              A Nossa Equipa
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Profissionais <span className="text-primary">Dedicados</span> ao Teu Sucesso
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A nossa equipa de treinadores altamente qualificados está aqui para te guiar 
              em cada passo da tua jornada.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer, index) => (
              <AnimatedSection key={trainer.name} delay={index * 100}>
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                    
                    {/* Name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-heading font-bold text-primary-foreground">
                        {trainer.name}
                      </h3>
                      <p className="text-primary text-sm font-medium">{trainer.role}</p>
                    </div>

                    {/* Instagram */}
                    <a
                      href={`https://instagram.com/${trainer.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {trainer.specialties.slice(0, 2).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                      {trainer.bio}
                    </p>

                    {/* Certifications */}
                    <div className="pt-3 border-t border-border">
                      {trainer.certifications.map((cert) => (
                        <div key={cert} className="flex items-center gap-2 text-xs">
                          <GraduationCap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-muted/50">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <Award className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Queres Fazer Parte da Equipa?
            </h2>
            <p className="text-muted-foreground mb-8">
              Estamos sempre à procura de profissionais apaixonados pelo movimento. 
              Se partilhas os nossos valores, entra em contacto connosco.
            </p>
            <Button asChild size="lg">
              <Link to="/contacto">
                Candidatar-me
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default About;