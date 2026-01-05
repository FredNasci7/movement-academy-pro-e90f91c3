-- Phase 1B: Expand profiles and create athlete_guardians table

-- 1. Add subscription and modalidade fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inativo',
ADD COLUMN IF NOT EXISTS subscription_end_date DATE,
ADD COLUMN IF NOT EXISTS modalidade TEXT;

-- Add check constraints separately to avoid issues
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_subscription_status_check 
    CHECK (subscription_status IN ('ativo', 'inativo', 'trial', 'expirado'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_modalidade_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_modalidade_check 
    CHECK (modalidade IS NULL OR modalidade IN ('ginastica', 'aulas_grupo', 'treino_personalizado'));
  END IF;
END $$;

-- 2. Create athlete_guardians table (EE-Atleta relationship)
-- Athletes who are minors don't have their own account, EE manages everything
CREATE TABLE IF NOT EXISTS public.athlete_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  athlete_name TEXT NOT NULL,
  athlete_birth_date DATE,
  athlete_notes TEXT,
  relationship TEXT NOT NULL,
  modalidade TEXT,
  subscription_status TEXT DEFAULT 'inativo',
  subscription_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT athlete_guardians_relationship_check CHECK (relationship IN ('pai', 'mae', 'tutor', 'outro')),
  CONSTRAINT athlete_guardians_modalidade_check CHECK (modalidade IS NULL OR modalidade IN ('ginastica', 'aulas_grupo', 'treino_personalizado')),
  CONSTRAINT athlete_guardians_subscription_status_check CHECK (subscription_status IN ('ativo', 'inativo', 'trial', 'expirado'))
);

-- 3. Enable RLS on athlete_guardians
ALTER TABLE public.athlete_guardians ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for athlete_guardians
-- Guardians can view their own athletes
CREATE POLICY "Guardians can view their athletes"
ON public.athlete_guardians
FOR SELECT
USING (auth.uid() = guardian_id);

-- Guardians can insert their own athletes
CREATE POLICY "Guardians can insert their athletes"
ON public.athlete_guardians
FOR INSERT
WITH CHECK (auth.uid() = guardian_id);

-- Guardians can update their own athletes
CREATE POLICY "Guardians can update their athletes"
ON public.athlete_guardians
FOR UPDATE
USING (auth.uid() = guardian_id);

-- Guardians can delete their own athletes
CREATE POLICY "Guardians can delete their athletes"
ON public.athlete_guardians
FOR DELETE
USING (auth.uid() = guardian_id);

-- Admins can do everything on athlete_guardians
CREATE POLICY "Admins can view all athletes"
ON public.athlete_guardians
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert athletes"
ON public.athlete_guardians
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all athletes"
ON public.athlete_guardians
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all athletes"
ON public.athlete_guardians
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trainers can view athletes (will be refined when classes table exists)
CREATE POLICY "Trainers can view athletes"
ON public.athlete_guardians
FOR SELECT
USING (public.has_role(auth.uid(), 'treinador'));

-- 5. Trigger for updated_at on athlete_guardians
CREATE TRIGGER update_athlete_guardians_updated_at
BEFORE UPDATE ON public.athlete_guardians
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create helper function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;