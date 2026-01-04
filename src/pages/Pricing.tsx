import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const plans = [
  { name: "Básico", price: "39", period: "/mês", description: "Ideal para começar", features: ["Acesso à academia", "Aulas de grupo (2x/semana)", "Avaliação física inicial", "App de acompanhamento"], popular: false },
  { name: "Standard", price: "69", period: "/mês", description: "O mais popular", features: ["Tudo do Básico", "Aulas de grupo ilimitadas", "1 sessão personal/mês", "Nutrição básica", "Acesso 7 dias/semana"], popular: true },
  { name: "Premium", price: "119", period: "/mês", description: "Experiência completa", features: ["Tudo do Standard", "4 sessões personal/mês", "Plano nutricional completo", "Acesso área wellness", "Prioridade em marcações"], popular: false },
];

const Pricing = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto pt-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Planos Para Cada <span className="text-primary">Objetivo</span>
            </h1>
            <p className="text-lg text-muted-foreground">Escolhe o plano ideal para ti. Sem compromissos de longa duração.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 100}>
                <div className={cn("relative bg-card rounded-2xl p-8 h-full border", plan.popular ? "border-primary shadow-lg scale-105" : "border-border/50")}>
                  {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">Mais Popular</span>}
                  <h3 className="text-xl font-heading font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="mb-6"><span className="text-4xl font-heading font-bold text-foreground">€{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" />{f}</li>)}
                  </ul>
                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}><Link to="/contacto">Começar Agora</Link></Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
