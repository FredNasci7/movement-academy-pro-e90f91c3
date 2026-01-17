import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Calendar, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AthleteWithClasses {
  id: string;
  name: string;
  modalidade: string | null;
  subscriptionStatus: string | null;
  classes: {
    id: string;
    name: string;
    schedules: {
      day_of_week: number;
      start_time: string;
      end_time: string;
      location: string | null;
    }[];
  }[];
}

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const GuardianDashboard = () => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState<AthleteWithClasses[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAthletes = async () => {
      setIsLoading(true);
      try {
        // Get athletes under this guardian - now using the new structure
        const { data: guardianRelations, error: relationsError } = await supabase
          .from("athlete_guardians")
          .select(`
            athlete_id,
            athlete:athletes(
              id,
              full_name,
              modalidade,
              subscription_status
            )
          `)
          .eq("guardian_id", user.id);

        if (relationsError) throw relationsError;

        // For each athlete, get their class enrollments
        const athletesWithClasses: AthleteWithClasses[] = await Promise.all(
          (guardianRelations || [])
            .filter((rel: any) => rel.athlete)
            .map(async (relation: any) => {
              const athlete = relation.athlete;
              
              const { data: enrollments } = await supabase
                .from("class_enrollments")
                .select(`
                  class_id,
                  classes (
                    id,
                    name,
                    class_schedules (
                      day_of_week,
                      start_time,
                      end_time,
                      location
                    )
                  )
                `)
                .eq("athlete_id", athlete.id)
                .eq("status", "active");

              const classes = (enrollments || [])
                .filter((e: any) => e.classes)
                .map((e: any) => ({
                  id: e.classes!.id,
                  name: e.classes!.name,
                  schedules: e.classes!.class_schedules || [],
                }));

              return {
                id: athlete.id,
                name: athlete.full_name,
                modalidade: athlete.modalidade,
                subscriptionStatus: athlete.subscription_status,
                classes,
              };
            })
        );

        setAthletes(athletesWithClasses);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletes();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Os Meus Atletas</h2>
        <p className="text-muted-foreground">
          {athletes.length} atleta{athletes.length !== 1 ? "s" : ""} ao seu encargo
        </p>
      </div>

      {athletes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Ainda não tem atletas associados. Contacte a administração para associar atletas à sua conta.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {athletes.map((athlete) => (
            <Card key={athlete.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{athlete.name}</CardTitle>
                    {athlete.modalidade && (
                      <CardDescription>{athlete.modalidade}</CardDescription>
                    )}
                  </div>
                  <Badge
                    variant={athlete.subscriptionStatus === "ativo" ? "default" : "secondary"}
                  >
                    {athlete.subscriptionStatus || "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {athlete.classes.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Turmas inscritas:</p>
                    {athlete.classes.map((cls) => (
                      <div key={cls.id} className="bg-muted/50 rounded-lg p-3">
                        <p className="font-medium text-sm mb-2">{cls.name}</p>
                        {cls.schedules.map((schedule, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{dayNames[schedule.day_of_week]}</span>
                            <span>{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</span>
                            {schedule.location && (
                              <>
                                <MapPin className="h-3 w-3 ml-1" />
                                <span>{schedule.location}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem turmas inscritas</p>
                )}

                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/agenda">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuardianDashboard;
