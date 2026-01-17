
-- Phase 2: Migrate existing data from athlete_guardians to athletes
INSERT INTO public.athletes (full_name, birth_date, modalidade, subscription_status, subscription_end_date, notes, created_at, updated_at)
SELECT 
    athlete_name,
    athlete_birth_date,
    modalidade,
    subscription_status,
    subscription_end_date,
    athlete_notes,
    created_at,
    updated_at
FROM public.athlete_guardians;

-- Create mapping table to track old to new IDs
CREATE TABLE public.athlete_migration_map (
    old_id UUID NOT NULL,
    new_id UUID NOT NULL,
    guardian_id UUID,
    relationship TEXT
);

-- Populate mapping (using row_number to match by insertion order since we have unique names/dates)
INSERT INTO public.athlete_migration_map (old_id, new_id, guardian_id, relationship)
SELECT 
    ag.id as old_id,
    a.id as new_id,
    ag.guardian_id,
    ag.relationship
FROM public.athlete_guardians ag
JOIN public.athletes a ON a.full_name = ag.athlete_name 
    AND COALESCE(a.birth_date::text, '') = COALESCE(ag.athlete_birth_date::text, '')
    AND COALESCE(a.modalidade, '') = COALESCE(ag.modalidade, '');

-- Update class_enrollments to use new athlete_id
UPDATE public.class_enrollments ce
SET athlete_id = m.new_id
FROM public.athlete_migration_map m
WHERE ce.athlete_id = m.old_id;
