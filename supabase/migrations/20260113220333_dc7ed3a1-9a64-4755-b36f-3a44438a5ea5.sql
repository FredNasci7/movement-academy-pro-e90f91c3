-- Add a policy for trainers to view profiles of users enrolled in their classes
CREATE POLICY "Trainers can view enrolled user profiles"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'treinador'::app_role) AND
  EXISTS (
    SELECT 1
    FROM class_enrollments ce
    JOIN classes c ON c.id = ce.class_id
    WHERE ce.profile_id = profiles.id
      AND c.trainer_id = auth.uid()
      AND ce.status = 'active'
  )
);