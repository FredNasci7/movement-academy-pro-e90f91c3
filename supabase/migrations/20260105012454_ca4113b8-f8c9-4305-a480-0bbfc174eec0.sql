-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create posts table for news/feed
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'geral',
    data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    fonte TEXT NOT NULL DEFAULT 'manual',
    instagram_url TEXT,
    destaque BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (posts are public content)
CREATE POLICY "Posts are publicly readable" 
ON public.posts 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_posts_data_publicacao ON public.posts (data_publicacao DESC);
CREATE INDEX idx_posts_categoria ON public.posts (categoria);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();