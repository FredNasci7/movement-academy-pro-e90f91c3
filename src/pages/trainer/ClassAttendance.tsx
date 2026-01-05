import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import { useAttendance } from "@/hooks/useAttendance";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, Save, Users } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClassInfo {
  id: string;
  name: string;
  modalidade: string;
}

interface Session {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
}

const ClassAttendance = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isTreinador, isAdmin, isLoading: rolesLoading } = useRoles();

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [localAttendance, setLocalAttendance] = useState<Record<string, string>>({});
  const [isLoadingClass, setIsLoadingClass] = useState(true);

  const { students, attendance, isLoading: isLoadingAttendance, isSaving, saveAttendance } = useAttendance(selectedSession);

  // Fetch class info and sessions
  useEffect(() => {
    if (!classId) return;

    const fetchClassData = async () => {
      setIsLoadingClass(true);
      try {
        // Fetch class info
        const { data: cls, error: clsError } = await supabase
          .from("classes")
          .select("id, name, modalidade")
          .eq("id", classId)
          .single();

        if (clsError) throw clsError;
        setClassInfo(cls);

        // Fetch sessions for this class
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("class_sessions")
          .select("id, session_date, start_time, end_time")
          .eq("class_id", classId)
          .order("session_date", { ascending: false });

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);
      } catch (error) {
        console.error("Error fetching class data:", error);
        toast.error("Erro ao carregar dados da turma");
      } finally {
        setIsLoadingClass(false);
      }
    };

    fetchClassData();
  }, [classId]);

  // Find session for selected date
  useEffect(() => {
    if (!selectedDate || sessions.length === 0) {
      setSelectedSession(null);
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const session = sessions.find((s) => s.session_date === dateStr);
    setSelectedSession(session?.id || null);
  }, [selectedDate, sessions]);

  // Initialize local attendance from fetched attendance
  useEffect(() => {
    const initialAttendance: Record<string, string> = {};
    students.forEach((student) => {
      const record = attendance.find((a) => a.enrollmentId === student.enrollmentId);
      initialAttendance[student.enrollmentId] = record?.status || "presente";
    });
    setLocalAttendance(initialAttendance);
  }, [students, attendance]);

  const handleStatusChange = (enrollmentId: string, status: string) => {
    setLocalAttendance((prev) => ({ ...prev, [enrollmentId]: status }));
  };

  const handleSave = async () => {
    const records = Object.entries(localAttendance).map(([enrollmentId, status]) => ({
      enrollmentId,
      status,
    }));
    await saveAttendance(records);
  };

  const isLoading = authLoading || rolesLoading || isLoadingClass;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  if (!user || (!isTreinador && !isAdmin)) {
    navigate("/dashboard");
    return null;
  }

  const sessionDates = sessions.map((s) => new Date(s.session_date));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Registo de Presenças</h1>
            {classInfo && (
              <p className="text-muted-foreground">
                {classInfo.name} • {classInfo.modalidade}
              </p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Date selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selecionar Data</CardTitle>
                <CardDescription>Escolha a sessão para marcar presenças</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: pt }) : "Escolha uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={pt}
                      modifiers={{
                        hasSession: sessionDates,
                      }}
                      modifiersStyles={{
                        hasSession: { fontWeight: "bold", backgroundColor: "hsl(var(--primary) / 0.1)" },
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {selectedDate && !selectedSession && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Não existe sessão registada para esta data.
                  </p>
                )}

                {selectedSession && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Sessão selecionada</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDate!, "EEEE, d 'de' MMMM", { locale: pt })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance list */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Lista de Alunos
                    </CardTitle>
                    <CardDescription>
                      {students.length} aluno{students.length !== 1 ? "s" : ""} inscrito{students.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  {selectedSession && students.length > 0 && (
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "A guardar..." : "Guardar"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedSession ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Selecione uma data com sessão para marcar presenças.
                  </div>
                ) : isLoadingAttendance ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há alunos inscritos nesta turma.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.enrollmentId}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.type === "athlete" ? "Atleta" : "Membro"}
                          </p>
                        </div>
                        <RadioGroup
                          value={localAttendance[student.enrollmentId] || "presente"}
                          onValueChange={(value) => handleStatusChange(student.enrollmentId, value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="presente" id={`${student.enrollmentId}-presente`} />
                            <Label htmlFor={`${student.enrollmentId}-presente`} className="text-sm text-green-600">
                              Presente
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ausente" id={`${student.enrollmentId}-ausente`} />
                            <Label htmlFor={`${student.enrollmentId}-ausente`} className="text-sm text-red-600">
                              Ausente
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="justificado" id={`${student.enrollmentId}-justificado`} />
                            <Label htmlFor={`${student.enrollmentId}-justificado`} className="text-sm text-yellow-600">
                              Justificado
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default ClassAttendance;
