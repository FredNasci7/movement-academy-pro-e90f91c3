import { Star, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const testimonials = [
  {
    name: "Catarina Gonçalves",
    content: "É sem dúvida uma iniciativa excelente para não perdermos o treino físico seja onde for, neste caso, em casa. Já tive oportunidade de ter aulas com a Bia e confesso que, apesar de sair da aula completamente partida, adorei e sentia-me super bem. Vou recomendar muito",
    rating: 5,
  },
  {
    name: "Maria Lune",
    content: "Recomendo muito! As aulas são óptimas e diversificadas, o ambiente é espetacular e têm o cuidado de personalizar os exercícios às necessidades dos alunos quando é necessário.",
    rating: 5,
  },
  {
    name: "Carolina Gonçalves e Matilde Gonçalves",
    content: "É um projeto inovador, com aulas diversificadas e modalidades diferentes do tradicional. Além disso, somos acompanhadas por excelentes profissionais que se preocupam com a nossa evolução, Obrigada!",
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
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                    <span className="text-primary font-heading font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      {testimonial.name}
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
