
-- Phase 1: Create new athletes table
CREATE TABLE public.athletes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    birth_date DATE,
    phone TEXT,
    email TEXT,
    modalidade TEXT,
    subscription_status TEXT DEFAULT 'inativo',
    subscription_end_date DATE,
    notes TEXT,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for athletes - admin only first
CREATE POLICY "Admins can manage all athletes"
ON public.athletes
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_athletes_updated_at
BEFORE UPDATE ON public.athletes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
