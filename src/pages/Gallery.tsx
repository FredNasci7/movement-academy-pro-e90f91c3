import { useState } from "react";
import { X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

const images = [
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", category: "Treino" },
  { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800", category: "Ginástica" },
  { src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800", category: "Grupo" },
  { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", category: "Instalações" },
  { src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", category: "Instalações" },
  { src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800", category: "Treino" },
  { src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", category: "Treino" },
  { src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800", category: "Ginástica" },
];

const categories = ["Todos", "Ginástica", "Treino", "Grupo", "Instalações"];

const Gallery = () => {
  const [filter, setFilter] = useState("Todos");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = filter === "Todos" ? images : images.filter(img => img.category === filter);

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">Galeria</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              O Nosso <span className="text-primary">Espaço</span>
            </h1>
          </AnimatedSection>
          
          <div className="flex justify-center gap-2 flex-wrap mt-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={cn("px-4 py-2 rounded-full font-medium transition-colors", filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10")}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((img, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <button onClick={() => setLightbox(img.src)} className="group relative aspect-square overflow-hidden rounded-xl w-full">
                  <img src={img.src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors" />
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-primary-foreground"><X className="w-8 h-8" /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-xl" />
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
