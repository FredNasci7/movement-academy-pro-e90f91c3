import { useState } from "react";
import { Calendar, Trash2, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type AthleteGuardian = Database["public"]["Tables"]["athlete_guardians"]["Row"];

interface AthleteCardProps {
  athlete: AthleteGuardian;
  onUpdate: (id: string, updates: Partial<AthleteGuardian>) => Promise<AthleteGuardian | null>;
  onDelete: (id: string) => Promise<boolean>;
}

const modalidadeLabels: Record<string, string> = {
  ginastica: "Ginástica",
  aulas_grupo: "Aulas de Grupo",
  treino_personalizado: "Treino Personalizado",
};

const subscriptionLabels: Record<string, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-green-500/10 text-green-600" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground" },
  trial: { label: "Trial", className: "bg-yellow-500/10 text-yellow-600" },
  expirado: { label: "Expirado", className: "bg-destructive/10 text-destructive" },
};

export const AthleteCard = ({ athlete, onUpdate, onDelete }: AthleteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    athlete_name: athlete.athlete_name,
    athlete_birth_date: athlete.athlete_birth_date || "",
    athlete_notes: athlete.athlete_notes || "",
    modalidade: athlete.modalidade || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    const result = await onUpdate(athlete.id, {
      athlete_name: editData.athlete_name,
      athlete_birth_date: editData.athlete_birth_date || null,
      athlete_notes: editData.athlete_notes || null,
      modalidade: editData.modalidade || null,
    });
    setIsLoading(false);
    if (result) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(athlete.id);
    setIsLoading(false);
  };

  const subscriptionStatus = athlete.subscription_status || "inativo";
  const subscriptionConfig = subscriptionLabels[subscriptionStatus];

  if (isEditing) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
        <Input
          value={editData.athlete_name}
          onChange={(e) => setEditData({ ...editData, athlete_name: e.target.value })}
          placeholder="Nome do atleta"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Data de Nascimento</label>
            <Input
              type="date"
              value={editData.athlete_birth_date}
              onChange={(e) => setEditData({ ...editData, athlete_birth_date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Modalidade</label>
            <Select
              value={editData.modalidade}
              onValueChange={(value) => setEditData({ ...editData, modalidade: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ginastica">Ginástica</SelectItem>
                <SelectItem value="aulas_grupo">Aulas de Grupo</SelectItem>
                <SelectItem value="treino_personalizado">Treino Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Textarea
          value={editData.athlete_notes}
          onChange={(e) => setEditData({ ...editData, athlete_notes: e.target.value })}
          placeholder="Observações (alergias, condições médicas...)"
          rows={2}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{athlete.athlete_name}</h4>
            <Badge variant="outline" className={subscriptionConfig.className}>
              {subscriptionConfig.label}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {athlete.athlete_birth_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(athlete.athlete_birth_date).toLocaleDateString("pt-PT")}
              </span>
            )}
            {athlete.modalidade && (
              <Badge variant="secondary" className="text-xs">
                {modalidadeLabels[athlete.modalidade] || athlete.modalidade}
              </Badge>
            )}
          </div>

          {athlete.athlete_notes && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {athlete.athlete_notes}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover atleta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover "{athlete.athlete_name}" da lista. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
