"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { QuestionTable } from "@/components/TabelaQuestoes/tabelaQuestoes";
import { QuestionFormDialog } from "@/components/Formularios/dialogForm";
import { updateTrilha } from "@/services/questions";
import { QuestionType } from "@/types/painel";
import type { Trilha, Etapa, Stage, Question } from "@/types/painel";

interface PainelQuestionsProps {
  selectedTrilha: Trilha;
  selectedEtapa: Etapa;
  selectedStage: Stage;
  refetch: () => Promise<void>;
  navigateToStages: (etapa: Etapa) => void;
  setSelectedTrilha: (trilha: Trilha) => void;
  setSelectedEtapa: (etapa: Etapa) => void;
  setSelectedStage: (stage: Stage) => void;
}

export function PainelQuestions({
  selectedTrilha,
  selectedEtapa,
  selectedStage,
  refetch,
  navigateToStages,
  setSelectedTrilha,
  setSelectedEtapa,
  setSelectedStage,
}: PainelQuestionsProps) {
  const { token } = useAuth();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  async function handleAddQuestion(newQuestion: Partial<Question>) {
    const hasDescription = newQuestion.description?.trim();
    const hasImage = newQuestion.descriptionImageUrl?.trim();

    if (
      !selectedTrilha ||
      !selectedEtapa ||
      !selectedStage ||
      (!hasDescription && !hasImage)
    ) {
      if (!hasDescription && !hasImage) {
        toast.error(
          "A questão deve ter pelo menos uma descrição ou uma imagem"
        );
      }
      return;
    }

    try {
      setIsAddingQuestion(true);

      const novaQuestao: Question = {
        id: `question_${Date.now()}`,
        type: newQuestion.type as QuestionType,
        description: newQuestion.description?.trim() || "",
        descriptionImageUrl: newQuestion.descriptionImageUrl?.trim() || "",
        ...getQuestionTypeSpecificData(newQuestion),
        correctExplanation: newQuestion.correctExplanation,
        incorrectExplanation: newQuestion.incorrectExplanation,
      };

      selectedStage.questions?.forEach((q, index) => {
        console.log(`  ${index + 1}. ID: ${q.id}, Tipo: ${q.type}`);
      });

      const stageAtualizado = {
        ...selectedStage,
        questions: [...(selectedStage.questions || []), novaQuestao],
      };

      stageAtualizado.questions?.forEach((q, index) => {
        console.log(`  ${index + 1}. ID: ${q.id}, Tipo: ${q.type}`);
      });

      const etapaAtualizada = {
        ...selectedEtapa,
        stages: selectedEtapa.stages.map((stage) =>
          stage.id === selectedStage.id ? stageAtualizado : stage
        ),
      };

      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.map((etapa) =>
          etapa.id === selectedEtapa.id ? etapaAtualizada : etapa
        ),
      };

      await updateTrilha(trilhaAtualizada);

      setSelectedTrilha(trilhaAtualizada);
      setSelectedEtapa(etapaAtualizada);
      setSelectedStage(stageAtualizado);

      toast.success("Questão adicionada com sucesso!");
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("❌ Erro ao adicionar questão:", err);
      toast.error("Erro ao adicionar questão", {
        description: err.message || "Não foi possível adicionar a questão.",
      });
    } finally {
      setIsAddingQuestion(false);
    }
  }

  function getQuestionTypeSpecificData(question: Partial<Question>) {
    switch (question.type) {
      case QuestionType.trueOrFalse:
        return {
          isTrue: question.isTrue || false,
          statementText: question.statementText || "",
        };
      case QuestionType.multipleChoice:
        return {
          options: question.options || [],
          correctOptions: question.correctOptions || [],
          multipleCorrect: question.multipleCorrect || false,
          statementText: question.statementText || "",
        };
      case QuestionType.ORDERING:
        return {
          items: question.items || [],
          correctOrder: question.correctOrder || [],
          statementText: question.statementText || "",
        };
      case QuestionType.MATCHING:
        return {
          leftColumn: question.leftColumn || [],
          rightColumn: question.rightColumn || [],
          correctMatches: question.correctMatches || [],
          statementText: question.statementText || "",
        };
      default:
        return {};
    }
  }

  function handleEditQuestionClick(question: Question) {
    const questionToEdit = {
      ...question,
      options: question.options || [],
      correctOptions: question.correctOptions || [],
      items: question.items || [],
      correctOrder: question.correctOrder || [],
      leftColumn: question.leftColumn || [],
      rightColumn: question.rightColumn || [],
      correctMatches: question.correctMatches || [],
    };

    console.log("🔧 Questão preparada para edição:", questionToEdit);
    setEditingQuestion(questionToEdit);
    setIsAddDialogOpen(true);
  }

  async function handleUpdateQuestion(updatedQuestion: Partial<Question>) {
    const hasDescription = updatedQuestion.description?.trim();
    const hasImage = updatedQuestion.descriptionImageUrl?.trim();

    if (
      !selectedTrilha ||
      !selectedEtapa ||
      !selectedStage ||
      !editingQuestion ||
      (!hasDescription && !hasImage)
    ) {
      if (!hasDescription && !hasImage) {
        toast.error(
          "A questão deve ter pelo menos uma descrição ou uma imagem"
        );
      }
      return;
    }

    try {
      setIsEditingQuestion(true);

      const questaoAtualizada: Question = {
        ...editingQuestion,
        ...updatedQuestion,
        id: editingQuestion.id,
        type: editingQuestion.type,
        description:
          updatedQuestion.description?.trim() ||
          editingQuestion.description ||
          "",
        descriptionImageUrl:
          updatedQuestion.descriptionImageUrl?.trim() ||
          editingQuestion.descriptionImageUrl ||
          "",
      };

      const stageAtualizado = {
        ...selectedStage,
        questions: (selectedStage.questions ?? []).map((question) =>
          question.id === editingQuestion.id ? questaoAtualizada : question
        ),
      };

      const etapaAtualizada = {
        ...selectedEtapa,
        stages: selectedEtapa.stages.map((stage) =>
          stage.id === selectedStage.id ? stageAtualizado : stage
        ),
      };

      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.map((etapa) =>
          etapa.id === selectedEtapa.id ? etapaAtualizada : etapa
        ),
      };

      await updateTrilha(trilhaAtualizada);

      setSelectedTrilha(trilhaAtualizada);
      setSelectedEtapa(etapaAtualizada);
      setSelectedStage(stageAtualizado);
      setEditingQuestion(null);
      setIsAddDialogOpen(false);

      toast.success("Questão atualizada com sucesso!");
    } catch (err: any) {
      console.error("❌ Erro ao atualizar questão:", err);
      toast.error("Erro ao atualizar questão", {
        description: err.message || "Não foi possível atualizar a questão.",
      });
    } finally {
      setIsEditingQuestion(false);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!selectedTrilha || !selectedEtapa || !selectedStage) return;

    try {
      const stageAtualizado = {
        ...selectedStage,
        questions: (selectedStage.questions ?? []).filter(
          (question) => question.id !== questionId
        ),
      };

      const etapaAtualizada = {
        ...selectedEtapa,
        stages: selectedEtapa.stages.map((stage) =>
          stage.id === selectedStage.id ? stageAtualizado : stage
        ),
      };

      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.map((etapa) =>
          etapa.id === selectedEtapa.id ? etapaAtualizada : etapa
        ),
      };

      await updateTrilha(trilhaAtualizada);

      setSelectedTrilha(trilhaAtualizada);
      setSelectedEtapa(etapaAtualizada);
      setSelectedStage(stageAtualizado);

      toast.success("Questão excluída com sucesso!");
    } catch (err: any) {
      console.error("Erro ao excluir questão:", err);
      toast.error("Erro ao excluir questão", {
        description: err.message || "Não foi possível excluir a questão.",
      });
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToStages(selectedEtapa)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <span>
              Questões:{" "}
              <span className="text-marca">{selectedStage.title}</span>
            </span>
          </h1>
        </div>
        <Button
          className="gap-1 items-center"
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={16} />
          Adicionar Questão
        </Button>
      </div>

      <QuestionTable
        questions={selectedStage.questions || []}
        onEditQuestion={handleEditQuestionClick}
        onDeleteQuestion={handleDeleteQuestion}
      />

      <QuestionFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddQuestion}
        isSubmitting={isAddingQuestion}
        title="Nova Questão"
        description={`Adicione uma nova questão ao stage ${selectedStage.title}.`}
        submitLabel="Adicionar questão"
        isEditing={false}
      />

      {editingQuestion && (
        <QuestionFormDialog
          key={editingQuestion.id}
          open={!!editingQuestion}
          onOpenChange={(open) => {
            if (!open) {
              setEditingQuestion(null);
            }
          }}
          onSubmit={handleUpdateQuestion}
          isSubmitting={isEditingQuestion}
          initialQuestion={editingQuestion}
          isEditing={true}
          title="Editar Questão"
          description="Edite as informações da questão."
          submitLabel="Salvar"
        />
      )}
    </>
  );
}
