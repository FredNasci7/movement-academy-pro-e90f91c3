import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type AthleteGuardianInsert = Database["public"]["Tables"]["athlete_guardians"]["Insert"];

interface AddAthleteFormProps {
  onAdd: (athlete: Omit<AthleteGuardianInsert, "guardian_id">) => Promise<unknown>;
}

type Relationship = "pai" | "mae" | "tutor" | "outro";

export const AddAthleteForm = ({ onAdd }: AddAthleteFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    athlete_name: "",
    athlete_birth_date: "",
    athlete_notes: "",
    relationship: "pai" as Relationship,
    modalidade: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_name.trim()) return;

    setIsLoading(true);
    const result = await onAdd({
      athlete_name: formData.athlete_name,
      athlete_birth_date: formData.athlete_birth_date || null,
      athlete_notes: formData.athlete_notes || null,
      relationship: formData.relationship,
      modalidade: formData.modalidade || null,
    });
    setIsLoading(false);

    if (result) {
      setFormData({
        athlete_name: "",
        athlete_birth_date: "",
        athlete_notes: "",
        relationship: "pai",
        modalidade: "",
      });
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Atleta
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-foreground">Novo Atleta</h4>
        <Button size="icon" variant="ghost" type="button" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Input
        value={formData.athlete_name}
        onChange={(e) => setFormData({ ...formData, athlete_name: e.target.value })}
        placeholder="Nome do atleta *"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Parentesco</label>
          <Select
            value={formData.relationship}
            onValueChange={(value: Relationship) => setFormData({ ...formData, relationship: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pai">Pai</SelectItem>
              <SelectItem value="mae">Mãe</SelectItem>
              <SelectItem value="tutor">Tutor</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Data de Nascimento</label>
          <Input
            type="date"
            value={formData.athlete_birth_date}
            onChange={(e) => setFormData({ ...formData, athlete_birth_date: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Modalidade</label>
        <Select
          value={formData.modalidade}
          onValueChange={(value) => setFormData({ ...formData, modalidade: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ginastica">Ginástica</SelectItem>
            <SelectItem value="aulas_grupo">Aulas de Grupo</SelectItem>
            <SelectItem value="treino_personalizado">Treino Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={formData.athlete_notes}
        onChange={(e) => setFormData({ ...formData, athlete_notes: e.target.value })}
        placeholder="Observações (alergias, condições médicas...)"
        rows={2}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || !formData.athlete_name.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
