import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function AdminTestimonials() {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchTestimonials();
    }
  }, [isAdmin]);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar testemunhos");
      console.error(error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update({
            name: formData.name,
            content: formData.content,
            rating: formData.rating,
            is_active: formData.is_active,
            display_order: formData.display_order,
          })
          .eq("id", editingTestimonial.id);

        if (error) throw error;
        toast.success("Testemunho atualizado!");
      } else {
        const { error } = await supabase.from("testimonials").insert({
          name: formData.name,
          content: formData.content,
          rating: formData.rating,
          is_active: formData.is_active,
          display_order: formData.display_order,
        });

        if (error) throw error;
        toast.success("Testemunho criado!");
      }

      setDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message || "Erro ao guardar testemunho");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este testemunho?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao eliminar testemunho");
    } else {
      toast.success("Testemunho eliminado!");
      fetchTestimonials();
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      rating: testimonial.rating,
      is_active: testimonial.is_active,
      display_order: testimonial.display_order,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      content: "",
      rating: 5,
      is_active: true,
      display_order: testimonials.length,
    });
  };

  if (adminLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <section className="pt-32 pb-16">
        <div className="section-container">
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-heading font-bold">Gestão de Testemunhos</h1>
                <p className="text-muted-foreground">Criar, editar e remover testemunhos</p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="mb-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Testemunho
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingTestimonial ? "Editar Testemunho" : "Novo Testemunho"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome do autor"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Testemunho *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="O que o atleta disse..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label>Avaliação</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating
                                ? "fill-gold text-gold"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display_order">Ordem de Exibição</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Ativo (visível na página inicial)</Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          A guardar...
                        </>
                      ) : (
                        editingTestimonial ? "Atualizar" : "Criar"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className={!testimonial.is_active ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          {!testimonial.is_active && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">Inativo</span>
                          )}
                        </div>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(testimonial)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(testimonial.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}

              {testimonials.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum testemunho encontrado. Crie o primeiro!
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
