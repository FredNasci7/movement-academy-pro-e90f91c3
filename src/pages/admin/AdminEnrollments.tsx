import { useState } from "react";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  UserPlus,
  Trash2,
  Search,
  Users,
  Loader2,
  Plus,
  User,
  Baby,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminEnrollments } from "@/hooks/useAdminEnrollments";
import { useClasses } from "@/hooks/useClasses";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminEnrollments = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const {
    enrollments,
    isLoading,
    addEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment,
  } = useAdminEnrollments();
  const { classes } = useClasses();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form state for new enrollment
  const [selectedClassId, setSelectedClassId] = useState("");
  const [enrollmentType, setEnrollmentType] = useState<"profile" | "athlete">(
    "athlete"
  );
  const [profiles, setProfiles] = useState<
    { id: string; full_name: string | null }[]
  >([]);
  const [athletes, setAthletes] = useState<
    { id: string; athlete_name: string }[]
  >([]);
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);

  // Fetch profiles or athletes when type changes
  const loadEntities = async (type: "profile" | "athlete") => {
    setIsLoadingEntities(true);
    setSelectedEntityId("");

    try {
      if (type === "profile") {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .order("full_name");
        if (error) throw error;
        setProfiles(data || []);
        setAthletes([]);
      } else {
        const { data, error } = await supabase
          .from("athlete_guardians")
          .select("id, athlete_name")
          .order("athlete_name");
        if (error) throw error;
        setAthletes(data || []);
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error loading entities:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados",
      });
    } finally {
      setIsLoadingEntities(false);
    }
  };

  const handleAddEnrollment = async () => {
    if (!selectedClassId || !selectedEntityId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione a turma e o atleta/utilizador",
      });
      return;
    }

    const success = await addEnrollment({
      class_id: selectedClassId,
      athlete_id: enrollmentType === "athlete" ? selectedEntityId : undefined,
      profile_id: enrollmentType === "profile" ? selectedEntityId : undefined,
    });

    if (success) {
      setIsAddDialogOpen(false);
      setSelectedClassId("");
      setSelectedEntityId("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.class?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.athlete?.athlete_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.profile?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Gestão de Inscrições
            </h1>
            <p className="text-muted-foreground">
              Gerir inscrições de atletas nas turmas
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Inscrição
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Inscrição</DialogTitle>
                <DialogDescription>
                  Inscreva um atleta ou utilizador numa turma
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Turma</Label>
                  <Select
                    value={selectedClassId}
                    onValueChange={setSelectedClassId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.modalidade})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Inscrição</Label>
                  <Select
                    value={enrollmentType}
                    onValueChange={(value: "profile" | "athlete") => {
                      setEnrollmentType(value);
                      loadEntities(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="athlete">
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4" />
                          Atleta (menor)
                        </div>
                      </SelectItem>
                      <SelectItem value="profile">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Utilizador (adulto)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {enrollmentType === "athlete" ? "Atleta" : "Utilizador"}
                  </Label>
                  <Select
                    value={selectedEntityId}
                    onValueChange={setSelectedEntityId}
                    disabled={isLoadingEntities}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingEntities
                            ? "A carregar..."
                            : `Selecionar ${
                                enrollmentType === "athlete"
                                  ? "atleta"
                                  : "utilizador"
                              }`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollmentType === "athlete"
                        ? athletes.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.athlete_name}
                            </SelectItem>
                          ))
                        : profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.full_name || "Sem nome"}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddEnrollment}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Inscrições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{enrollments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inscrições Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {enrollments.filter((e) => e.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Suspensas/Inativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {enrollments.filter((e) => e.status !== "active").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por turma ou atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sem inscrições</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Nenhuma inscrição encontrada com os filtros aplicados"
                  : "Ainda não existem inscrições registadas"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atleta/Utilizador</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data Inscrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {enrollment.athlete ? (
                          <>
                            <Baby className="h-4 w-4 text-muted-foreground" />
                            {enrollment.athlete.athlete_name}
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-muted-foreground" />
                            {enrollment.profile?.full_name || "Sem nome"}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{enrollment.class?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {enrollment.class?.modalidade || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                    <TableCell>
                      {format(
                        new Date(enrollment.enrolled_at),
                        "d MMM yyyy",
                        { locale: pt }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select
                          value={enrollment.status}
                          onValueChange={(value) =>
                            updateEnrollmentStatus(enrollment.id, value)
                          }
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="suspended">Suspenso</SelectItem>
                          </SelectContent>
                        </Select>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Eliminar Inscrição?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser revertida. A inscrição
                                será permanentemente eliminada.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteEnrollment(enrollment.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminEnrollments;
