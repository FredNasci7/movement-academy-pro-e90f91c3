import { Link } from "react-router-dom";
import { ArrowRight, Dumbbell, Users, Sparkles, Target } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Sparkles,
    title: "Ginástica Artística",
    description: "Desenvolve força, flexibilidade e coordenação com técnicas profissionais de ginástica.",
    color: "from-primary to-accent",
    href: "/servicos",
  },
  {
    icon: Dumbbell,
    title: "Treino Personalizado",
    description: "Programas personalizados adaptados aos teus objetivos e nível de condição física.",
    color: "from-accent to-primary",
    href: "/servicos",
  },
  {
    icon: Users,
    title: "Aulas de Grupo",
    description: "Treina em comunidade com aulas dinâmicas e motivadoras para todos os níveis.",
    color: "from-primary to-accent",
    href: "/servicos",
  },
  {
    icon: Target,
    title: "Treino Funcional",
    description: "Melhora a tua performance diária com exercícios funcionais e práticos.",
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
            Os Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Treino Profissional para{" "}
            <span className="text-primary">Todos os Níveis</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos uma variedade de programas desenhados para te ajudar a atingir os teus objetivos, 
            seja qual for o teu nível de experiência.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 100}>
              <Link
                to={service.href}
                className="group block h-full"
              >
                <div className="h-full bg-card rounded-2xl p-6 shadow-sm border border-border/50 card-hover">
                  {/* Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110",
                    `bg-gradient-to-br ${service.color}`
                  )}>
                    <service.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
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
