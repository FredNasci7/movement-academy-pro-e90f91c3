import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface GuardianAthlete {
  id: string;
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

  // Note: Guardians can no longer create athletes directly - this must be done by admin
  // They can only view their associated athletes

  return {
    athletes,
    isLoading,
    fetchAthletes,
  };
};
