import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Loader2, 
  ArrowLeft, 
  Phone, 
  Calendar, 
  AlertCircle,
  Trash2,
  Edit,
  X,
  Save
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Athlete {
  id: string;
  full_name: string | null;
  phone: string | null;
  birth_date: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const AdminAthletes = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Edit modal state
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [editForm, setEditForm] = useState<Partial<Athlete>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Delete dialog state
  const [deletingAthlete, setDeletingAthlete] = useState<Athlete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  // Fetch athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      if (!isAdmin) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAthletes(data || []);
        setFilteredAthletes(data || []);
      } catch (error) {
        console.error("Error fetching athletes:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os atletas",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchAthletes();
    }
  }, [isAdmin, toast]);

  // Filter athletes based on search
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
        athlete.emergency_contact?.toLowerCase().includes(query)
    );
    setFilteredAthletes(filtered);
  }, [searchQuery, athletes]);

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setEditForm({
      full_name: athlete.full_name || "",
      phone: athlete.phone || "",
      birth_date: athlete.birth_date || "",
      emergency_contact: athlete.emergency_contact || "",
      emergency_phone: athlete.emergency_phone || "",
      notes: athlete.notes || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingAthlete) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name || null,
          phone: editForm.phone || null,
          birth_date: editForm.birth_date || null,
          emergency_contact: editForm.emergency_contact || null,
          emergency_phone: editForm.emergency_phone || null,
          notes: editForm.notes || null,
        })
        .eq("id", editingAthlete.id);

      if (error) throw error;

      // Update local state
      setAthletes((prev) =>
        prev.map((a) =>
          a.id === editingAthlete.id
            ? { ...a, ...editForm, updated_at: new Date().toISOString() }
            : a
        )
      );

      toast({
        title: "Guardado!",
        description: "Os dados do atleta foram atualizados",
      });

      setEditingAthlete(null);
    } catch (error) {
      console.error("Error updating athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível guardar as alterações",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAthlete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", deletingAthlete.id);

      if (error) throw error;

      // Update local state
      setAthletes((prev) => prev.filter((a) => a.id !== deletingAthlete.id));

      toast({
        title: "Eliminado",
        description: "O perfil do atleta foi eliminado",
      });

      setDeletingAthlete(null);
    } catch (error) {
      console.error("Error deleting athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível eliminar o perfil",
      });
    } finally {
      setIsDeleting(false);
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
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Gestão de Atletas
                </h1>
              </div>
              <p className="text-muted-foreground">
                Visualiza e gere os perfis de todos os atletas inscritos
              </p>
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
                  placeholder="Pesquisar por nome ou telefone..."
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
                      ? "Nenhum atleta encontrado com essa pesquisa"
                      : "Ainda não existem atletas registados"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Data de Nascimento</TableHead>
                        <TableHead>Contacto Emergência</TableHead>
                        <TableHead>Inscrito em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAthletes.map((athlete) => (
                        <TableRow key={athlete.id}>
                          <TableCell className="font-medium">
                            {athlete.full_name || (
                              <span className="text-muted-foreground italic">
                                Sem nome
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {athlete.phone ? (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {athlete.phone}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
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
                            {athlete.emergency_contact ? (
                              <span className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {athlete.emergency_contact}
                                {athlete.emergency_phone && (
                                  <span className="text-muted-foreground text-xs">
                                    ({athlete.emergency_phone})
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(athlete.created_at), "dd MMM yyyy", {
                              locale: pt,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(athlete)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingAthlete} onOpenChange={() => setEditingAthlete(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Atleta</DialogTitle>
            <DialogDescription>
              Atualiza os dados do perfil do atleta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editForm.full_name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-birth">Data de Nascimento</Label>
                <Input
                  id="edit-birth"
                  type="date"
                  value={editForm.birth_date || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, birth_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-emergency-name">Contacto Emergência</Label>
                <Input
                  id="edit-emergency-name"
                  value={editForm.emergency_contact || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, emergency_contact: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-emergency-phone">Tel. Emergência</Label>
                <Input
                  id="edit-emergency-phone"
                  value={editForm.emergency_phone || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, emergency_phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={editForm.notes || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAthlete(null)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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
              Tens a certeza que queres eliminar o perfil de{" "}
              <strong>{deletingAthlete?.full_name || "este atleta"}</strong>?
              Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A eliminar...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminAthletes;
