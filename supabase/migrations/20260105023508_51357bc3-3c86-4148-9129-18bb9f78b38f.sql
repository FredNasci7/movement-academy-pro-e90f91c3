-- Remove unused emergency contact columns from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS emergency_contact;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS emergency_phone;