import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EnrolledClass {
  id: string;
  name: string;
  modalidade: string;
  schedules: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    location: string | null;
  }[];
}

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const AthleteDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [profile, setProfile] = useState<{ subscriptionStatus: string | null; modalidade: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile info
        const { data: profileData } = await supabase
          .from("profiles")
          .select("subscription_status, modalidade")
          .eq("id", user.id)
          .single();

        setProfile({
          subscriptionStatus: profileData?.subscription_status || null,
          modalidade: profileData?.modalidade || null,
        });

        // Fetch enrolled classes
        const { data: enrollments, error } = await supabase
          .from("class_enrollments")
          .select(`
            class_id,
            classes (
              id,
              name,
              modalidade,
              class_schedules (
                day_of_week,
                start_time,
                end_time,
                location
              )
            )
          `)
          .eq("profile_id", user.id)
          .eq("status", "active");

        if (error) throw error;

        const enrolledClasses = (enrollments || [])
          .filter((e) => e.classes)
          .map((e) => ({
            id: e.classes!.id,
            name: e.classes!.name,
            modalidade: e.classes!.modalidade,
            schedules: e.classes!.class_schedules || [],
          }));

        setClasses(enrolledClasses);
      } catch (error) {
        console.error("Error fetching athlete data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // Get today's and next classes
  const today = new Date().getDay();
  const todaysClasses = classes.filter((cls) =>
    cls.schedules.some((s) => s.day_of_week === today)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">A Minha Área</h2>
          <p className="text-muted-foreground">
            {classes.length} turma{classes.length !== 1 ? "s" : ""} inscrita{classes.length !== 1 ? "s" : ""}
          </p>
        </div>
        {profile && (
          <Badge variant={profile.subscriptionStatus === "ativo" ? "default" : "secondary"}>
            {profile.subscriptionStatus || "Inativo"}
          </Badge>
        )}
      </div>

      {todaysClasses.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Aulas de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaysClasses.map((cls) => {
                const todaySchedule = cls.schedules.find((s) => s.day_of_week === today);
                return (
                  <div key={cls.id} className="flex items-center justify-between bg-background rounded-lg p-3">
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.modalidade}</p>
                    </div>
                    {todaySchedule && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {todaySchedule.start_time.slice(0, 5)} - {todaySchedule.end_time.slice(0, 5)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">As Minhas Turmas</h3>
        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Ainda não está inscrito em nenhuma turma.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <CardDescription>{cls.modalidade}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cls.schedules.map((schedule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{dayNames[schedule.day_of_week]}</span>
                        <span className="text-muted-foreground">
                          {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                        </span>
                        {schedule.location && (
                          <>
                            <MapPin className="h-4 w-4 text-muted-foreground ml-2" />
                            <span className="text-muted-foreground">{schedule.location}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link to="/agenda">
          <Calendar className="h-4 w-4 mr-2" />
          Ver Agenda Completa
        </Link>
      </Button>
    </div>
  );
};

export default AthleteDashboard;
