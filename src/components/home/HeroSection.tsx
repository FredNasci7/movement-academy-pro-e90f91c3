import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-acrobatics.jpg";

export function HeroSection() {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay - Acrobatics image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/85 to-foreground/70" />
      </div>

      {/* Decorative elements with blue and gold tones */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="section-container relative z-10 py-32">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent font-medium text-sm mb-6 animate-fade-in border border-accent/30">
            🏆 IMA - Intuitive Movement Academy • Sintra, Colares
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-primary-foreground mb-6 leading-tight animate-fade-in stagger-1">
            Descobre o Poder da{" "}
            <span className="text-accent">Ginástica Acrobática</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-xl leading-relaxed animate-fade-in stagger-2">
            Junta-te à Movement Academy em Colares, Sintra. Formamos atletas de todas 
            as idades em ginástica acrobática, desenvolvendo força, coordenação e espírito de equipa.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in stagger-3">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-glow transition-shadow">
              <Link to="/contacto">
                Aula Experimental Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/servicos">Ver Modalidades</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20 animate-fade-in stagger-4">
            <div>
              <p className="text-3xl sm:text-4xl font-heading font-bold text-accent">200+</p>
              <p className="text-primary-foreground/70 text-sm mt-1">Atletas Ativos</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-heading font-bold text-accent">15+</p>
              <p className="text-primary-foreground/70 text-sm mt-1">Anos de Experiência</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-heading font-bold text-accent">10+</p>
              <p className="text-primary-foreground/70 text-sm mt-1">Treinadores Certificados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors animate-bounce"
        aria-label="Scroll to services"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}