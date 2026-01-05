import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, 
  Loader2, 
  ArrowLeft, 
  Search,
  UserPlus,
  X,
  Check
} from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";
import { AnimatedSection } from "@/components/ui/animated-section";
import { RoleBadge } from "@/components/profile/RoleBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRoles {
  id: string;
  full_name: string | null;
  email?: string;
  roles: AppRole[];
}

const availableRoles: { value: AppRole; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "treinador", label: "Treinador" },
  { value: "atleta", label: "Atleta" },
  { value: "encarregado", label: "Encarregado de Educação" },
  { value: "visitante", label: "Visitante" },
];

const AdminRoles = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [addingRoleFor, setAddingRoleFor] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("atleta");
  const [removingRole, setRemovingRole] = useState<{ user: UserWithRoles; role: AppRole } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // Fetch users with roles
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      try {
        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .order("full_name");

        if (profilesError) throw profilesError;

        // Fetch all roles
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id, role");

        if (rolesError) throw rolesError;

        // Combine data
        const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
          id: profile.id,
          full_name: profile.full_name,
          roles: (roles || [])
            .filter((r) => r.user_id === profile.id)
            .map((r) => r.role),
        }));

        setUsers(usersWithRoles);
        setFilteredUsers(usersWithRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os utilizadores",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, toast]);

  // Filter users based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (u) => u.full_name?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleAddRole = async () => {
    if (!addingRoleFor || !selectedRole) return;

    // Check if user already has this role
    if (addingRoleFor.roles.includes(selectedRole)) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O utilizador já tem esta role",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: addingRoleFor.id,
          role: selectedRole,
        });

      if (error) throw error;

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === addingRoleFor.id
            ? { ...u, roles: [...u.roles, selectedRole] }
            : u
        )
      );

      toast({
        title: "Sucesso!",
        description: `Role "${selectedRole}" atribuída com sucesso`,
      });

      setAddingRoleFor(null);
    } catch (error) {
      console.error("Error adding role:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar a role",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveRole = async () => {
    if (!removingRole) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", removingRole.user.id)
        .eq("role", removingRole.role);

      if (error) throw error;

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === removingRole.user.id
            ? { ...u, roles: u.roles.filter((r) => r !== removingRole.role) }
            : u
        )
      );

      toast({
        title: "Removido",
        description: `Role "${removingRole.role}" removida com sucesso`,
      });

      setRemovingRole(null);
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a role",
      });
    } finally {
      setIsSaving(false);
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

  if (!isAdmin) return null;

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
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Gestão de Permissões
                </h1>
              </div>
              <p className="text-muted-foreground">
                Atribui e remove roles aos utilizadores
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
                  placeholder="Pesquisar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-6 p-4 bg-muted/50 rounded-lg"
            >
              <p className="text-sm font-medium text-foreground mb-2">Roles disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((role) => (
                  <RoleBadge key={role.value} role={role.value} />
                ))}
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
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Nenhum utilizador encontrado"
                      : "Ainda não existem utilizadores"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Roles Atuais</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((userItem) => (
                        <TableRow key={userItem.id}>
                          <TableCell className="font-medium">
                            {userItem.full_name || (
                              <span className="text-muted-foreground italic">
                                Sem nome
                              </span>
                            )}
                            {userItem.id === user?.id && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Tu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {userItem.roles.length === 0 ? (
                                <span className="text-muted-foreground text-sm italic">
                                  Sem roles
                                </span>
                              ) : (
                                userItem.roles.map((role) => (
                                  <div key={role} className="group relative">
                                    <RoleBadge role={role} />
                                    {/* Don't allow removing own admin role */}
                                    {!(userItem.id === user?.id && role === "admin") && (
                                      <button
                                        className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        onClick={() => setRemovingRole({ user: userItem, role })}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAddingRoleFor(userItem);
                                setSelectedRole("atleta");
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Adicionar Role
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </motion.div>

            {/* Results count */}
            {!isLoading && filteredUsers.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                A mostrar {filteredUsers.length} de {users.length} utilizadores
              </p>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Add Role Dialog */}
      <Dialog open={!!addingRoleFor} onOpenChange={() => setAddingRoleFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Role</DialogTitle>
            <DialogDescription>
              Atribuir uma nova role a {addingRoleFor?.full_name || "este utilizador"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedRole}
              onValueChange={(v) => setSelectedRole(v as AppRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles
                  .filter((r) => !addingRoleFor?.roles.includes(r.value))
                  .map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingRoleFor(null)}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleAddRole} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Atribuir Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Role Confirmation */}
      <AlertDialog open={!!removingRole} onOpenChange={() => setRemovingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover role?</AlertDialogTitle>
            <AlertDialogDescription>
              Tens a certeza que queres remover a role "{removingRole?.role}" de{" "}
              {removingRole?.user.full_name || "este utilizador"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveRole} disabled={isSaving}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminRoles;
