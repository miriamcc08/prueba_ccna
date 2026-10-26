import React from 'react';
import { ExamConfig, EXAM_AREA_LABELS } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import { PlayIcon, ClockIcon, ShieldIcon, AlertTriangleIcon, CheckCircleIcon } from './Icons';

interface ExamSummaryCardProps {
  config: ExamConfig;
  availableCount?: number;
  isLoading?: boolean;
  onStart: () => void;
  className?: string;
}

export const ExamSummaryCard: React.FC<ExamSummaryCardProps> = ({
  config,
  availableCount,
  isLoading = false,
  onStart,
  className = '',
}) => {
  const { t, language } = useTranslation();

  const isCountValid = availableCount === undefined || availableCount > 0;

  return (
    <div className={`card sticky top-20 border-slate-700/80 bg-slate-800/95 flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700/80 flex items-center gap-2">
          <ShieldIcon className="text-cyan-400" size={22} />
          <span>{t('config.summary.title')}</span>
        </h3>

        {config.perQuestionTimeLimit && <p className="mb-3 text-sm text-cyan-300">{t('config.options.perQuestionTimeLimit')}: {config.perQuestionTimeLimit} s</p>}
        {/* Configuration Parameter Rows */}
        <div className="space-y-3.5 text-sm mb-6">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.mode')}:</span>
            <span className="font-semibold text-slate-200 capitalize">
              {t(`config.mode.${config.mode}`)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.questions')}:</span>
            <span className="font-bold text-cyan-400">{config.questionCount} questions</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.duration')}:</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ClockIcon size={14} className="text-teal-400" />
              <span>{config.untimed ? t('study.untimed') : `${config.durationMinutes} ${t('config.duration.minutes')}`}</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.language')}:</span>
            <span className="font-semibold text-slate-200 uppercase">
              {config.language === 'en' ? 'English' : 'Español'}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.difficulty')}:</span>
            <span className="font-semibold text-slate-200 capitalize">
              {config.difficulty}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.selectedTopics')}:</span>
            <span className="font-semibold text-cyan-400">
              {config.topics.length === 0 ? 'All 6 CCNA Blueprint Areas' : `${config.topics.length} Selected`}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.strictMode')}:</span>
            <span className={config.strictMode ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
              {config.strictMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
            <span className="text-slate-400">{t('config.summary.studyMode')}:</span>
            <span className={config.studyMode ? 'text-teal-400 font-semibold' : 'text-slate-500'}>
              {config.studyMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {availableCount !== undefined && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">{t('config.summary.availableQuestions')}:</span>
              <span className={`font-bold ${availableCount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {availableCount}
              </span>
            </div>
          )}
        </div>

        {/* Warning if 0 available */}
        {availableCount !== undefined && availableCount === 0 && (
          <div className="p-3 mb-4 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangleIcon size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span>{t('config.summary.noQuestionsAlert')}</span>
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="pt-4 border-t border-slate-700/60">
        <button
          type="button"
          onClick={onStart}
          disabled={!isCountValid || isLoading}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base group"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <PlayIcon size={18} className="group-hover:translate-x-0.5 transition-transform" />
          )}
          <span>{isLoading ? t('common.loading') : t('config.summary.startButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default ExamSummaryCard;
