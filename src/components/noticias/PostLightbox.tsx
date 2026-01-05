import { X, ChevronLeft, ChevronRight, Instagram, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";

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

interface PostLightboxProps {
  post: Post;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const categoryLabels: Record<string, string> = {
  conquista: "Conquista",
  evento: "Evento",
  treino: "Treino",
  competicao: "Competição",
  geral: "Geral",
};

export function PostLightbox({ post, onClose, onPrevious, onNext }: PostLightboxProps) {
  const formattedDate = format(new Date(post.data_publicacao), "d 'de' MMMM, yyyy", { locale: pt });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation - Previous */}
      {onPrevious && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrevious(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Navigation - Next */}
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Content */}
      <div 
        className="bg-card rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="md:w-1/2 flex-shrink-0">
          <img
            src={post.imagem_url}
            alt={post.titulo}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          {/* Category */}
          <span className="inline-block self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            {categoryLabels[post.categoria] || post.categoria}
          </span>

          {/* Date */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>

          {/* Title */}
          <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
            {post.titulo}
          </h2>

          {/* Description */}
          {post.descricao && (
            <p className="text-muted-foreground leading-relaxed flex-grow">
              {post.descricao}
            </p>
          )}

          {/* Instagram Link */}
          {post.instagram_url && (
            <Button
              asChild
              variant="outline"
              className="mt-6 gap-2"
            >
              <a href={post.instagram_url} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4" />
                Ver no Instagram
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
