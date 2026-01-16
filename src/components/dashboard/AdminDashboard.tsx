import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Settings, FileText, ClipboardList, MessageSquareQuote } from "lucide-react";

const AdminDashboard = () => {
  const quickLinks = [
    { title: "Gerir Atletas", icon: Users, href: "/admin/atletas", description: "Ver e gerir atletas" },
    { title: "Gerir Turmas", icon: Calendar, href: "/admin/turmas", description: "Configurar turmas e horários" },
    { title: "Inscrições", icon: ClipboardList, href: "/admin/inscricoes", description: "Gerir inscrições nas turmas" },
    { title: "Permissões", icon: Settings, href: "/admin/permissoes", description: "Gerir roles de utilizadores" },
    { title: "Notícias", icon: FileText, href: "/admin/noticias", description: "Gerir notícias e publicações" },
    { title: "Testemunhos", icon: MessageSquareQuote, href: "/admin/testemunhos", description: "Gerir testemunhos de atletas" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Painel de Administração</h2>
        <p className="text-muted-foreground">Acesso completo a todas as funcionalidades do sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.href} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{link.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{link.description}</CardDescription>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to={link.href}>Aceder</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
