import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminEnrollment {
  id: string;
  class_id: string;
  athlete_id: string | null;
  profile_id: string | null;
  status: string;
  enrolled_at: string;
  class: { id: string; name: string; modalidade: string } | null;
  athlete: { id: string; full_name: string } | null;
  profile: { id: string; full_name: string | null } | null;
}

export const useAdminEnrollments = () => {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from("class_enrollments")
        .select(`
          id,
          class_id,
          athlete_id,
          profile_id,
          status,
          enrolled_at,
          class:classes(id, name, modalidade),
          athlete:athletes(id, full_name),
          profile:profiles(id, full_name)
        `)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;
      setEnrollments((data || []) as AdminEnrollment[]);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as inscrições",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const addEnrollment = async (data: {
    class_id: string;
    athlete_id?: string;
    profile_id?: string;
  }) => {
    try {
      const { error } = await supabase.from("class_enrollments").insert({
        class_id: data.class_id,
        athlete_id: data.athlete_id || null,
        profile_id: data.profile_id || null,
        status: "active",
      });

      if (error) throw error;

      await fetchEnrollments();
      toast({
        title: "Sucesso!",
        description: "Inscrição adicionada",
      });
      return true;
    } catch (error: any) {
      console.error("Error adding enrollment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar a inscrição",
      });
      return false;
    }
  };

  const updateEnrollmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("class_enrollments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      toast({
        title: "Atualizado",
        description: "Estado da inscrição atualizado",
      });
      return true;
    } catch (error) {
      console.error("Error updating enrollment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a inscrição",
      });
      return false;
    }
  };

  const deleteEnrollment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("class_enrollments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      toast({
        title: "Removido",
        description: "Inscrição eliminada",
      });
      return true;
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível eliminar a inscrição",
      });
      return false;
    }
  };

  return {
    enrollments,
    isLoading,
    fetchEnrollments,
    addEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment,
  };
};
