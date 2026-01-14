-- Create enum for event visibility
CREATE TYPE public.event_visibility AS ENUM ('public', 'trainers_only', 'athletes_only', 'members_only', 'private');

-- Create enum for event types
CREATE TYPE public.event_type AS ENUM ('competition', 'practice', 'schedule', 'meeting', 'other');

-- Create events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE,
    event_type event_type NOT NULL DEFAULT 'other',
    visibility event_visibility NOT NULL DEFAULT 'public',
    target_roles app_role[] DEFAULT NULL,
    location TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Admins can manage all events
CREATE POLICY "Admins can manage all events"
    ON public.events
    FOR ALL
    USING (has_role(auth.uid(), 'admin'));

-- Public events are readable by everyone (including anonymous)
CREATE POLICY "Public events are readable by everyone"
    ON public.events
    FOR SELECT
    USING (visibility = 'public');

-- Trainers can see trainers_only events
CREATE POLICY "Trainers can see trainers_only events"
    ON public.events
    FOR SELECT
    USING (
        visibility = 'trainers_only' 
        AND has_role(auth.uid(), 'treinador')
    );

-- Athletes can see athletes_only events
CREATE POLICY "Athletes can see athletes_only events"
    ON public.events
    FOR SELECT
    USING (
        visibility = 'athletes_only' 
        AND (has_role(auth.uid(), 'atleta') OR has_role(auth.uid(), 'treinador'))
    );

-- Members (any authenticated with a role) can see members_only events
CREATE POLICY "Members can see members_only events"
    ON public.events
    FOR SELECT
    USING (
        visibility = 'members_only' 
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Private events visible only to users with matching roles
CREATE POLICY "Private events visible to target roles"
    ON public.events
    FOR SELECT
    USING (
        visibility = 'private' 
        AND target_roles IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = ANY(target_roles)
        )
    );

-- Trainers can insert events (their own)
CREATE POLICY "Trainers can insert events"
    ON public.events
    FOR INSERT
    WITH CHECK (
        has_role(auth.uid(), 'treinador') 
        AND created_by = auth.uid()
    );

-- Trainers can update their own events
CREATE POLICY "Trainers can update own events"
    ON public.events
    FOR UPDATE
    USING (
        has_role(auth.uid(), 'treinador') 
        AND created_by = auth.uid()
    );

-- Trainers can delete their own events
CREATE POLICY "Trainers can delete own events"
    ON public.events
    FOR DELETE
    USING (
        has_role(auth.uid(), 'treinador') 
        AND created_by = auth.uid()
    );