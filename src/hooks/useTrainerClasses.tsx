import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TrainerClass {
  id: string;
  name: string;
  modalidade: string;
  description: string | null;
  max_capacity: number | null;
  is_active: boolean | null;
  schedules: {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    location: string | null;
  }[];
  enrollmentCount: number;
}

export const useTrainerClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<TrainerClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClasses([]);
      setIsLoading(false);
      return;
    }

    const fetchTrainerClasses = async () => {
      setIsLoading(true);
      try {
        // Fetch classes where user is trainer
        const { data: classesData, error: classesError } = await supabase
          .from("classes")
          .select(`
            id,
            name,
            modalidade,
            description,
            max_capacity,
            is_active,
            class_schedules (
              id,
              day_of_week,
              start_time,
              end_time,
              location
            )
          `)
          .eq("trainer_id", user.id)
          .eq("is_active", true);

        if (classesError) throw classesError;

        // Fetch enrollment counts for each class
        const classesWithCounts = await Promise.all(
          (classesData || []).map(async (cls) => {
            const { count } = await supabase
              .from("class_enrollments")
              .select("*", { count: "exact", head: true })
              .eq("class_id", cls.id)
              .eq("status", "active");

            return {
              ...cls,
              schedules: cls.class_schedules || [],
              enrollmentCount: count || 0,
            };
          })
        );

        setClasses(classesWithCounts);
      } catch (error) {
        console.error("Error fetching trainer classes:", error);
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerClasses();
  }, [user]);

  return { classes, isLoading };
};
