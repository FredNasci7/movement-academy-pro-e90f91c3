import { Instagram, Calendar, Star } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { PostCarousel } from "./PostCarousel";

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

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  conquista: "bg-yellow-500/90 text-white",
  evento: "bg-purple-500/90 text-white",
  treino: "bg-green-500/90 text-white",
  competicao: "bg-red-500/90 text-white",
  geral: "bg-primary/90 text-primary-foreground",
};

const categoryLabels: Record<string, string> = {
  conquista: "Conquista",
  evento: "Evento",
  treino: "Treino",
  competicao: "Competição",
  geral: "Geral",
};

export function PostCard({ post, onClick }: PostCardProps) {
  const formattedDate = format(new Date(post.data_publicacao), "d 'de' MMMM, yyyy", { locale: pt });

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <PostCarousel
          postId={post.id}
          mainImageUrl={post.imagem_url}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.categoria] || categoryColors.geral}`}>
          {categoryLabels[post.categoria] || post.categoria}
        </span>
        
        {/* Destaque Badge */}
        {post.destaque && (
          <span className="absolute top-3 right-3 p-2 rounded-full bg-accent text-accent-foreground">
            <Star className="w-4 h-4 fill-current" />
          </span>
        )}
        
        {/* Instagram Icon */}
        {post.fonte === "instagram" && (
          <span className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Instagram className="w-4 h-4" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        
        {/* Title */}
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.titulo}
        </h3>
        
        {/* Description */}
        {post.descricao && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {post.descricao}
          </p>
        )}
      </div>
    </div>
  );
}
