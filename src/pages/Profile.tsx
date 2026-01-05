import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Phone, Calendar, AlertCircle, Loader2, Save } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedSection } from "@/components/ui/animated-section";

const profileSchema = z.object({
  full_name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome é demasiado longo"),
  phone: z.string().max(20, "Número de telefone inválido").optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  emergency_contact: z.string().max(100, "Nome demasiado longo").optional().or(z.literal("")),
  emergency_phone: z.string().max(20, "Número de telefone inválido").optional().or(z.literal("")),
  notes: z.string().max(500, "Máximo de 500 caracteres").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      birth_date: "",
      emergency_contact: "",
      emergency_phone: "",
      notes: "",
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
          form.reset({
            full_name: data.full_name || "",
            phone: data.phone || "",
            birth_date: data.birth_date || "",
            emergency_contact: data.emergency_contact || "",
            emergency_phone: data.emergency_phone || "",
            notes: data.notes || "",
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
          emergency_contact: data.emergency_contact || null,
          emergency_phone: data.emergency_phone || null,
          notes: data.notes || null,
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

  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border/50 shadow-xl p-8"
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  O Meu Perfil
                </h1>
                <p className="text-muted-foreground">
                  Gere as tuas informações pessoais
                </p>
              </div>

              {/* Email Display */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Email da conta</p>
                <p className="font-medium text-foreground">{user?.email}</p>
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
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="O teu nome completo" />
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
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Contacto de Emergência
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergency_contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome do contacto" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergency_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="912 345 678" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
