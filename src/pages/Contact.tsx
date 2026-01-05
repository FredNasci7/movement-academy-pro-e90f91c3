import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: "Mensagem enviada!", description: "Entraremos em contacto em breve." });
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">Contacto</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Pedido de <span className="text-primary">Informação</span>
            </h1>
            <p className="text-lg text-muted-foreground">Tens dúvidas? Queres inscrever o teu filho/a? Entra em contacto connosco!</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Envia-nos uma mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input name="name" placeholder="Nome" required />
                    <Input name="email" type="email" placeholder="Email" required />
                  </div>
                  <Input name="phone" placeholder="Telefone" />
                  <Input name="subject" placeholder="Assunto" required />
                  <Textarea name="message" placeholder="Mensagem" rows={5} required />
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "A enviar..." : <>Enviar Mensagem <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                </form>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="space-y-6">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                  <h3 className="font-heading font-bold text-foreground mb-4">Informações de Contacto</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><span className="text-muted-foreground">Colares<br/>2705 Sintra, Portugal</span></div>
                    <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /><a href="tel:+351912345678" className="text-muted-foreground hover:text-primary">+351 912 345 678</a></div>
                    <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /><a href="mailto:info@movementacademy.pt" className="text-muted-foreground hover:text-primary">info@movementacademy.pt</a></div>
                    <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary mt-0.5" /><span className="text-muted-foreground">Seg - Sex: 17:00 - 21:00<br/>Sáb: 09:00 - 13:00</span></div>
                  </div>
                </div>
                <div className="bg-muted rounded-2xl h-64 flex items-center justify-center">
                  <span className="text-muted-foreground">Mapa - Colares, Sintra</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;