import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AthleteGuardian = Database["public"]["Tables"]["athlete_guardians"]["Row"];
type AthleteGuardianInsert = Database["public"]["Tables"]["athlete_guardians"]["Insert"];
type AthleteGuardianUpdate = Database["public"]["Tables"]["athlete_guardians"]["Update"];

export const useAthleteGuardians = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [athletes, setAthletes] = useState<AthleteGuardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAthletes = async () => {
    if (!user) {
      setAthletes([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("athlete_guardians")
        .select("*")
        .eq("guardian_id", user.id)
        .order("athlete_name");

      if (error) throw error;
      setAthletes(data || []);
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
  }, [user]);

  const addAthlete = async (athlete: Omit<AthleteGuardianInsert, "guardian_id">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("athlete_guardians")
        .insert({
          ...athlete,
          guardian_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setAthletes((prev) => [...prev, data]);
      toast({
        title: "Sucesso!",
        description: "Atleta adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Error adding athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o atleta",
      });
      return null;
    }
  };

  const updateAthlete = async (id: string, updates: AthleteGuardianUpdate) => {
    try {
      const { data, error } = await supabase
        .from("athlete_guardians")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setAthletes((prev) =>
        prev.map((a) => (a.id === id ? data : a))
      );
      toast({
        title: "Guardado!",
        description: "Dados do atleta atualizados",
      });
      return data;
    } catch (error) {
      console.error("Error updating athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o atleta",
      });
      return null;
    }
  };

  const deleteAthlete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("athlete_guardians")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAthletes((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Removido",
        description: "Atleta removido com sucesso",
      });
      return true;
    } catch (error) {
      console.error("Error deleting athlete:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o atleta",
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
  };
};
