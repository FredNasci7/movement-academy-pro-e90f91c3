import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Dumbbell } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const modalidades = [
  {
    icon: Award,
    title: "Ginástica",
    description: "Treino de ginástica acrobática com foco em técnica, força e flexibilidade para todas as idades.",
    color: "from-primary to-accent",
    href: "/servicos",
  },
  {
    icon: Users,
    title: "Aulas de Grupo",
    description: "Sessões dinâmicas em grupo para desenvolver coordenação, espírito de equipa e diversão.",
    color: "from-accent to-primary",
    href: "/servicos",
  },
  {
    icon: Dumbbell,
    title: "Treino Personalizado",
    description: "Acompanhamento individual adaptado aos teus objetivos e nível de experiência.",
    color: "from-primary to-accent",
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
            Descobre a Tua{" "}
            <span className="text-primary">Modalidade</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos diferentes modalidades para te ajudar a alcançar os teus objetivos, 
            seja em grupo ou com acompanhamento personalizado.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modalidades.map((modalidade, index) => (
            <AnimatedSection key={modalidade.title} delay={index * 100}>
              <Link
                to={modalidade.href}
                className="group block h-full"
              >
                <div className="h-full bg-card rounded-2xl p-6 shadow-sm border border-border/50 card-hover">
                  {/* Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110",
                    `bg-gradient-to-br ${modalidade.color}`
                  )}>
                    <modalidade.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {modalidade.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {modalidade.description}
                  </p>
                  
                  {/* Link */}
                  <div className="flex items-center text-primary font-medium text-sm">
                    Saber mais
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
