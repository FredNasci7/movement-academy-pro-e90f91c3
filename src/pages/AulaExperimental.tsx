import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Send, Phone, Mail, User, Users, Baby } from "lucide-react";

const countryCodes = [
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+34", country: "Espanha", flag: "🇪🇸" },
  { code: "+33", country: "França", flag: "🇫🇷" },
  { code: "+44", country: "Reino Unido", flag: "🇬🇧" },
  { code: "+49", country: "Alemanha", flag: "🇩🇪" },
  { code: "+39", country: "Itália", flag: "🇮🇹" },
  { code: "+1", country: "EUA/Canadá", flag: "🇺🇸" },
  { code: "+55", country: "Brasil", flag: "🇧🇷" },
];

const interestOptions = [
  { value: "ginastica", label: "Ginástica" },
  { value: "aulas-grupo", label: "Aulas de grupo" },
  { value: "treino-personalizado", label: "Treino personalizado" },
];

const AulaExperimental = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    countryCode: "+351",
    telefone: "",
    interesse: "",
    nomeEncarregado: "",
    nomeAtleta: "",
    idadeAtleta: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome.trim() || !formData.email.trim() || !formData.interesse) {
      toast({
        title: "Erro",
        description: "Por favor, preenche todos os campos obrigatórios antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    // Validação dos campos adicionais quando interesse está selecionado
    if (formData.interesse && (!formData.nomeEncarregado.trim() || !formData.nomeAtleta.trim() || !formData.idadeAtleta.trim())) {
      toast({
        title: "Erro",
        description: "Por favor, preenche os dados do encarregado de educação e da atleta.",
        variant: "destructive",
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insere um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Sucesso!",
      description: "Obrigado! O teu pedido foi enviado com sucesso. Entraremos em contacto em breve.",
    });

    // Reset form
    setFormData({
      nome: "",
      email: "",
      countryCode: "+351",
      telefone: "",
      interesse: "",
      nomeEncarregado: "",
      nomeAtleta: "",
      idadeAtleta: "",
    });

    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Experimenta gratuitamente</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              AULA EXPERIMENTAL
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Junta-te à Movement Academy! Inscreve-te para receber mais informações, planos e novidades exclusivas.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl shadow-lg border border-border/50 p-8 md:p-12 space-y-8 animate-slide-up"
            >
              {/* Nome Completo */}
              <div className="space-y-3">
                <Label htmlFor="nome" className="text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="O teu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className="h-12 text-base rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 text-base rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                />
              </div>

              {/* Telefone com código de país */}
              <div className="space-y-3">
                <Label htmlFor="telefone" className="text-base font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Telefone / Telemóvel <span className="text-muted-foreground text-sm font-normal">(opcional)</span>
                </Label>
                <div className="flex gap-3">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => handleInputChange("countryCode", value)}
                  >
                    <SelectTrigger className="w-32 h-12 rounded-xl border-border/60 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="912 345 678"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    className="flex-1 h-12 text-base rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                  />
                </div>
              </div>

              {/* O que procura */}
              <div className="space-y-3">
                <Label htmlFor="interesse" className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  O que procura? <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.interesse}
                  onValueChange={(value) => handleInputChange("interesse", value)}
                >
                  <SelectTrigger className="h-12 text-base rounded-xl border-border/60 bg-background">
                    <SelectValue placeholder="Seleciona uma opção" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {interestOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos condicionais - aparecem quando interesse está selecionado */}
              {formData.interesse && (
                <div className="space-y-6 pt-4 border-t border-border/50 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">Dados do Encarregado de Educação e Atleta</span>
                  </div>

                  {/* Nome do Encarregado de Educação */}
                  <div className="space-y-3">
                    <Label htmlFor="nomeEncarregado" className="text-base font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Nome do Encarregado de Educação <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nomeEncarregado"
                      type="text"
                      placeholder="Nome completo do encarregado de educação"
                      value={formData.nomeEncarregado}
                      onChange={(e) => handleInputChange("nomeEncarregado", e.target.value)}
                      className="h-12 text-base rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                    />
                  </div>

                  {/* Nome da Atleta */}
                  <div className="space-y-3">
                    <Label htmlFor="nomeAtleta" className="text-base font-semibold flex items-center gap-2">
                      <Baby className="w-4 h-4 text-primary" />
                      Nome da Atleta <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nomeAtleta"
                      type="text"
                      placeholder="Nome completo da atleta"
                      value={formData.nomeAtleta}
                      onChange={(e) => handleInputChange("nomeAtleta", e.target.value)}
                      className="h-12 text-base rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background"
                    />
                  </div>

                  {/* Idade da Atleta */}
                  <div className="space-y-3">
                    <Label htmlFor="idadeAtleta" className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Idade da Atleta <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="idadeAtleta"
                      type="number"
                      min="2"
                      max="25"
                      placeholder="Idade"
                      value={formData.idadeAtleta}
                      onChange={(e) => handleInputChange("idadeAtleta", e.target.value)}
                      className="h-12 text-base rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 bg-background w-32"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 mt-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    A enviar...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Enviar pedido
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Os campos marcados com <span className="text-destructive">*</span> são obrigatórios.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AulaExperimental;
