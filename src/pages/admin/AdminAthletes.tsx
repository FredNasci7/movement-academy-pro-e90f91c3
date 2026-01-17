import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Loader2,
  ArrowLeft,
  Phone,
  Calendar,
  Trash2,
  Edit,
  Save,
  Plus,
  Mail,
  UserPlus,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminAthletes, Athlete, AthleteInsert } from "@/hooks/useAdminAthletes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminAthletes = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    athletes,
    isLoading,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    addGuardian,
    removeGuardian,
  } = useAdminAthletes();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);

  // Add/Edit modal state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [formData, setFormData] = useState<AthleteInsert>({
    full_name: "",
    birth_date: null,
    phone: null,
    email: null,
    modalidade: null,
    subscription_status: "inativo",
    subscription_end_date: null,
    notes: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [deletingAthlete, setDeletingAthlete] = useState<Athlete | null>(null);

  // Guardian dialog state
  const [guardianDialogAthlete, setGuardianDialogAthlete] = useState<Athlete | null>(null);
  const [availableGuardians, setAvailableGuardians] = useState<{ id: string; full_name: string | null }[]>([]);
  const [selectedGuardianId, setSelectedGuardianId] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("Encarregado");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  // Filter athletes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAthletes(athletes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = athletes.filter(
      (athlete) =>
        athlete.full_name?.toLowerCase().includes(query) ||
        athlete.phone?.toLowerCase().includes(query) ||
        athlete.email?.toLowerCase().includes(query) ||
        athlete.modalidade?.toLowerCase().includes(query)
    );
    setFilteredAthletes(filtered);
  }, [searchQuery, athletes]);

  // Load guardians when opening guardian dialog
  useEffect(() => {
    if (guardianDialogAthlete) {
      const fetchGuardians = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name")
          .order("full_name");
        setAvailableGuardians(data || []);
      };
      fetchGuardians();
    }
  }, [guardianDialogAthlete]);

  const resetForm = () => {
    setFormData({
      full_name: "",
      birth_date: null,
      phone: null,
      email: null,
      modalidade: null,
      subscription_status: "inativo",
      subscription_end_date: null,
      notes: null,
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setEditingAthlete(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setFormData({
      full_name: athlete.full_name,
      birth_date: athlete.birth_date,
      phone: athlete.phone,
      email: athlete.email,
      modalidade: athlete.modalidade,
      subscription_status: athlete.subscription_status || "inativo",
      subscription_end_date: athlete.subscription_end_date,
      notes: athlete.notes,
    });
    setIsAddDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome é obrigatório",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingAthlete) {
        await updateAthlete(editingAthlete.id, formData);
      } else {
        await addAthlete(formData);
      }
      setIsAddDialogOpen(false);
      resetForm();
      setEditingAthlete(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAthlete) return;
    await deleteAthlete(deletingAthlete.id);
    setDeletingAthlete(null);
  };

  const handleAddGuardian = async () => {
    if (!guardianDialogAthlete || !selectedGuardianId) return;
    await addGuardian(guardianDialogAthlete.id, selectedGuardianId, guardianRelationship);
    setSelectedGuardianId("");
    setGuardianRelationship("Encarregado");
  };

  const handleRemoveGuardian = async (relationshipId: string) => {
    await removeGuardian(relationshipId);
  };

  const getSubscriptionBadge = (status: string | null) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "trial":
        return <Badge className="bg-yellow-500">Trial</Badge>;
      case "expirado":
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin")}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao painel
              </Button>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                      Gestão de Atletas
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Criar e gerir atletas independentemente de terem conta
                  </p>
                </div>
                <Button onClick={handleOpenAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Atleta
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Atletas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{athletes.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {athletes.filter((a) => a.subscription_status === "ativo").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Inativos/Trial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">
                    {athletes.filter((a) => a.subscription_status !== "ativo").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, telefone ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAthletes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Nenhum atleta encontrado"
                      : "Ainda não existem atletas registados"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleOpenAdd} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Atleta
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Nascimento</TableHead>
                        <TableHead>Modalidade</TableHead>
                        <TableHead>Subscrição</TableHead>
                        <TableHead>Encarregados</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAthletes.map((athlete) => (
                        <TableRow key={athlete.id}>
                          <TableCell className="font-medium">
                            {athlete.full_name}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {athlete.phone && (
                                <span className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {athlete.phone}
                                </span>
                              )}
                              {athlete.email && (
                                <span className="flex items-center gap-1 text-sm">
                                  <Mail className="h-3 w-3" />
                                  {athlete.email}
                                </span>
                              )}
                              {!athlete.phone && !athlete.email && (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {athlete.birth_date ? (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(athlete.birth_date), "dd/MM/yyyy")}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {athlete.modalidade ? (
                              <span className="capitalize">
                                {athlete.modalidade.replace("_", " ")}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getSubscriptionBadge(athlete.subscription_status)}
                          </TableCell>
                          <TableCell>
                            {athlete.guardians && athlete.guardians.length > 0 ? (
                              <div className="space-y-1">
                                {athlete.guardians.map((g) => (
                                  <div key={g.id} className="text-sm">
                                    {g.guardian_name || "Sem nome"}{" "}
                                    <span className="text-muted-foreground">
                                      ({g.relationship})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setGuardianDialogAthlete(athlete)}
                                title="Gerir encarregados"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(athlete)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeletingAthlete(athlete)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </motion.div>

            {/* Results count */}
            {!isLoading && filteredAthletes.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                A mostrar {filteredAthletes.length} de {athletes.length} atletas
              </p>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAthlete ? "Editar Atleta" : "Novo Atleta"}
            </DialogTitle>
            <DialogDescription>
              {editingAthlete
                ? "Atualiza os dados do atleta"
                : "Adiciona um novo atleta ao sistema"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Nome do atleta"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      birth_date: e.target.value || null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade</Label>
                <Select
                  value={formData.modalidade || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, modalidade: value || null })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ginastica">Ginástica</SelectItem>
                    <SelectItem value="aulas_grupo">Aulas de Grupo</SelectItem>
                    <SelectItem value="treino_personalizado">
                      Treino Personalizado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value || null })
                  }
                  placeholder="912345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value || null })
                  }
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subscription_status">Estado Subscrição</Label>
                <Select
                  value={formData.subscription_status || "inativo"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subscription_status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expirado">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription_end_date">Fim Subscrição</Label>
                <Input
                  id="subscription_end_date"
                  type="date"
                  value={formData.subscription_end_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription_end_date: e.target.value || null,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value || null })
                }
                placeholder="Notas sobre o atleta..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingAthlete}
        onOpenChange={() => setDeletingAthlete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Atleta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser revertida. O atleta "{deletingAthlete?.full_name}"
              será permanentemente eliminado, incluindo todas as suas inscrições.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Guardian Management Dialog */}
      <Dialog
        open={!!guardianDialogAthlete}
        onOpenChange={() => setGuardianDialogAthlete(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gerir Encarregados</DialogTitle>
            <DialogDescription>
              Associar encarregados ao atleta: {guardianDialogAthlete?.full_name}
            </DialogDescription>
          </DialogHeader>

          {/* Current guardians */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Encarregados Atuais</Label>
              {guardianDialogAthlete?.guardians &&
              guardianDialogAthlete.guardians.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {guardianDialogAthlete.guardians.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div>
                        <span className="font-medium">
                          {g.guardian_name || "Sem nome"}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({g.relationship})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveGuardian(g.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhum encarregado associado
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Adicionar Encarregado</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Select
                  value={selectedGuardianId}
                  onValueChange={setSelectedGuardianId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGuardians.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.full_name || "Sem nome"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Relação (ex: Mãe)"
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                />
              </div>
              <Button
                onClick={handleAddGuardian}
                disabled={!selectedGuardianId}
                className="mt-2"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGuardianDialogAthlete(null)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminAthletes;
