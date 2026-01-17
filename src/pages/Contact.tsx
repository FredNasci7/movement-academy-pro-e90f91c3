import { useState } from "react";
import { MapPin, Phone, Mail, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

const faqs = [{
  question: "Quais são as formas de pagamento disponíveis?",
  answer: "Aceitamos pagamento por transferência bancária e em numerário. De momento, não disponibilizamos pagamento por MB WAY."
}, {
  question: "Há descontos para famílias?",
  answer: "Sim. Nas mensalidades de ginástica, aplicamos um desconto de 10% para irmãos, sendo este válido apenas a partir do segundo inscrito."
}, {
  question: "O que devo levar para os treinos?",
  answer: "Roupa confortável e, de preferência, justa ao corpo e rabo de cavalo. Poderá treinar de meias ou descalço(a). Recomendamos que traga uma garrafa de água."
}];

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const { data: result, error } = await supabase.functions.invoke("send-email-smtp", {
        body: { type: "contact", data },
      });

      if (error) {
        throw new Error(error.message || "Erro ao enviar mensagem");
      }

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contacto em breve.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Ocorreu um erro ao enviar a mensagem. Por favor, tenta novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-32 bg-gradient-to-b from-primary/5 to-background pb-0">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">Contato</span>
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
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Escola Básica Sarrazola<br />
                        2705-352 Colares<br />
                        Sintra, Portugal
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href="tel:+351916799255" className="text-muted-foreground hover:text-primary transition-colors">
                        +351 916 799 255
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href="mailto:info@movementacademy.pt" className="text-muted-foreground hover:text-primary transition-colors">
                        info@movementacademy.pt
                      </a>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-64 bg-muted/20">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-9.4463!3d38.7978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQ3JzUyLjEiTiA5wrAyNic0Ni43Ilc!5e0!3m2!1spt-PT!2spt&output=embed" width="100%" height="100%" style={{
                    border: 0
                  }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Localização IMA - Escola Básica Sarrazola" className="pointer-events-none" />
                  <a href="https://www.google.com/maps/search/Escola+Básica+Sarrazola+Colares+Sintra" target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-background/80 backdrop-blur px-3 py-2 text-sm text-foreground hover:bg-background transition-colors">
                    Abrir no Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
            <p className="text-muted-foreground">
              Encontra aqui as respostas às dúvidas mais comuns
            </p>
          </AnimatedSection>

          <AnimatedSection delay={100} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl border border-border/50 px-6 shadow-sm">
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
