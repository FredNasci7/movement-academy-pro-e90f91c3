import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Class = Database["public"]["Tables"]["classes"]["Row"];
type ClassInsert = Database["public"]["Tables"]["classes"]["Insert"];
type ClassUpdate = Database["public"]["Tables"]["classes"]["Update"];
type ClassSchedule = Database["public"]["Tables"]["class_schedules"]["Row"];
type ClassScheduleInsert = Database["public"]["Tables"]["class_schedules"]["Insert"];

export interface ClassWithSchedules extends Class {
  schedules: ClassSchedule[];
  trainer?: { id: string; full_name: string | null } | null;
}

export const useClasses = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassWithSchedules[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select(`
          *,
          trainer:profiles!classes_trainer_id_fkey(id, full_name),
          schedules:class_schedules(*)
        `)
        .order("name");

      if (classesError) throw classesError;

      setClasses(classesData || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as turmas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const addClass = async (classData: ClassInsert) => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .insert(classData)
        .select()
        .single();

      if (error) throw error;

      await fetchClasses();
      toast({
        title: "Sucesso!",
        description: "Turma criada com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Error adding class:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a turma",
      });
      return null;
    }
  };

  const updateClass = async (id: string, updates: ClassUpdate) => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await fetchClasses();
      toast({
        title: "Guardado!",
        description: "Turma atualizada com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Error updating class:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a turma",
      });
      return null;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setClasses((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Removido",
        description: "Turma eliminada com sucesso",
      });
      return true;
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível eliminar a turma",
      });
      return false;
    }
  };

  const addSchedule = async (schedule: ClassScheduleInsert) => {
    try {
      const { error } = await supabase
        .from("class_schedules")
        .insert(schedule);

      if (error) throw error;

      await fetchClasses();
      toast({
        title: "Sucesso!",
        description: "Horário adicionado",
      });
      return true;
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o horário",
      });
      return false;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from("class_schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchClasses();
      toast({
        title: "Removido",
        description: "Horário eliminado",
      });
      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível eliminar o horário",
      });
      return false;
    }
  };

  return {
    classes,
    isLoading,
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
    addSchedule,
    deleteSchedule,
  };
};
