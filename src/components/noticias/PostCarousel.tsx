import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface PostImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface PostCarouselProps {
  postId: string;
  mainImageUrl: string;
  className?: string;
}

export function PostCarousel({ postId, mainImageUrl, className }: PostCarouselProps) {
  const [images, setImages] = useState<string[]>([mainImageUrl]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from("post_images")
        .select("*")
        .eq("post_id", postId)
        .order("display_order");

      if (data && data.length > 0) {
        setImages([mainImageUrl, ...data.map((img: PostImage) => img.image_url)]);
      }
    };

    fetchImages();
  }, [postId, mainImageUrl]);

  if (images.length === 1) {
    return (
      <img
        src={mainImageUrl}
        alt=""
        className={cn("w-full h-full object-cover", className)}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex]}
        alt=""
        className={cn("w-full h-full object-cover transition-opacity duration-300", className)}
      />
      
      {/* Navigation dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Ver imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
