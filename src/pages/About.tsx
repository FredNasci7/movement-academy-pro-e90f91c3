import { Link } from "react-router-dom";
import { ArrowRight, Award, Instagram, Users, Heart, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
const values = [{
  icon: Sparkles,
  title: "Movimento",
  description: "Acreditamos que o movimento é a base de uma vida saudável e plena. Cada exercício é uma oportunidade de evolução."
}, {
  icon: Heart,
  title: "Saúde",
  description: "Cuidar do corpo e da mente é essencial. Valorizamos hábitos que promovem bem-estar e qualidade de vida."
}, {
  icon: BookOpen,
  title: "Aprendizagem",
  description: "Cada experiência é uma chance de crescer. Incentivamos o desenvolvimento contínuo e a descoberta do potencial individual."
}, {
  icon: Users,
  title: "Comunidade",
  description: "Juntos somos mais fortes. Construímos conexões que apoiam, inspiram e fortalecem todos os membros."
}];
const stats = [{
  value: "2021",
  label: "Ano de Fundação"
}, {
  value: "170+",
  label: "Crianças/Atletas"
}, {
  value: "65+",
  label: "Atletas Federadas"
}, {
  value: "4+",
  label: "Anos de Experiência"
}];
const trainers = [{
  name: "Bia",
  role: "Treinadora Grau II Ginástica Acrobática / Personal Trainer / Instrutora de Barre / Fundadora",
  image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop"
}, {
  name: "Carol",
  role: "Treinadora Grau I Ginástica / Personal Trainer / Instrutora de Pilates",
  image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=500&fit=crop"
}, {
  name: "David",
  role: "Treinador Grau I Ginástica / Personal Trainer",
  image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop"
}, {
  name: "Tiago",
  role: "Monitor",
  image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop"
}, {
  name: "Bia",
  role: "Monitora / Marketing",
  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop"
}];
const About = () => {
  return <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-[165px] pt-[150px] pb-[20px]">
        <div className="section-container">
          <AnimatedSection className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Uma Academia Dedicada ao{" "}
              <span className="text-primary">Movimento</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Uma associação sem fins lucrativos dedicada à promoção, divulgação e desenvolvimento da 
              Ginástica, junto dos seus associados e da comunidade em geral. Atuamos nas vertentes 
              de formação, representação e competição, bem como no desenvolvimento de outras 
              práticas desportivas, culturais e recreativas, contribuindo para o crescimento desportivo 
              da associação e da comunidade.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 pb-0">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform -rotate-2" />
                <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800" alt="Academia Movement Academy" className="relative rounded-2xl shadow-lg w-full" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-6">
                A Nossa História
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Fundada a 3 de fevereiro de 2021 e em setembro de 2021 iniciámos uma parceria com 
                  a União Desportiva e Cultural de Nafarros, onde estivemos sediados até Junho de 2025. As 
                  condições oferecidas por esta parceria, aliadas ao nosso investimento próprio, permitiram-nos 
                  expandir o projeto e alcançar um dos nossos principais objetivos: a abertura de 
                  diferentes classes de ginástica para crianças, contando atualmente com 170 crianças/atletas.
                </p>
                <p>
                  A Associação Intuitive Movement Academy foi constituída a 10 de janeiro de 2024 e, 
                  em setembro de 2024 avançámos com o pedido de filiação à Federação de Ginástica de 
                  Portugal, contando atualmente com +65 atletas filiadas e com participação ativa em 
                  representações.
                </p>
                <p>
                  Com o crescimento do número de atletas e o aumento da carga horária, tornou-se 
                  necessário encontrar novas instalações. Atualmente, estamos sediados na Escola Básica da 
                  Sarrazola, com o apoio da Câmara Municipal de Sintra, onde continuamos a desenvolver 
                  as nossas atividades. Este crescimento gradual e sustentável, embora traga novos desafios, 
                  reforça o nosso compromisso em levar o desporto a mais pessoas e a mais lugares. Para 
                  garantir a expansão do projeto, a participação em competições e representações, bem 
                  como a manutenção da qualidade, segurança e condições adequadas para todos os 
                  envolvidos, continuamos a procurar parcerias e apoios estratégicos.
                </p>
                <p>
                  Somos uma comunidade de entusiastas do movimento, um espaço de aprendizagem que 
                  promove o crescimento, o bem-estar e a saúde. Através desta comunidade, as pessoas 
                  podem explorar os benefícios do exercício para a sua saúde, reivindicando o movimento 
                  como forma de se sentirem bem.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <AnimatedSection key={stat.label} delay={index * 100}>
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-heading font-bold text-primary-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/80">{stat.label}</p>
                </div>
              </AnimatedSection>)}
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground text-center">
              Mensagem da <span className="text-primary">Fundadora</span>
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={100}>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Vou começar por partilhar com vocês aquilo que é a minha paixão, o Desporto. Fui ginasta durante 8 anos, 
                  um marco muito importante na minha vida! Durante estes anos fui descobrindo este gosto não só pela prática, 
                  mas também de proporcionar conhecimento aos outros, o que me levou a definir, desde cedo que esta era a área 
                  que eu ia seguir.
                </p>
                <p>
                  Estudei na Universidade Europeia, Ciências do Desporto e da Atividade Física e entrei desde muito cedo, 
                  com os meus 18 anos, para este mercado de trabalho.
                </p>
                <p>
                  Comecei por dedicar-me ao Treino Desportivo, mas rapidamente descobri também um gosto pelo Exercício e Saúde, 
                  levando-me assim a tirar alguns cursos de especialização na área. Posteriormente a isso, surgiu este projeto 
                  que tem como objetivo trazer algo de diferente, bom e positivo para a nossa comunidade, fazendo-vos explorar 
                  aquilo que é o movimento e os benefícios deste na vossa saúde.
                </p>
                <p>
                  Quando penso em movimento tudo o que me vem à cabeça são palavras como beleza, consciência, intuição, dinâmica 
                  e fluidez. Todos estes conceitos ajudaram-me a cultivar uma relação positiva com o exercício, mostrando-me a 
                  importância deste na minha vida.
                </p>
                <p>
                  Procuro com este projeto, ajudar-vos a encontrar essa mesma relação, proporcionando-vos experiências únicas, 
                  distintas e personalizadas.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform rotate-2" />
                <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=700&fit=crop" alt="Beatriz Pinto - Fundadora" className="relative rounded-2xl shadow-lg w-full max-w-md mx-auto" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Os Nossos <span className="text-primary">Valores</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => <AnimatedSection key={value.title} delay={index * 100}>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 h-full card-hover">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>)}
          </div>
        </div>
      </section>

      {/* Mission/Lema */}
      <section className="py-24 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1920')"
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/90 to-foreground/85" />
        </div>
        
        <div className="section-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-6">
                Lema
              </h2>
              <p className="text-xl sm:text-2xl text-primary-foreground/90 leading-relaxed italic">
                "Move-te de forma consciente, intuitiva e liberta o teu potencial."
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              A Nossa Equipa
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Profissionais <span className="text-primary">Dedicados</span> ao Teu Sucesso
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A nossa equipa de treinadores altamente qualificados está aqui para te guiar 
              em cada passo da tua jornada.
            </p>
          </AnimatedSection>

          {/* First row - 3 trainers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {trainers.slice(0, 3).map((trainer, index) => <AnimatedSection key={`${trainer.name}-${index}`} delay={index * 100}>
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                    
                    {/* Name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-heading font-bold text-primary-foreground">
                        {trainer.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {trainer.role}
                    </p>
                  </div>
                </div>
              </AnimatedSection>)}
          </div>

          {/* Second row - 2 trainers centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {trainers.slice(3, 5).map((trainer, index) => <AnimatedSection key={`${trainer.name}-${index + 3}`} delay={(index + 3) * 100}>
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                    
                    {/* Name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-heading font-bold text-primary-foreground">
                        {trainer.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {trainer.role}
                    </p>
                  </div>
                </div>
              </AnimatedSection>)}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-muted/50">
        <div className="section-container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <Award className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Queres Fazer Parte da Equipa?
            </h2>
            <p className="text-muted-foreground mb-8">
              Estamos sempre à procura de profissionais apaixonados pelo movimento. 
              Se partilhas os nossos valores, entra em contacto connosco.
            </p>
            <Button asChild size="lg">
              <Link to="/contacto">
                Candidatar-me
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>;
};
export default About;