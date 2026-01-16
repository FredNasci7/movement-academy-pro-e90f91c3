import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Users, Baby, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
const services = [{
  id: "ginastica",
  icon: Baby,
  title: "Ginástica de Formação",
  description: "Na Ginástica de formação apostamos num programa estruturado, técnico e pedagógico com objetivos, competências e metas definidas por idades, acompanhados por uma avaliação contínua. Visa o desenvolvimento de competências transversais essenciais às disciplinas gímnicas e a outras modalidades desportivas, promovendo capacidades físicas e coordenativas como resistência, força, flexibilidade, equilíbrio, agilidade, ritmo e controlo corporal. Valoriza ainda o «saber estar», incentivando a cooperação, o respeito, a cordialidade e o cumprimento de regras nas atividades.",
  features: ["Jogos e atividades lúdicas", "Desenvolvimento da coordenação", "Primeiros elementos básicos", "Socialização e trabalho em grupo", "Aulas adaptadas à idade"],
  image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600",
  color: "from-primary to-accent"
}, {
  id: "ginastica-representacao",
  icon: Trophy,
  title: "Ginástica de Representação",
  description: "Ginástica de Representação é a prática da ginástica como espetáculo ou desempenho coletivo, geralmente ligada a apresentações, exibições e competições. Mantém valores educativos e inclusivos, sendo acessível a todas as idades e capacidades e serve como base para outras modalidades, nomeadamente a Acrobática, o nosso foco.",
  features: ["Trabalho em pares, trios ou grupos", "Coreografia e musicalidade", "Desenvolvimento de confiança e cooperação", "Expressão corporal e criatividade"],
  image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=600",
  color: "from-accent to-primary",
  buttonText: "Pedir Informação",
  buttonLink: "/contacto"
}, {
  id: "aulas-de-grupo",
  icon: Users,
  title: "Aulas de Grupo",
  description: "Aulas de Grupo são sessões de treino em pequenos grupos. São pensadas para todos os níveis de habilidade e combinam exercícios que promovem força, coordenação e resistência, ao mesmo tempo em que fortalecem a conexão entre corpo e mente, incentivando o trabalho em equipa e a socialização.",
  features: ["Pilates", "Barre", "Fullbody", "Step"],
  image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600",
  color: "from-primary to-accent"
}, {
  id: "treino-personalizado",
  icon: Sparkles,
  title: "Treino Personalizado",
  description: "Sessão de treino construída especificamente para ti, procurando equilibrar aquilo que gostas com aquilo que precisas. Através destas sessões irás aprender a executar os exercícios de forma segura e consciente, permitindo que estejas dia-após-dia mais perto de alcançar os teus objetivos.",
  features: ["🗓️ Sessões Personalizadas Individuais", "🏋️‍♂️ Avaliação inicial", "📝 Criação de metas mensais", "📋 Plano de Treino Semanal", "📈 Controlo Mensal e monitorização de resultados"],
  image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600",
  color: "from-accent to-primary",
  buttonText: "Agendar",
  buttonLink: "/aula-experimental"
}];
const Services = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [location.hash]);
  return <Layout>
      {/* Hero */}
      <section className="pt-40 bg-gradient-to-b from-primary/5 to-background pb-[40px]">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              As Nossas{" "}
              <span className="text-primary">Modalidades</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experiências únicas e diferentes formas de moveres o teu corpo.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="section-container space-y-20">
          {services.map((service, index) => <AnimatedSection key={service.title} id={service.id}>
              <div className={cn("grid lg:grid-cols-2 gap-12 items-center", index % 2 === 1 && "lg:flex-row-reverse")}>
                <div className={cn(index % 2 === 1 && "lg:order-2")}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", `bg-gradient-to-br ${service.color}`)}>
                      <service.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                      {service.title}
                    </h2>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {service.features.length > 0 && <ul className="space-y-3 mb-8">
                      {service.features.map(feature => <li key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-foreground/80">{feature}</span>
                        </li>)}
                    </ul>}

                  <Button asChild size="lg">
                    <Link to={service.buttonLink || "/aula-experimental"}>
                      {service.buttonText || "Experimentar"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Image */}
                <div className={cn(index % 2 === 1 && "lg:order-1")}>
                  <div className="relative">
                    <div className={cn("absolute -inset-4 rounded-3xl transform", index % 2 === 0 ? "rotate-2 bg-primary/10" : "-rotate-2 bg-accent/10")} />
                    <img src={service.image} alt={service.title} className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover" />
                  </div>
                </div>
              </div>
            </AnimatedSection>)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-8">
              Pronto Para Começar?
            </h2>
            <Button asChild size="lg" variant="gold">
              <Link to="/precos">
                Tabela de Preços
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>;
};
export default Services;