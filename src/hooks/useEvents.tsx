import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type EventVisibility = Database["public"]["Enums"]["event_visibility"];
export type EventType = Database["public"]["Enums"]["event_type"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_datetime: string;
  end_datetime: string | null;
  event_type: EventType;
  visibility: EventVisibility;
  target_roles: AppRole[] | null;
  location: string | null;
  color: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime?: string;
  event_type: EventType;
  visibility: EventVisibility;
  target_roles?: AppRole[];
  location?: string;
  color?: string;
}

export const useEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_datetime", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos.",
          variant: "destructive",
        });
        return;
      }

      setEvents((data as CalendarEvent[]) || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Tens de estar autenticado para criar eventos.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const insertData = {
        title: eventData.title,
        description: eventData.description,
        start_datetime: eventData.start_datetime,
        end_datetime: eventData.end_datetime,
        event_type: eventData.event_type,
        visibility: eventData.visibility,
        target_roles: eventData.target_roles,
        location: eventData.location,
        color: eventData.color,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from("events")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating event:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o evento.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!",
      });

      await fetchEvents();
      return data as CalendarEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<CreateEventData>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.start_datetime !== undefined) updateData.start_datetime = eventData.start_datetime;
      if (eventData.end_datetime !== undefined) updateData.end_datetime = eventData.end_datetime;
      if (eventData.event_type !== undefined) updateData.event_type = eventData.event_type;
      if (eventData.visibility !== undefined) updateData.visibility = eventData.visibility;
      if (eventData.target_roles !== undefined) updateData.target_roles = eventData.target_roles;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.color !== undefined) updateData.color = eventData.color;

      const { error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Error updating event:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o evento.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!",
      });

      await fetchEvents();
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Erro",
          description: "Não foi possível eliminar o evento.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Evento eliminado com sucesso!",
      });

      await fetchEvents();
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return {
    events,
    isLoading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

export const eventTypeLabels: Record<EventType, string> = {
  competition: "Competição",
  practice: "Treino",
  schedule: "Horário",
  meeting: "Reunião",
  other: "Outro",
};

export const eventTypeColors: Record<EventType, string> = {
  competition: "#EF4444",
  practice: "#22C55E",
  schedule: "#3B82F6",
  meeting: "#F59E0B",
  other: "#8B5CF6",
};

export const visibilityLabels: Record<EventVisibility, string> = {
  public: "Público",
  trainers_only: "Apenas Treinadores",
  athletes_only: "Apenas Atletas",
  members_only: "Apenas Membros",
  private: "Privado (Roles específicas)",
};
