import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollments } from "@/hooks/useEnrollments";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "react-router-dom";

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Agenda = () => {
  const { user, loading: authLoading } = useAuth();
  const { enrollments, isLoading } = useEnrollments();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Get classes for a specific day of week
  const getClassesForDay = (dayIndex: number) => {
    // Convert from our week (Monday=0) to database (Sunday=0)
    const dbDayIndex = dayIndex === 6 ? 0 : dayIndex + 1;
    
    return enrollments.flatMap((enrollment) =>
      enrollment.class.schedules
        .filter((schedule) => schedule.day_of_week === dbDayIndex)
        .map((schedule) => ({
          ...schedule,
          className: enrollment.class.name,
          modalidade: enrollment.class.modalidade,
          trainer: enrollment.class.trainer?.full_name,
          athleteName: enrollment.athlete?.athlete_name,
        }))
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              A Minha Agenda
            </h1>
            <p className="text-muted-foreground">
              Visualize as suas aulas semanais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToCurrentWeek}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg font-medium">
            {format(currentWeekStart, "d 'de' MMMM", { locale: pt })} -{" "}
            {format(addDays(currentWeekStart, 6), "d 'de' MMMM, yyyy", { locale: pt })}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sem inscrições</h3>
              <p className="text-muted-foreground">
                Ainda não está inscrito em nenhuma turma.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const dayClasses = getClassesForDay(index);
              const isToday = isSameDay(day, new Date());

              return (
                <Card
                  key={index}
                  className={`min-h-[200px] ${
                    isToday ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardHeader className="py-3 px-3">
                    <CardTitle
                      className={`text-sm text-center ${
                        isToday ? "text-primary" : ""
                      }`}
                    >
                      {DAYS_SHORT[index === 6 ? 0 : index + 1]}
                    </CardTitle>
                    <CardDescription className="text-center text-lg font-medium">
                      {format(day, "d")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 pb-3 space-y-2">
                    {dayClasses.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center">
                        Sem aulas
                      </p>
                    ) : (
                      dayClasses.map((classItem, classIndex) => (
                        <div
                          key={classIndex}
                          className="bg-primary/10 rounded-lg p-2 space-y-1"
                        >
                          <p className="font-medium text-xs truncate">
                            {classItem.className}
                          </p>
                          <Badge variant="secondary" className="text-[10px]">
                            {classItem.modalidade}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {classItem.start_time.slice(0, 5)} -{" "}
                            {classItem.end_time.slice(0, 5)}
                          </div>
                          {classItem.location && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {classItem.location}
                            </div>
                          )}
                          {classItem.trainer && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <User className="h-3 w-3" />
                              {classItem.trainer}
                            </div>
                          )}
                          {classItem.athleteName && (
                            <Badge variant="outline" className="text-[10px]">
                              {classItem.athleteName}
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Agenda;
