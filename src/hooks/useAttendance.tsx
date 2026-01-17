import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface EnrolledStudent {
  enrollmentId: string;
  name: string;
  type: "profile" | "athlete";
  profileId?: string;
  athleteId?: string;
}

export interface AttendanceRecord {
  id: string;
  enrollmentId: string;
  status: "presente" | "ausente" | "justificado";
  notes: string | null;
}

export const useAttendance = (sessionId: string | null) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStudents([]);
      setAttendance([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get session to find class_id
        const { data: session, error: sessionError } = await supabase
          .from("class_sessions")
          .select("class_id")
          .eq("id", sessionId)
          .single();

        if (sessionError) throw sessionError;

        // Get enrollments for this class
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from("class_enrollments")
          .select("id, profile_id, athlete_id")
          .eq("class_id", session.class_id)
          .eq("status", "active");

        if (enrollmentsError) throw enrollmentsError;

        // Fetch student names
        const studentsList: EnrolledStudent[] = [];

        for (const enrollment of enrollments || []) {
          if (enrollment.profile_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", enrollment.profile_id)
              .single();

            if (profile) {
              studentsList.push({
                enrollmentId: enrollment.id,
                name: profile.full_name || "Sem nome",
                type: "profile",
                profileId: enrollment.profile_id,
              });
            }
          } else if (enrollment.athlete_id) {
            // Now fetch from athletes table instead of athlete_guardians
            const { data: athlete } = await supabase
              .from("athletes")
              .select("full_name")
              .eq("id", enrollment.athlete_id)
              .single();

            if (athlete) {
              studentsList.push({
                enrollmentId: enrollment.id,
                name: athlete.full_name,
                type: "athlete",
                athleteId: enrollment.athlete_id,
              });
            }
          }
        }

        setStudents(studentsList);

        // Fetch existing attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("class_attendance")
          .select("id, enrollment_id, status, notes")
          .eq("session_id", sessionId);

        if (attendanceError) throw attendanceError;

        setAttendance(
          (attendanceData || []).map((a) => ({
            id: a.id,
            enrollmentId: a.enrollment_id,
            status: a.status as "presente" | "ausente" | "justificado",
            notes: a.notes,
          }))
        );
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast.error("Erro ao carregar dados de presença");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const saveAttendance = async (
    records: { enrollmentId: string; status: string; notes?: string }[]
  ) => {
    if (!sessionId || !user) return;

    setIsSaving(true);
    try {
      for (const record of records) {
        const existingRecord = attendance.find(
          (a) => a.enrollmentId === record.enrollmentId
        );

        if (existingRecord) {
          // Update existing
          await supabase
            .from("class_attendance")
            .update({
              status: record.status,
              notes: record.notes || null,
              marked_by: user.id,
              marked_at: new Date().toISOString(),
            })
            .eq("id", existingRecord.id);
        } else {
          // Insert new
          await supabase.from("class_attendance").insert({
            session_id: sessionId,
            enrollment_id: record.enrollmentId,
            status: record.status,
            notes: record.notes || null,
            marked_by: user.id,
          });
        }
      }

      toast.success("Presenças guardadas com sucesso");

      // Refresh attendance data
      const { data: attendanceData } = await supabase
        .from("class_attendance")
        .select("id, enrollment_id, status, notes")
        .eq("session_id", sessionId);

      setAttendance(
        (attendanceData || []).map((a) => ({
          id: a.id,
          enrollmentId: a.enrollment_id,
          status: a.status as "presente" | "ausente" | "justificado",
          notes: a.notes,
        }))
      );
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Erro ao guardar presenças");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    students,
    attendance,
    isLoading,
    isSaving,
    saveAttendance,
  };
};
