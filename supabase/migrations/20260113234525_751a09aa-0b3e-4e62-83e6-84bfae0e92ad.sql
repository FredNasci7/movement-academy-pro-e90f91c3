-- Create a secure view for trainers that excludes sensitive PII (phone, birth_date, notes)
CREATE VIEW public.profiles_trainer_view
WITH (security_invoker=on) AS
SELECT
  id,
  full_name,
  modalidade,
  subscription_status,
  created_at,
  updated_at
FROM public.profiles;

-- Create a secure view for trainers to see athletes with age instead of birth_date
CREATE VIEW public.athlete_guardians_trainer_view
WITH (security_invoker=on) AS
SELECT
  id,
  athlete_name,
  modalidade,
  subscription_status,
  -- Calculate age instead of showing exact birth date
  CASE
    WHEN athlete_birth_date IS NOT NULL
    THEN EXTRACT(YEAR FROM age(CURRENT_DATE, athlete_birth_date))::integer
    ELSE NULL
  END as athlete_age,
  created_at,
  updated_at
FROM public.athlete_guardians;

-- Drop the trainer policy on profiles table that exposes all columns
DROP POLICY IF EXISTS "Trainers can view enrolled user profiles" ON public.profiles;

-- Drop the trainer policy on athlete_guardians that exposes birth dates
DROP POLICY IF EXISTS "Trainers can view their enrolled athletes" ON public.athlete_guardians;