
-- Step 1: Drop dependent RLS policies
DROP POLICY IF EXISTS "Enrolled users can view their sessions" ON public.class_sessions;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Users can view their own attendance" ON public.class_attendance;

-- Step 2: Drop the old view
DROP VIEW IF EXISTS public.athlete_guardians_trainer_view;

-- Step 3: Drop FK constraint from class_enrollments
ALTER TABLE public.class_enrollments 
DROP CONSTRAINT IF EXISTS class_enrollments_athlete_id_fkey;

-- Step 4: Drop old athlete_guardians table
DROP TABLE public.athlete_guardians;

-- Step 5: Create new athlete_guardians as relationship-only table
CREATE TABLE public.athlete_guardians (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(athlete_id, guardian_id)
);

-- Enable RLS
ALTER TABLE public.athlete_guardians ENABLE ROW LEVEL SECURITY;

-- RLS Policies for athlete_guardians
CREATE POLICY "Admins can manage all guardian relationships"
ON public.athlete_guardians
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Guardians can view their relationships"
ON public.athlete_guardians
FOR SELECT
USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can insert their relationships"
ON public.athlete_guardians
FOR INSERT
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "Guardians can update their relationships"
ON public.athlete_guardians
FOR UPDATE
USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can delete their relationships"
ON public.athlete_guardians
FOR DELETE
USING (guardian_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_athlete_guardians_updated_at
BEFORE UPDATE ON public.athlete_guardians
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Restore guardian relationships from migration map
INSERT INTO public.athlete_guardians (athlete_id, guardian_id, relationship)
SELECT new_id, guardian_id, relationship
FROM public.athlete_migration_map
WHERE guardian_id IS NOT NULL;

-- Step 7: Add guardian policy for athletes table
CREATE POLICY "Guardians can view their associated athletes"
ON public.athletes
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.athlete_guardians ag
        WHERE ag.athlete_id = athletes.id
        AND ag.guardian_id = auth.uid()
    )
);

-- Step 8: Add trainer policy for athletes
CREATE POLICY "Trainers can view athletes in their classes"
ON public.athletes
FOR SELECT
USING (
    has_role(auth.uid(), 'treinador') AND
    EXISTS (
        SELECT 1 FROM class_enrollments ce
        JOIN classes c ON c.id = ce.class_id
        WHERE ce.athlete_id = athletes.id
        AND c.trainer_id = auth.uid()
        AND ce.status = 'active'
    )
);

-- Step 9: Update class_enrollments FK to reference new athletes table
ALTER TABLE public.class_enrollments
ADD CONSTRAINT class_enrollments_athlete_id_fkey
FOREIGN KEY (athlete_id) REFERENCES public.athletes(id) ON DELETE CASCADE;

-- Step 10: Recreate dropped policies with new structure
-- Users can view their own enrollments (direct or via guardian)
CREATE POLICY "Users can view their own enrollments"
ON public.class_enrollments
FOR SELECT
USING (
    (profile_id = auth.uid()) OR 
    (EXISTS (
        SELECT 1 FROM public.athlete_guardians ag
        WHERE ag.athlete_id = class_enrollments.athlete_id
        AND ag.guardian_id = auth.uid()
    ))
);

-- Users can view their own attendance
CREATE POLICY "Users can view their own attendance"
ON public.class_attendance
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments e
        WHERE e.id = class_attendance.enrollment_id 
        AND (
            e.profile_id = auth.uid() OR 
            EXISTS (
                SELECT 1 FROM public.athlete_guardians ag
                WHERE ag.athlete_id = e.athlete_id
                AND ag.guardian_id = auth.uid()
            )
        )
    )
);

-- Enrolled users can view their sessions
CREATE POLICY "Enrolled users can view their sessions"
ON public.class_sessions
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments e
        WHERE e.class_id = class_sessions.class_id
        AND e.status = 'active'
        AND (
            e.profile_id = auth.uid() OR 
            EXISTS (
                SELECT 1 FROM public.athlete_guardians ag
                WHERE ag.athlete_id = e.athlete_id
                AND ag.guardian_id = auth.uid()
            )
        )
    )
);

-- Step 11: Drop the migration map table
DROP TABLE public.athlete_migration_map;

-- Step 12: Create view for trainers to see athletes (limited info)
CREATE OR REPLACE VIEW public.athletes_trainer_view
WITH (security_invoker = on)
AS
SELECT 
    a.id,
    a.full_name,
    DATE_PART('year', AGE(a.birth_date))::integer as athlete_age,
    a.modalidade,
    a.subscription_status,
    a.created_at,
    a.updated_at
FROM public.athletes a
WHERE EXISTS (
    SELECT 1 FROM class_enrollments ce
    JOIN classes c ON c.id = ce.class_id
    WHERE ce.athlete_id = a.id
    AND c.trainer_id = auth.uid()
    AND ce.status = 'active'
);
