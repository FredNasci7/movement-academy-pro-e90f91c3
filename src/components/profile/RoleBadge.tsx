import { Badge } from "@/components/ui/badge";
import { Shield, GraduationCap, Users, UserCheck, User } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleBadgeProps {
  role: AppRole;
}

const roleConfig: Record<AppRole, { label: string; icon: React.ReactNode; className: string }> = {
  admin: {
    label: "Administrador",
    icon: <Shield className="h-3 w-3" />,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  treinador: {
    label: "Treinador",
    icon: <GraduationCap className="h-3 w-3" />,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  atleta: {
    label: "Atleta",
    icon: <UserCheck className="h-3 w-3" />,
    className: "bg-green-500/10 text-green-600 border-green-500/30",
  },
  encarregado: {
    label: "Encarregado de Educação",
    icon: <Users className="h-3 w-3" />,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  visitante: {
    label: "Visitante",
    icon: <User className="h-3 w-3" />,
    className: "bg-muted text-muted-foreground border-border",
  },
  user: {
    label: "Utilizador",
    icon: <User className="h-3 w-3" />,
    className: "bg-muted text-muted-foreground border-border",
  },
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = roleConfig[role];
  
  return (
    <Badge variant="outline" className={`${config.className} gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
