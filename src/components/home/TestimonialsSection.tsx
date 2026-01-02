import { Star, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const testimonials = [
  {
    name: "Sofia Mendes",
    role: "Atleta de Ginástica",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "A Movement Academy transformou completamente a minha técnica. Os treinadores são incríveis e o ambiente é muito motivador!",
    rating: 5,
  },
  {
    name: "Pedro Santos",
    role: "Membro há 2 anos",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "O treino personalizado mudou a minha vida. Perdi 15kg e ganhei uma confiança que nunca pensei ter. Recomendo a 100%!",
    rating: 5,
  },
  {
    name: "Ana Rodrigues",
    role: "Aulas de Grupo",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "As aulas de grupo são fantásticas! A energia é contagiante e os resultados aparecem rapidamente. Adorei o ambiente familiar.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-primary/90 shadow-[inset_0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="section-container">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-white font-medium text-sm mb-4">
            Testemunhos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            O Que Dizem os{" "}
            <span className="text-gold">Nossos Atletas</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Histórias reais de pessoas que transformaram as suas vidas através do movimento.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} delay={index * 150}>
              <div className="bg-white rounded-2xl p-8 shadow-lg h-full relative">
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-foreground/80 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
