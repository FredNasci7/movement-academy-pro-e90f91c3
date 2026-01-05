-- Create class_attendance table for tracking student attendance
CREATE TABLE public.class_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.class_enrollments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'presente' CHECK (status IN ('presente', 'ausente', 'justificado')),
  notes TEXT,
  marked_by UUID REFERENCES public.profiles(id),
  marked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, enrollment_id)
);

-- Enable RLS
ALTER TABLE public.class_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all attendance"
ON public.class_attendance
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Trainers can manage attendance for their classes"
ON public.class_attendance
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.class_sessions cs
    JOIN public.classes c ON c.id = cs.class_id
    WHERE cs.id = class_attendance.session_id
    AND c.trainer_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own attendance"
ON public.class_attendance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.class_enrollments e
    WHERE e.id = class_attendance.enrollment_id
    AND (
      e.profile_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.athlete_guardians ag
        WHERE ag.id = e.athlete_id
        AND ag.guardian_id = auth.uid()
      )
    )
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_class_attendance_updated_at
BEFORE UPDATE ON public.class_attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();