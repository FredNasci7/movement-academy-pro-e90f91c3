import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Trainer {
  id: string;
  full_name: string | null;
}

export const useTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        // Get all users with trainer role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "treinador");

        if (roleError) throw roleError;

        if (roleData && roleData.length > 0) {
          const trainerIds = roleData.map((r) => r.user_id);
          
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", trainerIds);

          if (profileError) throw profileError;
          setTrainers(profileData || []);
        } else {
          setTrainers([]);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setTrainers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return { trainers, isLoading };
};
