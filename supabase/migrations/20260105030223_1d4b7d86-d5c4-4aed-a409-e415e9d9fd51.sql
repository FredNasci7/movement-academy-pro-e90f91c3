-- Create class_sessions table (individual class occurrences)
CREATE TABLE public.class_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.class_schedules(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_session_status CHECK (status IN ('scheduled', 'completed', 'cancelled'))
);

-- Create class_enrollments table (athlete enrollments in classes)
CREATE TABLE public.class_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athlete_guardians(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_enrollment_status CHECK (status IN ('active', 'inactive', 'suspended')),
  CONSTRAINT athlete_or_profile CHECK (athlete_id IS NOT NULL OR profile_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for class_sessions
CREATE POLICY "Admins can manage all sessions"
ON public.class_sessions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Trainers can view sessions for their classes"
ON public.class_sessions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.classes 
  WHERE classes.id = class_sessions.class_id 
  AND classes.trainer_id = auth.uid()
));

CREATE POLICY "Enrolled users can view their sessions"
ON public.class_sessions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.class_enrollments e
  WHERE e.class_id = class_sessions.class_id
  AND e.status = 'active'
  AND (e.profile_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.athlete_guardians ag 
    WHERE ag.id = e.athlete_id AND ag.guardian_id = auth.uid()
  ))
));

-- RLS policies for class_enrollments
CREATE POLICY "Admins can manage all enrollments"
ON public.class_enrollments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Trainers can view enrollments for their classes"
ON public.class_enrollments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.classes 
  WHERE classes.id = class_enrollments.class_id 
  AND classes.trainer_id = auth.uid()
));

CREATE POLICY "Users can view their own enrollments"
ON public.class_enrollments FOR SELECT
USING (
  profile_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.athlete_guardians ag 
    WHERE ag.id = class_enrollments.athlete_id AND ag.guardian_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_class_sessions_updated_at
  BEFORE UPDATE ON public.class_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_enrollments_updated_at
  BEFORE UPDATE ON public.class_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_class_sessions_class_id ON public.class_sessions(class_id);
CREATE INDEX idx_class_sessions_session_date ON public.class_sessions(session_date);
CREATE INDEX idx_class_enrollments_class_id ON public.class_enrollments(class_id);
CREATE INDEX idx_class_enrollments_athlete_id ON public.class_enrollments(athlete_id);
CREATE INDEX idx_class_enrollments_profile_id ON public.class_enrollments(profile_id);