-- Phase 1A: Add new values to app_role enum
-- These must be committed before they can be used in constraints

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'treinador';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'atleta';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'encarregado';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'visitante';