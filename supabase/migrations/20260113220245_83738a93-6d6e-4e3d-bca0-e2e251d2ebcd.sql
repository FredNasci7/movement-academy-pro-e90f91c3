-- Drop the overly permissive trainer policy
DROP POLICY IF EXISTS "Trainers can view athletes" ON public.athlete_guardians;

-- Create a restricted policy that only allows trainers to see athletes enrolled in their classes
CREATE POLICY "Trainers can view their enrolled athletes"
ON public.athlete_guardians
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM class_enrollments ce
    JOIN classes c ON c.id = ce.class_id
    WHERE ce.athlete_id = athlete_guardians.id
      AND c.trainer_id = auth.uid()
      AND ce.status = 'active'
  )
);