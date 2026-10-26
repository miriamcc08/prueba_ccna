import React, { useState, useEffect } from 'react';
import { ExamQuestionView } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import { CheckIcon, CheckCircleIcon, XCircleIcon, InfoIcon, ShieldIcon } from './Icons';

interface QuestionCardProps {
  question: ExamQuestionView;
  onConfirm: (selectedOptionIds: string[]) => Promise<boolean>;
  mode?: 'strict' | 'study' | string;
  isSubmitting?: boolean;
  // Study mode feedback if available
  studyFeedback?: {
    isCorrect?: boolean;
    explanation?: string;
    correctOptionIds?: string[];
  } | null;
  onNext?: () => void;
  hasNext?: boolean;
  showExplanations?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onConfirm,
  mode = 'strict',
  isSubmitting = false,
  studyFeedback,
  onNext,
  hasNext = true,
  showExplanations = true,
}) => {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  // Reset local state whenever the question changes
  useEffect(() => {
    setSelectedIds(question.selectedOptionIds || []);
    setHasConfirmed(!!question.feedback);
  }, [question.id, question.examQuestionId]);

  const isMultiple =
    question.questionType === 'multiple_choice' ||
    (question.multipleAnswerCount !== undefined && question.multipleAnswerCount > 1);

  const requiredCount = isMultiple ? question.multipleAnswerCount || 2 : 1;

  const handleOptionToggle = (optionId: string) => {
    if (hasConfirmed && mode === 'study') return; // Locked once answered in study mode

    if (isMultiple) {
      if (selectedIds.includes(optionId)) {
        setSelectedIds(selectedIds.filter((id) => id !== optionId));
      } else {
        if (selectedIds.length < requiredCount) {
          setSelectedIds([...selectedIds, optionId]);
        } else {
          // Replace the oldest selection if already at maximum count
          setSelectedIds([...selectedIds.slice(1), optionId]);
        }
      }
    } else {
      setSelectedIds([optionId]);
    }
  };

  const isSelectionValid = isMultiple
    ? selectedIds.length === requiredCount
    : selectedIds.length === 1;

  const handleConfirm = async () => {
    if (!isSelectionValid || isSubmitting) return;
    const confirmed = await onConfirm(selectedIds);
    if (confirmed) setHasConfirmed(true);
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30';
      case 'intermediate':
        return 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30';
      case 'advanced':
        return 'bg-purple-950/60 text-purple-400 border border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between">
      {/* Question Header & Meta Info */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-700 text-cyan-400">
              {t('exam.questionNumber', {
                current: question.questionNumber,
                total: question.totalQuestions,
              })}
            </span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${getDifficultyBadge(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <ShieldIcon size={14} className="text-teal-400" />
            <span>{question.topicName}</span>
          </div>
        </div>

        {/* Question Statement */}
        <div className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed mb-6 whitespace-pre-wrap font-sans">
          {question.statement}
        </div>

        {/* Instruction badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-cyan-300">
          <span>
            {isMultiple
              ? t('exam.selectMultiple', { count: requiredCount })
              : t('exam.selectSingle')}
          </span>
          {isMultiple && (
            <span className="text-slate-400 font-normal">
              ({selectedIds.length}/{requiredCount} selected)
            </span>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const isStudyAnswered = hasConfirmed && mode === 'study' && studyFeedback;
            const isCorrectOption = studyFeedback?.correctOptionIds?.includes(option.id);

            let optionContainerClass =
              'border-slate-700/80 bg-slate-900/60 hover:bg-slate-700/40 text-slate-200';

            if (isSelected) {
              optionContainerClass =
                'border-cyan-500 bg-cyan-950/40 text-white shadow-md shadow-cyan-500/10';
            }

            // Study feedback styling
            if (isStudyAnswered) {
              if (isCorrectOption) {
                optionContainerClass =
                  'border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectOption) {
                optionContainerClass =
                  'border-red-500 bg-red-950/40 text-red-100 ring-1 ring-red-500';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionToggle(option.id)}
                disabled={hasConfirmed && mode === 'study'}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 group cursor-pointer disabled:cursor-default ${optionContainerClass}`}
              >
                {/* Indicator check/radio */}
                <div className="pt-0.5 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs transition-colors ${
                      isMultiple ? 'rounded-md' : 'rounded-full'
                    } ${
                      isSelected
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
                        : 'border border-slate-600 bg-slate-800 text-slate-400 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected ? <CheckIcon size={14} /> : option.label}
                  </div>
                </div>

                {/* Option Content Text */}
                <div className="flex-1 text-sm sm:text-base leading-snug">
                  <span className="font-semibold text-slate-300 mr-2">{option.label}.</span>
                  <span>{option.text}</span>
                </div>

                {/* Study mode icons */}
                {isStudyAnswered && (
                  <div className="flex-shrink-0 pt-0.5">
                    {isCorrectOption ? (
                      <CheckCircleIcon size={20} className="text-emerald-400" />
                    ) : isSelected ? (
                      <XCircleIcon size={20} className="text-red-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Study Mode Explanation Box */}
        {hasConfirmed && mode === 'study' && studyFeedback && (
          <div className="mt-6 p-5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2">
              {studyFeedback.isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircleIcon size={18} />
                  <span>{t('exam.studyCorrect')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <XCircleIcon size={18} />
                  <span>{t('exam.studyIncorrect')}</span>
                </div>
              )}
            </div>

            {showExplanations && studyFeedback.explanation && (
              <div className="text-sm text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-200 block mb-1">
                  {t('exam.studyExplanation')}:
                </span>
                {studyFeedback.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-5 border-t border-slate-700/60 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {mode === 'strict' && (
            <span>* {t('config.options.strictMode')}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasConfirmed && mode === 'study' ? (
            <button
              type="button"
              onClick={onNext}
              className="btn-primary"
            >
              <span>{t(hasNext ? 'exam.nextQuestion' : 'exam.finishExam')}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!isSelectionValid || isSubmitting || hasConfirmed}
              onClick={handleConfirm}
              className="btn-primary"
            >
              <span>{isSubmitting ? t('common.loading') : t('exam.confirmAnswer')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
