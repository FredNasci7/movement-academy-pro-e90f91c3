import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollments } from "@/hooks/useEnrollments";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const DAYS_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const Agenda = () => {
  const { user, loading: authLoading } = useAuth();
  const { enrollments, isLoading } = useEnrollments();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for the first day (0 = Sunday, we want Monday = 0)
  const startDayOfWeek = getDay(monthStart);
  // Convert to Monday-based (Monday = 0, Sunday = 6)
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Get classes for a specific day of week (database uses Sunday=0)
  const getClassesForDay = (date: Date) => {
    const dbDayIndex = getDay(date); // Sunday = 0
    
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
          <Skeleton className="h-[600px] w-full" />
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
              Visualize as suas aulas mensais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToCurrentMonth} className="min-w-[100px]">
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: pt })}
          </h2>
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
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
          <div className="border rounded-lg overflow-hidden bg-card">
            {/* Header with day names */}
            <div className="grid grid-cols-7 bg-muted">
              {DAYS_SHORT.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-medium text-muted-foreground border-b"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before month start */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[120px] p-2 border-b border-r bg-muted/30"
                />
              ))}

              {/* Month days */}
              {monthDays.map((day) => {
                const dayClasses = getClassesForDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[120px] p-2 border-b border-r transition-colors",
                      !isCurrentMonth && "bg-muted/30",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full",
                        isToday && "bg-primary text-primary-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1 max-h-[80px] overflow-y-auto">
                      {dayClasses.map((classItem, classIndex) => (
                        <div
                          key={classIndex}
                          className="bg-primary/10 rounded p-1.5 hover:bg-primary/20 transition-colors cursor-pointer group"
                          title={`${classItem.className} - ${classItem.start_time.slice(0, 5)} às ${classItem.end_time.slice(0, 5)}`}
                        >
                          <p className="font-medium text-[10px] truncate">
                            {classItem.className}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            {classItem.start_time.slice(0, 5)}
                          </div>
                          {classItem.athleteName && (
                            <Badge variant="outline" className="text-[8px] px-1 py-0 mt-0.5">
                              {classItem.athleteName}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Empty cells for days after month end */}
              {Array.from({
                length: (7 - ((startOffset + monthDays.length) % 7)) % 7,
              }).map((_, i) => (
                <div
                  key={`empty-end-${i}`}
                  className="min-h-[120px] p-2 border-b border-r bg-muted/30"
                />
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        {enrollments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/10 border" />
              <span>Aula agendada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                {format(new Date(), "d")}
              </div>
              <span>Hoje</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Agenda;
