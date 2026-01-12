import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import ginasticaImg from "@/assets/modalidade-ginastica.jpg";
import aulasGrupoImg from "@/assets/modalidade-aulas-grupo.jpg";
import treinoImg from "@/assets/modalidade-treino.jpg";

const modalidades = [
  {
    title: "Ginástica",
    description: "Treino de ginástica com foco em técnica, força e flexibilidade para todas as idades.",
    image: ginasticaImg,
    href: "/servicos",
  },
  {
    title: "Aulas de Grupo",
    description: "Sessões dinâmicas em grupo, adaptadas a todos os níveis e idades.",
    image: aulasGrupoImg,
    href: "/servicos",
  },
  {
    title: "Treino Personalizado",
    description: "Sessões individuais adaptadas aos teus objetivos.",
    image: treinoImg,
    href: "/servicos",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="section-container">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            As Nossas Modalidades
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Para{" "}
            <span className="text-primary">Todas as Idades</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modalidades.map((modalidade, index) => (
            <AnimatedSection key={modalidade.title} delay={index * 100}>
              <Link
                to={modalidade.href}
                className="group block h-full"
              >
                <div 
                  className="h-64 md:h-80 rounded-2xl p-6 shadow-sm border border-border/50 card-hover relative overflow-hidden flex flex-col justify-end"
                  style={{
                    backgroundImage: `url(${modalidade.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-heading font-bold text-primary-foreground mb-2 group-hover:text-accent transition-colors">
                      {modalidade.title}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm leading-relaxed mb-3">
                      {modalidade.description}
                    </p>
                    
                    {/* Link */}
                    <div className="flex items-center text-accent font-medium text-sm">
                      Saber mais
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
