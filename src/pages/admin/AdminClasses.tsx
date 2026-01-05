import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Loader2, 
  ArrowLeft, 
  Plus,
  Clock,
  Users,
  MapPin,
  Trash2,
  Edit,
  X,
  Save,
  Calendar
} from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useClasses, ClassWithSchedules } from "@/hooks/useClasses";
import { useTrainers } from "@/hooks/useTrainers";

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const modalidadeLabels: Record<string, string> = {
  ginastica: "Ginástica",
  aulas_grupo: "Aulas de Grupo",
  treino_personalizado: "Treino Personalizado",
};

const AdminClasses = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { classes, isLoading, addClass, updateClass, deleteClass, addSchedule, deleteSchedule } = useClasses();
  const { trainers } = useTrainers();
  const navigate = useNavigate();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassWithSchedules | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassWithSchedules | null>(null);
  const [addingScheduleFor, setAddingScheduleFor] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    modalidade: "ginastica",
    trainer_id: "",
    max_capacity: 20,
    description: "",
    is_active: true,
  });

  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "10:00",
    location: "",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const resetForm = () => {
    setFormData({
      name: "",
      modalidade: "ginastica",
      trainer_id: "",
      max_capacity: 20,
      description: "",
      is_active: true,
    });
  };

  const handleAddClass = async () => {
    if (!formData.name.trim()) return;
    
    setIsSaving(true);
    const result = await addClass({
      name: formData.name,
      modalidade: formData.modalidade,
      trainer_id: formData.trainer_id || null,
      max_capacity: formData.max_capacity,
      description: formData.description || null,
      is_active: formData.is_active,
    });
    setIsSaving(false);

    if (result) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleEditClass = (cls: ClassWithSchedules) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      modalidade: cls.modalidade,
      trainer_id: cls.trainer_id || "",
      max_capacity: cls.max_capacity || 20,
      description: cls.description || "",
      is_active: cls.is_active,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingClass || !formData.name.trim()) return;

    setIsSaving(true);
    const result = await updateClass(editingClass.id, {
      name: formData.name,
      modalidade: formData.modalidade,
      trainer_id: formData.trainer_id || null,
      max_capacity: formData.max_capacity,
      description: formData.description || null,
      is_active: formData.is_active,
    });
    setIsSaving(false);

    if (result) {
      setEditingClass(null);
      resetForm();
    }
  };

  const handleDeleteClass = async () => {
    if (!deletingClass) return;
    
    setIsSaving(true);
    await deleteClass(deletingClass.id);
    setIsSaving(false);
    setDeletingClass(null);
  };

  const handleAddSchedule = async () => {
    if (!addingScheduleFor) return;

    setIsSaving(true);
    const result = await addSchedule({
      class_id: addingScheduleFor,
      day_of_week: scheduleForm.day_of_week,
      start_time: scheduleForm.start_time,
      end_time: scheduleForm.end_time,
      location: scheduleForm.location || null,
    });
    setIsSaving(false);

    if (result) {
      setAddingScheduleFor(null);
      setScheduleForm({
        day_of_week: 1,
        start_time: "09:00",
        end_time: "10:00",
        location: "",
      });
    }
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin")}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao painel
              </Button>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                      Gestão de Turmas
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Cria e gere turmas e os seus horários
                  </p>
                </div>
                <Button variant="gold" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Turma
                </Button>
              </div>
            </div>

            {/* Classes List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : classes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-card rounded-xl border border-border/50"
              >
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Ainda não existem turmas criadas
                </p>
                <Button variant="gold" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Turma
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {classes.map((cls, index) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-xl border border-border/50 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-heading font-semibold text-foreground">
                            {cls.name}
                          </h3>
                          <Badge variant={cls.is_active ? "default" : "secondary"}>
                            {cls.is_active ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">
                            {modalidadeLabels[cls.modalidade]}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Máx. {cls.max_capacity} alunos
                          </span>
                          {cls.trainer && (
                            <span>
                              Treinador: {cls.trainer.full_name || "Sem nome"}
                            </span>
                          )}
                        </div>
                        {cls.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {cls.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClass(cls)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingClass(cls)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Schedules */}
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Horários
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddingScheduleFor(cls.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>

                      {cls.schedules.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          Sem horários definidos
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {cls.schedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="text-sm">
                                <p className="font-medium">
                                  {dayNames[schedule.day_of_week]}
                                </p>
                                <p className="text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                </p>
                                {schedule.location && (
                                  <p className="text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {schedule.location}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => deleteSchedule(schedule.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Turma</DialogTitle>
            <DialogDescription>
              Cria uma nova turma para a academia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Turma *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Ginástica Nível 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modalidade</Label>
                <Select
                  value={formData.modalidade}
                  onValueChange={(v) => setFormData({ ...formData, modalidade: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ginastica">Ginástica</SelectItem>
                    <SelectItem value="aulas_grupo">Aulas de Grupo</SelectItem>
                    <SelectItem value="treino_personalizado">Treino Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Capacidade Máx.</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 20 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Treinador</Label>
              <Select
                value={formData.trainer_id}
                onValueChange={(v) => setFormData({ ...formData, trainer_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar treinador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem treinador</SelectItem>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name || "Sem nome"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da turma..."
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
              <Label>Turma ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleAddClass} disabled={isSaving || !formData.name.trim()}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Criar Turma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>
              Atualiza os dados da turma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Turma *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modalidade</Label>
                <Select
                  value={formData.modalidade}
                  onValueChange={(v) => setFormData({ ...formData, modalidade: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ginastica">Ginástica</SelectItem>
                    <SelectItem value="aulas_grupo">Aulas de Grupo</SelectItem>
                    <SelectItem value="treino_personalizado">Treino Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Capacidade Máx.</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 20 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Treinador</Label>
              <Select
                value={formData.trainer_id}
                onValueChange={(v) => setFormData({ ...formData, trainer_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar treinador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem treinador</SelectItem>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name || "Sem nome"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
              <Label>Turma ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClass(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleSaveEdit} disabled={isSaving || !formData.name.trim()}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Schedule Dialog */}
      <Dialog open={!!addingScheduleFor} onOpenChange={() => setAddingScheduleFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Horário</DialogTitle>
            <DialogDescription>
              Define um novo horário para esta turma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Dia da Semana</Label>
              <Select
                value={scheduleForm.day_of_week.toString()}
                onValueChange={(v) => setScheduleForm({ ...scheduleForm, day_of_week: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora Início</Label>
                <Input
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora Fim</Label>
                <Input
                  type="time"
                  value={scheduleForm.end_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Input
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                placeholder="Ex: Sala 1, Ginásio Principal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingScheduleFor(null)}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleAddSchedule} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Adicionar Horário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingClass} onOpenChange={() => setDeletingClass(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar turma?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá eliminar a turma "{deletingClass?.name}" e todos os seus horários. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass} disabled={isSaving}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminClasses;
