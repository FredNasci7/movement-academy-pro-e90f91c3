import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/noticias/PostCard";
import { PostLightbox } from "@/components/noticias/PostLightbox";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";

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

const categories = [
  { value: "todos", label: "Todos" },
  { value: "conquista", label: "Conquistas" },
  { value: "evento", label: "Eventos" },
  { value: "treino", label: "Treinos" },
  { value: "competicao", label: "Competições" },
];

export default function Noticias() {
  const { isAdmin } = useAdmin();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [lightboxPost, setLightboxPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("data_publicacao", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const filteredPosts = filter === "todos" 
    ? posts 
    : posts.filter(post => post.categoria === filter);

  const currentIndex = lightboxPost 
    ? filteredPosts.findIndex(p => p.id === lightboxPost.id) 
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setLightboxPost(filteredPosts[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredPosts.length - 1) {
      setLightboxPost(filteredPosts[currentIndex + 1]);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="section-container text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Notícias
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Últimas <span className="gradient-text">Novidades</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acompanhe as conquistas, eventos e novidades da IMA - Intuitive Movement Academy
            </p>
            {isAdmin && (
              <Button asChild className="mt-6">
                <Link to="/admin/noticias">
                  <Plus className="w-4 h-4 mr-2" />
                  Gerir Notícias
                </Link>
              </Button>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                  filter === category.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="section-container">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {posts.length === 0 
                  ? "Ainda não há publicações. Em breve teremos novidades!" 
                  : "Nenhuma publicação encontrada nesta categoria."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 100}>
                  <PostCard 
                    post={post} 
                    onClick={() => setLightboxPost(post)} 
                  />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxPost && (
        <PostLightbox
          post={lightboxPost}
          onClose={() => setLightboxPost(null)}
          onPrevious={currentIndex > 0 ? handlePrevious : undefined}
          onNext={currentIndex < filteredPosts.length - 1 ? handleNext : undefined}
        />
      )}
    </Layout>
  );
}
