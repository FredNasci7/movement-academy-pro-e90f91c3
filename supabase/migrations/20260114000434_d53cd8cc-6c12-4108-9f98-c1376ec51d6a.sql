-- Phase 1: Fix Critical View Security Issues
-- Drop existing insecure views
DROP VIEW IF EXISTS public.profiles_trainer_view;
DROP VIEW IF EXISTS public.athlete_guardians_trainer_view;

-- Create secure profiles_trainer_view with proper filtering
-- Only shows profiles of students enrolled in the trainer's classes
CREATE VIEW public.profiles_trainer_view
WITH (security_invoker=on) AS
SELECT DISTINCT
  p.id,
  p.full_name,
  p.modalidade,
  p.subscription_status,
  p.created_at,
  p.updated_at
FROM profiles p
INNER JOIN class_enrollments ce ON ce.profile_id = p.id
INNER JOIN classes c ON c.id = ce.class_id
WHERE c.trainer_id = auth.uid()
  AND ce.status = 'active';

-- Create secure athlete_guardians_trainer_view with proper filtering
-- Only shows athletes enrolled in the trainer's classes
-- Hides sensitive data (birth_date shows only age, no notes or guardian info)
CREATE VIEW public.athlete_guardians_trainer_view
WITH (security_invoker=on) AS
SELECT DISTINCT
  ag.id,
  ag.athlete_name,
  ag.modalidade,
  ag.subscription_status,
  CASE
    WHEN ag.athlete_birth_date IS NOT NULL 
    THEN EXTRACT(year FROM age(CURRENT_DATE, ag.athlete_birth_date))::integer
    ELSE NULL
  END AS athlete_age,
  ag.created_at,
  ag.updated_at
FROM athlete_guardians ag
INNER JOIN class_enrollments ce ON ce.athlete_id = ag.id
INNER JOIN classes c ON c.id = ce.class_id
WHERE c.trainer_id = auth.uid()
  AND ce.status = 'active';