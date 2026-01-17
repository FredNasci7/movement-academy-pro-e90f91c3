import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface GuardianAthlete {
  id: string; // athlete_guardians.id
  athlete_id: string;
  relationship: string;
  athlete: {
    id: string;
    full_name: string;
    birth_date: string | null;
    modalidade: string | null;
    subscription_status: string | null;
    notes: string | null;
  };
}

export interface AddAthleteData {
  full_name: string;
  birth_date: string | null;
  notes: string | null;
  relationship: string;
  modalidade: string | null;
}

export interface UpdateAthleteData {
  full_name?: string;
  birth_date?: string | null;
  notes?: string | null;
  modalidade?: string | null;
  relationship?: string;
}

export const useAthleteGuardians = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [athletes, setAthletes] = useState<GuardianAthlete[]>([]);
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
        .select(`
          id,
          athlete_id,
          relationship,
          athlete:athletes(
            id,
            full_name,
            birth_date,
            modalidade,
            subscription_status,
            notes
          )
        `)
        .eq("guardian_id", user.id);

      if (error) throw error;

      // Transform data to flatten athlete info
      const transformedData = (data || [])
        .filter((item: any) => item.athlete) // Filter out items without athlete
        .map((item: any) => ({
          id: item.id,
          athlete_id: item.athlete_id,
          relationship: item.relationship,
          athlete: item.athlete,
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
  }, [user]);

  const addAthlete = async (data: AddAthleteData): Promise<GuardianAthlete | null> => {
    if (!user) return null;

    try {
      // First create the athlete
      const { data: athleteData, error: athleteError } = await supabase
        .from("athletes")
        .insert({
          full_name: data.full_name,
          birth_date: data.birth_date,
          notes: data.notes,
          modalidade: data.modalidade,
        })
        .select()
        .single();

      if (athleteError) throw athleteError;

      // Then create the guardian relationship
      const { data: relationData, error: relationError } = await supabase
        .from("athlete_guardians")
        .insert({
          athlete_id: athleteData.id,
          guardian_id: user.id,
          relationship: data.relationship,
        })
        .select()
        .single();

      if (relationError) throw relationError;

      const newAthlete: GuardianAthlete = {
        id: relationData.id,
        athlete_id: athleteData.id,
        relationship: relationData.relationship,
        athlete: {
          id: athleteData.id,
          full_name: athleteData.full_name,
          birth_date: athleteData.birth_date,
          modalidade: athleteData.modalidade,
          subscription_status: athleteData.subscription_status,
          notes: athleteData.notes,
        },
      };

      setAthletes((prev) => [...prev, newAthlete]);

      toast({
        title: "Atleta adicionado",
        description: `${data.full_name} foi adicionado com sucesso`,
      });

      return newAthlete;
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

  const updateAthlete = async (
    guardianRelationId: string,
    updates: UpdateAthleteData
  ): Promise<GuardianAthlete | null> => {
    if (!user) return null;

    try {
      // Find the current relation to get athlete_id
      const currentRelation = athletes.find((a) => a.id === guardianRelationId);
      if (!currentRelation) return null;

      // Separate relationship update from athlete update
      const { relationship, ...athleteUpdates } = updates;

      // Update athlete data if there are athlete-specific updates
      if (Object.keys(athleteUpdates).length > 0) {
        const { error: athleteError } = await supabase
          .from("athletes")
          .update(athleteUpdates)
          .eq("id", currentRelation.athlete_id);

        if (athleteError) throw athleteError;
      }

      // Update relationship if provided
      if (relationship) {
        const { error: relationError } = await supabase
          .from("athlete_guardians")
          .update({ relationship })
          .eq("id", guardianRelationId);

        if (relationError) throw relationError;
      }

      // Update local state
      const updatedAthlete: GuardianAthlete = {
        ...currentRelation,
        relationship: relationship || currentRelation.relationship,
        athlete: {
          ...currentRelation.athlete,
          ...athleteUpdates,
        },
      };

      setAthletes((prev) =>
        prev.map((a) => (a.id === guardianRelationId ? updatedAthlete : a))
      );

      toast({
        title: "Atleta atualizado",
        description: "As alterações foram guardadas",
      });

      return updatedAthlete;
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

  const deleteAthlete = async (guardianRelationId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Find the relation to get athlete_id
      const relation = athletes.find((a) => a.id === guardianRelationId);
      if (!relation) return false;

      // Delete the guardian relationship first
      const { error: relationError } = await supabase
        .from("athlete_guardians")
        .delete()
        .eq("id", guardianRelationId);

      if (relationError) throw relationError;

      // Then delete the athlete (only if this was the last guardian)
      // For now, we just delete the relationship - admin can clean up orphaned athletes
      
      setAthletes((prev) => prev.filter((a) => a.id !== guardianRelationId));

      toast({
        title: "Atleta removido",
        description: "O atleta foi removido da sua lista",
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
