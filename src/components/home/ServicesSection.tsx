import { Link } from "react-router-dom";
import { ArrowRight, Users, Sparkles, Baby, Star, Crown, Rocket, Medal, Trophy } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const teams = [
  {
    icon: Baby,
    title: "BABY'MOVE",
    description: "Primeiros passos na ginástica para os mais pequeninos. Desenvolvimento motor e diversão.",
    color: "from-pink-400 to-pink-600",
    href: "/servicos",
  },
  {
    icon: Star,
    title: "MINI'MOVE",
    description: "Continuação do trabalho de base com introdução a elementos mais técnicos.",
    color: "from-purple-400 to-purple-600",
    href: "/servicos",
  },
  {
    icon: Sparkles,
    title: "MOVE'KIDS",
    description: "Desenvolvimento técnico para crianças com foco na coordenação e flexibilidade.",
    color: "from-primary to-accent",
    href: "/servicos",
  },
  {
    icon: Users,
    title: "MINI'TEAM",
    description: "Introdução ao trabalho em equipa e primeiras formações acrobáticas.",
    color: "from-accent to-primary",
    href: "/servicos",
  },
  {
    icon: Rocket,
    title: "MOVE'TEAM",
    description: "Equipa de formação intermédia com treinos mais intensivos.",
    color: "from-primary to-accent",
    href: "/servicos",
  },
  {
    icon: Trophy,
    title: "MA'TEAM",
    description: "Equipa de competição com atletas avançados. Preparação para campeonatos.",
    color: "from-accent to-primary",
    href: "/servicos",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="section-container">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            As Nossas Equipas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Equipas Para{" "}
            <span className="text-primary">Todas as Idades</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temos 7 equipas de ginástica acrobática para atletas dos 3 aos 18 anos, 
            desde a iniciação até ao nível de competição nacional.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <AnimatedSection key={team.title} delay={index * 100}>
              <Link
                to={team.href}
                className="group block h-full"
              >
                <div className="h-full bg-card rounded-2xl p-6 shadow-sm border border-border/50 card-hover">
                  {/* Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110",
                    `bg-gradient-to-br ${team.color}`
                  )}>
                    <team.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {team.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {team.description}
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