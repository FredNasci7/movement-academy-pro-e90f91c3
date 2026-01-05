import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollments } from "@/hooks/useEnrollments";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DAYS_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

type ViewMode = "month" | "week";

const Agenda = () => {
  const { user, loading: authLoading } = useAuth();
  const { enrollments, isLoading } = useEnrollments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  // Monthly view calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Weekly view calculations
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
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
              Visualize as suas aulas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as ViewMode)}
              className="bg-muted rounded-lg p-1"
            >
              <ToggleGroupItem value="week" aria-label="Vista semanal" className="px-3">
                <CalendarDays className="h-4 w-4 mr-2" />
                Semana
              </ToggleGroupItem>
              <ToggleGroupItem value="month" aria-label="Vista mensal" className="px-3">
                <Calendar className="h-4 w-4 mr-2" />
                Mês
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday} className="min-w-[80px]">
                Hoje
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold capitalize">
            {viewMode === "month"
              ? format(currentDate, "MMMM yyyy", { locale: pt })
              : `${format(weekStart, "d 'de' MMMM", { locale: pt })} - ${format(addDays(weekStart, 6), "d 'de' MMMM, yyyy", { locale: pt })}`}
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
        ) : viewMode === "month" ? (
          /* MONTHLY VIEW */
          <div className="border rounded-lg overflow-hidden bg-card">
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

            <div className="grid grid-cols-7">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[120px] p-2 border-b border-r bg-muted/30"
                />
              ))}

              {monthDays.map((day) => {
                const dayClasses = getClassesForDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);

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
                          className="bg-primary/10 rounded p-1.5 hover:bg-primary/20 transition-colors cursor-pointer"
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
        ) : (
          /* WEEKLY VIEW */
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayClasses = getClassesForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <Card
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[200px]",
                    isToday && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader className="py-3 px-3">
                    <CardTitle
                      className={cn(
                        "text-sm text-center",
                        isToday && "text-primary"
                      )}
                    >
                      {DAYS_SHORT[getDay(day) === 0 ? 6 : getDay(day) - 1]}
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
