import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrainerClasses } from "@/hooks/useTrainerClasses";
import { Users, Clock, MapPin, Calendar, ClipboardCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const TrainerDashboard = () => {
  const { classes, isLoading } = useTrainerClasses();

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

  const totalStudents = classes.reduce((acc, cls) => acc + cls.enrollmentCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">As Minhas Turmas</h2>
        <p className="text-muted-foreground">
          {classes.length} turma{classes.length !== 1 ? "s" : ""} ativa{classes.length !== 1 ? "s" : ""} • {totalStudents} aluno{totalStudents !== 1 ? "s" : ""} inscrito{totalStudents !== 1 ? "s" : ""}
        </p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Não tem turmas atribuídas de momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <CardDescription>{cls.modalidade}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{cls.enrollmentCount}/{cls.max_capacity || "∞"}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cls.schedules.length > 0 && (
                  <div className="space-y-2">
                    {cls.schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center gap-2 text-sm">
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
                )}

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/treinador/presencas/${cls.id}`}>
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Presenças
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
