-- Phase 2: Classes and Schedules tables

-- 1. Create classes table (turmas/modalidades)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  modalidade TEXT NOT NULL CHECK (modalidade IN ('ginastica', 'aulas_grupo', 'treino_personalizado')),
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  max_capacity INTEGER DEFAULT 20,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create class_schedules table (horários regulares)
CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for classes
-- Everyone authenticated can view active classes
CREATE POLICY "Anyone can view active classes"
ON public.classes
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can view all classes"
ON public.classes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert classes"
ON public.classes
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update classes"
ON public.classes
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete classes"
ON public.classes
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trainers can view their own classes
CREATE POLICY "Trainers can view their classes"
ON public.classes
FOR SELECT
USING (trainer_id = auth.uid());

-- 5. RLS Policies for class_schedules
-- Everyone authenticated can view schedules of active classes
CREATE POLICY "Anyone can view schedules"
ON public.class_schedules
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classes 
    WHERE classes.id = class_schedules.class_id 
    AND classes.is_active = true
  )
);

-- Admins can do everything
CREATE POLICY "Admins can view all schedules"
ON public.class_schedules
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert schedules"
ON public.class_schedules
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update schedules"
ON public.class_schedules
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete schedules"
ON public.class_schedules
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Triggers for updated_at
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at
BEFORE UPDATE ON public.class_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();