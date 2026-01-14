import { Link } from "react-router-dom";
import { Check, Clock, Calendar, Euro, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GinasticaPlan {
  name: string;
  price: string;
  priceNote?: string;
  frequency: string;
  duration: string;
  schedule: string;
  category: "formacao" | "representacao";
}

const plansGinastica: GinasticaPlan[] = [
  { 
    name: "MINI'KIDS", 
    price: "20€", 
    frequency: "1x por semana", 
    duration: "45min",
    schedule: "Quintas-feiras 18h00-18h45",
    category: "formacao"
  },
  { 
    name: "BABY'MOVE", 
    price: "24€", 
    frequency: "2x por semana", 
    duration: "30min",
    schedule: "Segundas e Quartas 18h00-18h30",
    category: "formacao"
  },
  { 
    name: "MINI'MOVE", 
    price: "27€", 
    frequency: "2x por semana", 
    duration: "45min",
    schedule: "Terças e Sextas 18h00-18h45",
    category: "formacao"
  },
  { 
    name: "MOVE'KIDS", 
    price: "30€", 
    frequency: "2x por semana", 
    duration: "60min",
    schedule: "Segundas e Quartas 18h30-19h30",
    category: "formacao"
  },
  { 
    name: "MINI'TEAM", 
    price: "30€", 
    frequency: "2x por semana", 
    duration: "60min",
    schedule: "Segundas e Sextas 18h30-19h30",
    category: "formacao"
  },
  { 
    name: "MOVE'TEAM", 
    price: "35€", 
    frequency: "2x por semana", 
    duration: "105min",
    schedule: "Terças e Quintas 18h45-20h30",
    category: "formacao"
  },
  { 
    name: "PRÉ'TEAM", 
    price: "35€", 
    priceNote: "+ Valor de Filiação + Valor de Exame médico desportivo",
    frequency: "2x por semana", 
    duration: "120min",
    schedule: "Segundas e Quintas 19h00-21h00 + pontualmente Sextas",
    category: "representacao"
  },
  { 
    name: "MA'TEAM", 
    price: "35€", 
    priceNote: "+ Valor de Filiação + Valor de Exame médico desportivo",
    frequency: "3x por semana", 
    duration: "120min",
    schedule: "Terças, Quartas e Sextas 19h00-21h00",
    category: "representacao"
  },
];

const plansAulas = [
  { name: "AULA AVULSO", price: "15", period: "/aula", description: "Sem compromisso", features: ["1 aula à escolha", "Acesso pontual", "Sem mensalidade"] },
  { name: "PACK 10 AULAS", price: "120", period: "", description: "Melhor valor", features: ["10 aulas à escolha", "Válido 3 meses", "Flexibilidade total"] },
  { name: "AULAS ILIMITADAS", price: "89", period: "/mês", description: "Para os dedicados", features: ["Aulas ilimitadas", "Todas as modalidades", "Acesso 7 dias/semana"] },
];

const plansTreino = [
  { name: "SESSÃO AVULSO", price: "35", period: "/sessão", description: "Experimenta primeiro", features: ["1 sessão individual", "Plano personalizado", "Acompanhamento dedicado"] },
  { name: "PACK 4 SESSÕES", price: "120", period: "", description: "Mais popular", features: ["4 sessões individuais", "Válido 2 meses", "Avaliação incluída"] },
  { name: "PACK 8 SESSÕES", price: "220", period: "", description: "Máximo compromisso", features: ["8 sessões individuais", "Válido 3 meses", "Plano nutricional básico"] },
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<GinasticaPlan | null>(null);

  const formacaoPlans = plansGinastica.filter(p => p.category === "formacao");
  const representacaoPlans = plansGinastica.filter(p => p.category === "representacao");

  return (
    <Layout>
      {/* Header Ginástica */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Preçário <span className="text-primary">Ginástica</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Escolhe o plano ideal para ti. Sem compromissos de longa duração.
            </p>
            
            {/* Condições Obrigatórias */}
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Condições Obrigatórias</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Valor de inscrição p/época desportiva:</span>{" "}
                  25€ + 12€ quota anual de sócio
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Galeria Formação */}
      <section className="py-8">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
              Mensalidade Ginástica <span className="text-primary">Formação</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {formacaoPlans.map((plan, i) => (
                <button
                  key={`formacao-${i}`}
                  onClick={() => setSelectedPlan(plan)}
                  className={cn(
                    "relative bg-card rounded-xl p-6 border border-border/50 transition-all duration-300",
                    "hover:border-primary hover:shadow-lg hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "group cursor-pointer text-left"
                  )}
                >
                  <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.frequency}</p>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary/10 rounded-full p-1.5">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Galeria Representação */}
      <section className="py-8 pb-16">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
              Mensalidade Ginástica <span className="text-primary">Representação</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {representacaoPlans.map((plan, i) => (
                <button
                  key={`representacao-${i}`}
                  onClick={() => setSelectedPlan(plan)}
                  className={cn(
                    "relative bg-card rounded-xl p-6 border border-border/50 transition-all duration-300",
                    "hover:border-primary hover:shadow-lg hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "group cursor-pointer text-left"
                  )}
                >
                  <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.frequency}</p>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary/10 rounded-full p-1.5">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pop-up Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-bold text-primary">
              {selectedPlan?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6 pt-4">
              {/* Preço */}
              <div className="flex items-baseline gap-2">
                <Euro className="w-5 h-5 text-primary" />
                <span className="text-3xl font-heading font-bold text-foreground">
                  {selectedPlan.price}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              {selectedPlan.priceNote && (
                <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 rounded-lg p-3">
                  {selectedPlan.priceNote}
                </p>
              )}

              {/* Detalhes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{selectedPlan.frequency}</p>
                    <p className="text-sm text-muted-foreground">Duração: {selectedPlan.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Horário</p>
                    <p className="text-sm text-muted-foreground">{selectedPlan.schedule}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button asChild className="w-full mt-4">
                <Link to="/aula-experimental">Experimentar Agora</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Header Aulas de Grupo */}
      <section className="pt-16 pb-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Preçário <span className="text-primary">Aulas de Grupo</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Planos flexíveis para as nossas aulas de grupo.
            </p>
            
            {/* Condições Obrigatórias */}
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Condições Obrigatórias</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Valor de inscrição p/época desportiva:</span>{" "}
                  25€
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Grid Aulas */}
      <section className="py-12">
        <div className="section-container">
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plansAulas.map((plan, i) => {
                const isMiddle = i === 1;
                return (
                  <div key={`aulas-${i}`} className={cn(
                    "relative bg-card rounded-2xl p-8 h-full border transition-all duration-300",
                    isMiddle 
                      ? "border-primary shadow-lg scale-105" 
                      : "border-border/50"
                  )}>
                    <h3 className="text-xl font-heading font-bold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-heading font-bold text-foreground">€{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full" variant={isMiddle ? "default" : "outline"}>
                      <Link to="/aula-experimental">Experimentar Agora</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Header Treino Personalizado */}
      <section className="pt-16 pb-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Preçário <span className="text-primary">Treino Personalizado</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sessões individuais adaptadas aos teus objetivos.
            </p>
            
            {/* Condições Obrigatórias */}
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Condições Obrigatórias</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Valor de inscrição:</span>{" "}
                  25€ (1ª avaliação + Plano de treino)
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Grid Treino Personalizado */}
      <section className="py-12 pb-20">
        <div className="section-container">
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plansTreino.map((plan, i) => {
                const isMiddle = i === 1;
                return (
                  <div key={`treino-${i}`} className={cn(
                    "relative bg-card rounded-2xl p-8 h-full border transition-all duration-300",
                    isMiddle 
                      ? "border-primary shadow-lg scale-105" 
                      : "border-border/50"
                  )}>
                    <h3 className="text-xl font-heading font-bold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-heading font-bold text-foreground">€{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full" variant={isMiddle ? "default" : "outline"}>
                      <Link to="/aula-experimental">Experimentar Agora</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
