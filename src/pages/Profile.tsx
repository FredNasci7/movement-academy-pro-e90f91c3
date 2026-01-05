import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Phone, Calendar, Loader2, Save, Users, CreditCard } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRoles } from "@/hooks/useRoles";
import { useAthleteGuardians } from "@/hooks/useAthleteGuardians";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedSection } from "@/components/ui/animated-section";
import { RoleBadge } from "@/components/profile/RoleBadge";
import { AthleteCard } from "@/components/profile/AthleteCard";
import { AddAthleteForm } from "@/components/profile/AddAthleteForm";

const profileSchema = z.object({
  full_name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome é demasiado longo"),
  phone: z.string().max(20, "Número de telefone inválido").optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  notes: z.string().max(500, "Máximo de 500 caracteres").optional().or(z.literal("")),
  modalidade: z.string().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileData {
  full_name: string | null;
  phone: string | null;
  birth_date: string | null;
  notes: string | null;
  modalidade: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
}

const subscriptionLabels: Record<string, { label: string; className: string }> = {
  ativo: { label: "Subscrição Ativa", className: "bg-green-500/10 text-green-600 border-green-500/30" },
  inativo: { label: "Sem Subscrição", className: "bg-muted text-muted-foreground border-border" },
  trial: { label: "Período de Teste", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" },
  expirado: { label: "Subscrição Expirada", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { roles, isLoading: rolesLoading, isEncarregado, isAtleta } = useRoles();
  const { athletes, isLoading: athletesLoading, addAthlete, updateAthlete, deleteAthlete } = useAthleteGuardians();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      birth_date: "",
      notes: "",
      modalidade: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfileData(data);
          form.reset({
            full_name: data.full_name || "",
            phone: data.phone || "",
            birth_date: data.birth_date || "",
            notes: data.notes || "",
            modalidade: data.modalidade || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, form, toast]);

  const handleSave = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone || null,
          birth_date: data.birth_date || null,
          notes: data.notes || null,
          modalidade: data.modalidade || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Guardado!",
        description: "O teu perfil foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível guardar as alterações",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const subscriptionStatus = profileData?.subscription_status || "inativo";
  const subscriptionConfig = subscriptionLabels[subscriptionStatus] || subscriptionLabels.inativo;

  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection className="max-w-2xl mx-auto space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border/50 shadow-xl p-8"
            >
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  O Meu Perfil
                </h1>
                <p className="text-muted-foreground">
                  Gere as tuas informações pessoais
                </p>
              </div>

              {/* Roles & Subscription */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Email da conta</p>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                </div>

                {!rolesLoading && roles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                )}

                {(isAtleta || profileData?.subscription_status) && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className={subscriptionConfig.className}>
                      {subscriptionConfig.label}
                    </Badge>
                    {profileData?.subscription_end_date && subscriptionStatus === "ativo" && (
                      <span className="text-xs text-muted-foreground">
                        até {new Date(profileData.subscription_end_date).toLocaleDateString("pt-PT")}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                  {/* Personal Info Section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Informação Pessoal
                    </h2>

                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="O teu nome" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input {...field} placeholder="912 345 678" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birth_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input {...field} type="date" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {isAtleta && (
                      <FormField
                        control={form.control}
                        name="modalidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modalidade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar modalidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ginastica">Ginástica</SelectItem>
                                <SelectItem value="aulas_grupo">Aulas de Grupo</SelectItem>
                                <SelectItem value="treino_personalizado">Treino Personalizado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Alergias, condições médicas, ou outras informações relevantes..."
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Informações importantes para os treinadores
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="gold"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        A guardar...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Alterações
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {/* Athletes Section (for Encarregados) */}
            {isEncarregado && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border/50 shadow-xl p-8"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Os Meus Atletas
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Gere os atletas que estão ao teu encargo
                  </p>
                </div>

                {athletesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {athletes.map((athlete) => (
                      <AthleteCard
                        key={athlete.id}
                        athlete={athlete}
                        onUpdate={updateAthlete}
                        onDelete={deleteAthlete}
                      />
                    ))}

                    <AddAthleteForm onAdd={addAthlete} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
