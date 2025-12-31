import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

const benefits = [
  "Primeira aula totalmente gratuita",
  "Avaliação física completa",
  "Plano personalizado incluído",
  "Sem compromisso de inscrição",
];

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 to-foreground/80" />
      </div>

      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-3xl" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
              Pronto Para Começar a Tua{" "}
              <span className="text-primary">Transformação</span>?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Marca já a tua aula experimental gratuita e descobre como o movimento 
              pode transformar a tua vida. A nossa equipa está pronta para te ajudar 
              a atingir os teus objetivos.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-glow">
              <Link to="/contacto">
                Marcar Aula Experimental
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </AnimatedSection>

          <AnimatedSection delay={200} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800"
                alt="Treino na Movement Academy"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
