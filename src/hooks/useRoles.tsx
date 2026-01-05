import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export const useRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching roles:", error);
          setRoles([]);
        } else {
          setRoles(data?.map((r) => r.role) || []);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [user]);

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (checkRoles: AppRole[]): boolean => {
    return checkRoles.some((role) => roles.includes(role));
  };

  const isAdmin = roles.includes("admin");
  const isTreinador = roles.includes("treinador");
  const isAtleta = roles.includes("atleta");
  const isEncarregado = roles.includes("encarregado");
  const isVisitante = roles.includes("visitante") || roles.length === 0;

  return {
    roles,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isTreinador,
    isAtleta,
    isEncarregado,
    isVisitante,
  };
};
