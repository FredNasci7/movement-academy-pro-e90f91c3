import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Star } from "lucide-react";

const VisitorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Bem-vindo ao IMA!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Descubra as nossas modalidades e marque uma aula experimental gratuita.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="p-2 bg-primary/10 rounded-lg w-fit">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Aula Experimental</CardTitle>
            <CardDescription>
              Experimente uma aula gratuita e conheça o nosso método de trabalho.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/aula-experimental">Marcar Aula</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="p-2 bg-primary/10 rounded-lg w-fit">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Modalidades</CardTitle>
            <CardDescription>
              Conheça as diferentes modalidades disponíveis para todas as idades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/servicos">Ver Modalidades</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="p-2 bg-primary/10 rounded-lg w-fit">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Preçário</CardTitle>
            <CardDescription>
              Consulte os nossos preços e pacotes de mensalidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/precos">Ver Preços</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">
            Já é membro?{" "}
            <Link to="/auth" className="text-primary font-medium hover:underline">
              Inicie sessão
            </Link>{" "}
            para aceder à sua área pessoal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorDashboard;
