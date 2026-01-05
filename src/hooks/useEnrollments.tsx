import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Enrollment {
  id: string;
  class_id: string;
  athlete_id: string | null;
  profile_id: string | null;
  status: string;
  enrolled_at: string;
  class: {
    id: string;
    name: string;
    modalidade: string;
    description: string | null;
    trainer: { full_name: string | null } | null;
    schedules: {
      id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      location: string | null;
    }[];
  };
  athlete?: { athlete_name: string } | null;
}

export const useEnrollments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnrollments = async () => {
    if (!user) {
      setEnrollments([]);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch enrollments for the user's profile
      const { data: profileEnrollments, error: profileError } = await supabase
        .from("class_enrollments")
        .select(`
          id,
          class_id,
          athlete_id,
          profile_id,
          status,
          enrolled_at,
          class:classes(
            id,
            name,
            modalidade,
            description,
            trainer:profiles!classes_trainer_id_fkey(full_name),
            schedules:class_schedules(id, day_of_week, start_time, end_time, location)
          )
        `)
        .eq("profile_id", user.id)
        .eq("status", "active");

      if (profileError) throw profileError;

      // Fetch enrollments for athletes the user is guardian of
      const { data: athleteEnrollments, error: athleteError } = await supabase
        .from("class_enrollments")
        .select(`
          id,
          class_id,
          athlete_id,
          profile_id,
          status,
          enrolled_at,
          class:classes(
            id,
            name,
            modalidade,
            description,
            trainer:profiles!classes_trainer_id_fkey(full_name),
            schedules:class_schedules(id, day_of_week, start_time, end_time, location)
          ),
          athlete:athlete_guardians(athlete_name)
        `)
        .eq("status", "active")
        .not("athlete_id", "is", null);

      if (athleteError) throw athleteError;

      // Combine and deduplicate
      const allEnrollments = [...(profileEnrollments || []), ...(athleteEnrollments || [])];
      const uniqueEnrollments = allEnrollments.filter(
        (enrollment, index, self) =>
          index === self.findIndex((e) => e.id === enrollment.id)
      );

      setEnrollments(uniqueEnrollments as Enrollment[]);
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
  }, [user]);

  return {
    enrollments,
    isLoading,
    fetchEnrollments,
  };
};
