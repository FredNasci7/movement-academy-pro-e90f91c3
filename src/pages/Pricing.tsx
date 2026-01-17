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

// Removed plansAulas and plansTreino arrays - simplified pricing

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
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Preços
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Preçário <span className="text-primary">Ginástica</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Preços para as nossas classes de ginástica.
            </p>
            
            {/* Condições Obrigatórias */}
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Condições Obrigatórias</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Inscrição p/época desportiva:</span>{" "}
                  25€
                </p>
                <p>
                  <span className="font-medium text-foreground">Quota anual de sócio:</span>{" "}
                  12€
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
                  <p className="text-sm font-semibold text-primary mt-1">{plan.price}/mês</p>
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
                  <p className="text-sm font-semibold text-primary mt-1">{plan.price}/mês</p>
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
                <Link to={selectedPlan?.category === "representacao" ? "/contacto" : "/aula-experimental"}>
                  {selectedPlan?.category === "representacao" ? "Pedido de Informação" : "Experimentar Agora"}
                </Link>
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
              Preçário <span className="text-primary">Aulas</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Preços para as nossas aulas de grupo e treino personalizado.
            </p>
            
            {/* Condições Obrigatórias */}
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Condições Obrigatórias</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Valor de inscrição:</span>{" "}
                  25€
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Preçário Aulas - Unified */}
      <section className="py-12 pb-20">
        <div className="section-container">
          <AnimatedSection>
            <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
                Preçário Aulas
              </h3>
              
              <div className="space-y-6">
                {/* Aulas de Grupo */}
                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-semibold text-primary">Aulas de Grupo</h4>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-foreground">Aula Avulso</span>
                    <span className="text-xl font-heading font-bold text-foreground">8€</span>
                  </div>
                </div>

                {/* Treino Personalizado */}
                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-semibold text-primary">Treino Personalizado</h4>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-foreground">Online</span>
                    <span className="text-xl font-heading font-bold text-foreground">15€ <span className="text-sm font-normal text-muted-foreground">/sessão</span></span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-foreground">Presencial</span>
                    <span className="text-xl font-heading font-bold text-foreground">25€ <span className="text-sm font-normal text-muted-foreground">/sessão</span></span>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full mt-8">
                <Link to="/aula-experimental">Experimentar Agora</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </Layout>
  );
};

export default Pricing;
