import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const plans = [
  { name: "BABY'MOVE", price: "39", period: "/mês", description: "Ideal para começar", features: ["Acesso à academia", "Aulas de grupo (2x/semana)", "Avaliação física inicial", "App de acompanhamento"] },
  { name: "MINI'MOVE", price: "69", period: "/mês", description: "O mais popular", features: ["Tudo do Básico", "Aulas de grupo ilimitadas", "1 sessão personal/mês", "Nutrição básica", "Acesso 7 dias/semana"] },
  { name: "MOVE'TEAM", price: "119", period: "/mês", description: "Experiência completa", features: ["Tudo do Standard", "4 sessões personal/mês", "Plano nutricional completo", "Acesso área wellness", "Prioridade em marcações"] },
  { name: "MOVE'KIDS", price: "149", period: "/mês", description: "Para toda a família", features: ["2 membros incluídos", "Aulas de grupo ilimitadas", "Descontos em extras", "Acesso 7 dias/semana"] },
  { name: "MINI'TEAM", price: "29", period: "/mês", description: "Até 18 anos", features: ["Acesso à academia", "Aulas de grupo (3x/semana)", "Acompanhamento juvenil", "App de acompanhamento"] },
  { name: "MOVE'TEAM", price: "35", period: "/mês", description: "Maiores de 60 anos", features: ["Acesso à academia", "Aulas adaptadas", "Avaliação física", "Horário flexível"] },
  { name: "PRÉ'TEAM", price: "99", period: "/mês", description: "Treina com um amigo", features: ["2 membros incluídos", "Aulas de grupo ilimitadas", "1 sessão personal/mês", "Acesso 7 dias/semana"] },
  { name: "MA'TEAM REP", price: "549", period: "/ano", description: "Poupança máxima", features: ["Tudo do Standard", "2 meses grátis", "Prioridade em marcações", "Acesso área wellness"] },
];

const Pricing = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Calculate which card is visually centered based on viewport
  const getCenterIndex = (index: number) => {
    // On mobile (1 card visible), the selected card is centered
    // On tablet (2 cards visible), the selected card + 0.5 offset
    // On desktop (3 cards visible), the selected card + 1 offset
    return index;
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Preçário <span className="text-primary">Ginástica</span>
            </h1>
            <p className="text-lg text-muted-foreground">Escolhe o plano ideal para ti. Sem compromissos de longa duração.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <AnimatedSection>
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-4 py-6">
                {plans.map((plan, i) => {
                  const isCentered = i === currentIndex;
                  return (
                    <CarouselItem key={plan.name} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div className={cn(
                        "relative bg-card rounded-2xl p-8 h-full border transition-all duration-300",
                        isCentered 
                          ? "border-primary shadow-lg scale-105" 
                          : "border-border/50 opacity-70"
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
                        <Button asChild className="w-full" variant={isCentered ? "default" : "outline"}>
                          <Link to="/aula-experimental">Experimentar Agora</Link>
                        </Button>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
