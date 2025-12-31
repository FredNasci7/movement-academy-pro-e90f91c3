import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";

const trainers = [
  {
    name: "João Silva",
    role: "Diretor Técnico",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=500&fit=crop",
    specialties: ["Ginástica Artística", "Preparação Física", "Competição"],
    bio: "Ex-atleta olímpico com mais de 20 anos de experiência. Formou dezenas de atletas que competem a nível nacional e internacional.",
    certifications: ["Treinador Nível III", "Especialista em Biomecânica"],
    instagram: "@joaosilva.coach",
  },
  {
    name: "Maria Santos",
    role: "Treinadora Principal",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop",
    specialties: ["Ginástica Rítmica", "Flexibilidade", "Coreografia"],
    bio: "Campeã nacional de ginástica rítmica. Dedicada ao desenvolvimento técnico e artístico de cada atleta.",
    certifications: ["Treinadora Nível II", "Especialista em Dança"],
    instagram: "@mariasantos.gym",
  },
  {
    name: "Pedro Oliveira",
    role: "Personal Trainer",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop",
    specialties: ["Treino Funcional", "Musculação", "Reabilitação"],
    bio: "Especialista em treino personalizado com foco em resultados. Transforma objetivos em conquistas reais.",
    certifications: ["Personal Trainer Certificado", "Especialista em Nutrição Desportiva"],
    instagram: "@pedro.personaltrainer",
  },
  {
    name: "Ana Costa",
    role: "Treinadora de Grupo",
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=500&fit=crop",
    specialties: ["Aulas de Grupo", "HIIT", "Pilates"],
    bio: "Especialista em criar aulas dinâmicas e motivadoras. A sua energia contagia todos os participantes.",
    certifications: ["Instrutora de Group Fitness", "Certificação Pilates Mat"],
    instagram: "@anacosta.fitness",
  },
  {
    name: "Ricardo Ferreira",
    role: "Treinador Juvenil",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
    specialties: ["Ginástica Infantil", "Desenvolvimento Motor", "Trampolins"],
    bio: "Apaixonado por ensinar os mais novos. Especialista em introduzir crianças ao mundo da ginástica de forma segura e divertida.",
    certifications: ["Treinador Nível I", "Especialista em Psicologia Infantil"],
    instagram: "@ricardo.kids.gym",
  },
  {
    name: "Sofia Martins",
    role: "Fisioterapeuta Desportiva",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop",
    specialties: ["Prevenção de Lesões", "Recuperação", "Performance"],
    bio: "Garante que cada atleta treina em segurança. Especialista em prevenção e recuperação de lesões desportivas.",
    certifications: ["Fisioterapeuta Licenciada", "Especialista em Medicina Desportiva"],
    instagram: "@sofia.physio",
  },
];

const Team = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              A Nossa Equipa
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Profissionais{" "}
              <span className="text-primary">Dedicados</span> ao Teu Sucesso
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A nossa equipa de treinadores altamente qualificados está aqui para te guiar 
              em cada passo da tua jornada. Conhece quem vai acompanhar a tua transformação.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <AnimatedSection key={trainer.name} delay={index * 100}>
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover group">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                    
                    {/* Name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-heading font-bold text-primary-foreground">
                        {trainer.name}
                      </h3>
                      <p className="text-primary font-medium">{trainer.role}</p>
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
                  <div className="p-6">
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trainer.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {trainer.bio}
                    </p>

                    {/* Certifications */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      {trainer.certifications.map((cert) => (
                        <div key={cert} className="flex items-center gap-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
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

export default Team;
