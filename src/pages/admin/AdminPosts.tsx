import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string;
  categoria: string;
  data_publicacao: string;
  fonte: string;
  instagram_url: string | null;
  destaque: boolean;
}

interface PostImage {
  id: string;
  post_id: string;
  image_url: string;
  display_order: number;
}

const categories = [
  { value: "conquista", label: "Conquistas" },
  { value: "evento", label: "Eventos" },
  { value: "treino", label: "Treinos" },
  { value: "competicao", label: "Competições" },
  { value: "geral", label: "Geral" },
];

export default function AdminPosts() {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postImages, setPostImages] = useState<Record<string, PostImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    imagem_url: "",
    categoria: "geral",
    data_publicacao: format(new Date(), "yyyy-MM-dd"),
    fonte: "manual",
    instagram_url: "",
    destaque: false,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("data_publicacao", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar notícias");
      console.error(error);
    } else {
      setPosts(data || []);
      // Fetch images for each post
      const imagePromises = (data || []).map(async (post) => {
        const { data: images } = await supabase
          .from("post_images")
          .select("*")
          .eq("post_id", post.id)
          .order("display_order");
        return { postId: post.id, images: images || [] };
      });
      const imagesResults = await Promise.all(imagePromises);
      const imagesMap: Record<string, PostImage[]> = {};
      imagesResults.forEach((result) => {
        imagesMap[result.postId] = result.images;
      });
      setPostImages(imagesMap);
    }
    setLoading(false);
  };

  const uploadImages = async (postId: string, files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${postId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let postId = editingPost?.id;

      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update({
            titulo: formData.titulo,
            descricao: formData.descricao || null,
            imagem_url: formData.imagem_url,
            categoria: formData.categoria,
            data_publicacao: formData.data_publicacao,
            fonte: formData.fonte,
            instagram_url: formData.instagram_url || null,
            destaque: formData.destaque,
          })
          .eq("id", editingPost.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("posts")
          .insert({
            titulo: formData.titulo,
            descricao: formData.descricao || null,
            imagem_url: formData.imagem_url || "https://via.placeholder.com/400",
            categoria: formData.categoria,
            data_publicacao: formData.data_publicacao,
            fonte: formData.fonte,
            instagram_url: formData.instagram_url || null,
            destaque: formData.destaque,
          })
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
      }

      // Handle image deletions
      if (imagesToDelete.length > 0) {
        await supabase
          .from("post_images")
          .delete()
          .in("id", imagesToDelete);
      }

      // Handle new image uploads
      if (newImages.length > 0 && postId) {
        setUploadingImages(true);
        const uploadedUrls = await uploadImages(postId, newImages);
        const existingImages = postImages[postId] || [];
        const startOrder = existingImages.length;

        const imageRecords = uploadedUrls.map((url, index) => ({
          post_id: postId,
          image_url: url,
          display_order: startOrder + index,
        }));

        if (imageRecords.length > 0) {
          await supabase.from("post_images").insert(imageRecords);
        }
        setUploadingImages(false);
      }

      toast.success(editingPost ? "Notícia atualizada!" : "Notícia criada!");
      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message || "Erro ao guardar notícia");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar esta notícia?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao eliminar notícia");
    } else {
      toast.success("Notícia eliminada!");
      fetchPosts();
    }
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({
      titulo: post.titulo,
      descricao: post.descricao || "",
      imagem_url: post.imagem_url,
      categoria: post.categoria,
      data_publicacao: format(new Date(post.data_publicacao), "yyyy-MM-dd"),
      fonte: post.fonte,
      instagram_url: post.instagram_url || "",
      destaque: post.destaque,
    });
    setNewImages([]);
    setImagesToDelete([]);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      titulo: "",
      descricao: "",
      imagem_url: "",
      categoria: "geral",
      data_publicacao: format(new Date(), "yyyy-MM-dd"),
      fonte: "manual",
      instagram_url: "",
      destaque: false,
    });
    setNewImages([]);
    setImagesToDelete([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const markImageForDeletion = (imageId: string) => {
    setImagesToDelete((prev) => [...prev, imageId]);
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
                <h1 className="text-3xl font-heading font-bold">Gestão de Notícias</h1>
                <p className="text-muted-foreground">Criar, editar e remover notícias</p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="mb-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Notícia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? "Editar Notícia" : "Nova Notícia"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="imagem_url">URL da Imagem Principal *</Label>
                    <Input
                      id="imagem_url"
                      value={formData.imagem_url}
                      onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                      placeholder="https://..."
                      required={!editingPost}
                    />
                  </div>

                  <div>
                    <Label>Imagens Adicionais (Carrossel)</Label>
                    <div className="mt-2 space-y-3">
                      {/* Existing images */}
                      {editingPost && postImages[editingPost.id]?.filter(img => !imagesToDelete.includes(img.id)).map((img) => (
                        <div key={img.id} className="flex items-center gap-2 p-2 border rounded">
                          <img src={img.image_url} alt="" className="w-16 h-16 object-cover rounded" />
                          <span className="flex-1 text-sm truncate">{img.image_url}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => markImageForDeletion(img.id)}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      {/* New images to upload */}
                      {newImages.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded bg-muted/50">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          <span className="flex-1 text-sm truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNewImage(index)}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Adicione múltiplas imagens para criar um carrossel
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select
                        value={formData.categoria}
                        onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="data_publicacao">Data de Publicação</Label>
                      <Input
                        id="data_publicacao"
                        type="date"
                        value={formData.data_publicacao}
                        onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instagram_url">URL do Instagram (opcional)</Label>
                    <Input
                      id="instagram_url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/p/..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="destaque"
                      checked={formData.destaque}
                      onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
                    />
                    <Label htmlFor="destaque">Destacar esta notícia</Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting || uploadingImages}>
                      {submitting || uploadingImages ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {uploadingImages ? "A carregar imagens..." : "A guardar..."}
                        </>
                      ) : (
                        editingPost ? "Atualizar" : "Criar"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img
                          src={post.imagem_url}
                          alt={post.titulo}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <CardTitle className="text-lg">{post.titulo}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(post.data_publicacao), "dd/MM/yyyy")} • {post.categoria}
                            {post.destaque && " • ⭐ Destaque"}
                          </p>
                          {postImages[post.id]?.length > 0 && (
                            <p className="text-xs text-primary mt-1">
                              +{postImages[post.id].length} imagens no carrossel
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(post)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {post.descricao && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.descricao}</p>
                    </CardContent>
                  )}
                </Card>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma notícia encontrada. Crie a primeira!
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
