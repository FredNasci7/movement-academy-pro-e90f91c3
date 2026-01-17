import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Athlete {
  id: string;
  full_name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  modalidade: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
  notes: string | null;
  profile_id: string | null;
  created_at: string;
  updated_at: string;
  guardians?: {
    id: string;
    guardian_id: string;
    relationship: string;
    guardian_name: string | null;
  }[];
}

export interface AthleteInsert {
  full_name: string;
  birth_date?: string | null;
  phone?: string | null;
  email?: string | null;
  modalidade?: string | null;
  subscription_status?: string | null;
  subscription_end_date?: string | null;
  notes?: string | null;
  profile_id?: string | null;
}

export interface AthleteUpdate {
  full_name?: string;
  birth_date?: string | null;
  phone?: string | null;
  email?: string | null;
  modalidade?: string | null;
  subscription_status?: string | null;
  subscription_end_date?: string | null;
  notes?: string | null;
  profile_id?: string | null;
}

export const useAdminAthletes = () => {
  const { toast } = useToast();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAthletes = async () => {
    try {
      const { data, error } = await supabase
        .from("athletes")
        .select(`
          *,
          guardians:athlete_guardians(
            id,
            guardian_id,
            relationship,
            guardian:profiles(full_name)
          )
        `)
        .order("full_name");

      if (error) throw error;

      // Transform the data to flatten guardian names
      const transformedData = (data || []).map((athlete) => ({
        ...athlete,
        guardians: (athlete.guardians || []).map((g: any) => ({
          id: g.id,
          guardian_id: g.guardian_id,
          relationship: g.relationship,
          guardian_name: g.guardian?.full_name || null,
        })),
      }));

      setAthletes(transformedData);
    } catch (error) {
      console.error("Error fetching athletes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os atletas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const addAthlete = async (data: AthleteInsert) => {
    try {
      const { data: newAthlete, error } = await supabase
        .from("athletes")
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      await fetchAthletes();
      toast({
        title: "Sucesso!",
        description: "Atleta adicionado",
      });
      return newAthlete;
    } catch (error: any) {
      console.error("Error adding athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o atleta",
      });
      return null;
    }
  };

  const updateAthlete = async (id: string, updates: AthleteUpdate) => {
    try {
      const { error } = await supabase
        .from("athletes")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setAthletes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
      toast({
        title: "Guardado!",
        description: "Dados do atleta atualizados",
      });
      return true;
    } catch (error) {
      console.error("Error updating athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o atleta",
      });
      return false;
    }
  };

  const deleteAthlete = async (id: string) => {
    try {
      const { error } = await supabase.from("athletes").delete().eq("id", id);

      if (error) throw error;

      setAthletes((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Removido",
        description: "Atleta eliminado",
      });
      return true;
    } catch (error) {
      console.error("Error deleting athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível eliminar o atleta",
      });
      return false;
    }
  };

  const addGuardian = async (
    athleteId: string,
    guardianId: string,
    relationship: string
  ) => {
    try {
      const { error } = await supabase.from("athlete_guardians").insert({
        athlete_id: athleteId,
        guardian_id: guardianId,
        relationship,
      });

      if (error) throw error;

      await fetchAthletes();
      toast({
        title: "Sucesso!",
        description: "Encarregado associado ao atleta",
      });
      return true;
    } catch (error: any) {
      console.error("Error adding guardian:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível associar o encarregado",
      });
      return false;
    }
  };

  const removeGuardian = async (relationshipId: string) => {
    try {
      const { error } = await supabase
        .from("athlete_guardians")
        .delete()
        .eq("id", relationshipId);

      if (error) throw error;

      await fetchAthletes();
      toast({
        title: "Removido",
        description: "Associação removida",
      });
      return true;
    } catch (error) {
      console.error("Error removing guardian:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a associação",
      });
      return false;
    }
  };

  return {
    athletes,
    isLoading,
    fetchAthletes,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    addGuardian,
    removeGuardian,
  };
};
