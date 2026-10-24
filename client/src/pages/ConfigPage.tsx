import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ExamConfig,
  ExamMode,
  Difficulty,
  Language,
  QUESTION_COUNT_OPTIONS,
  DURATION_OPTIONS,
  EXAM_AREA_LABELS,
  EXAM_AREA_WEIGHTS,
  ExamArea,
  TopicWithCount,
} from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import ExamSummaryCard from '../components/ExamSummaryCard';
import {
  PlayIcon,
  BookOpenIcon,
  TerminalIcon,
  RefreshIcon,
  ShieldIcon,
  AlertTriangleIcon,
} from '../components/Icons';

export const ConfigPage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlMode = searchParams.get('mode') as ExamMode | null;

  const [availableTopics, setAvailableTopics] = useState<TopicWithCount[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [creatingExam, setCreatingExam] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [mode, setMode] = useState<ExamMode>(urlMode || 'full_simulation');
  const [questionCount, setQuestionCount] = useState<number>(urlMode === 'full_simulation' ? 100 : 25);
  const [customQuestionCount, setCustomQuestionCount] = useState<string>('');
  const [isCustomCount, setIsCustomCount] = useState(false);

  const [durationMinutes, setDurationMinutes] = useState<number>(urlMode === 'full_simulation' ? 120 : 30);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  const [examLanguage, setExamLanguage] = useState<Language>(language);
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const [randomize, setRandomize] = useState(true);
  const [groupByTopic, setGroupByTopic] = useState(false);
  const [strictMode, setStrictMode] = useState(urlMode === 'full_simulation');
  const [studyMode, setStudyMode] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [perQuestionTimeLimit, setPerQuestionTimeLimit] = useState<number>(0);

  // Load topics
  useEffect(() => {
    setLoadingTopics(true);
    api.getTopics()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setAvailableTopics(res.data);
        } else {
          // Fallback official 6 exam areas
          const fallback: TopicWithCount[] = (Object.keys(EXAM_AREA_WEIGHTS) as ExamArea[]).map((area, idx) => ({
            id: area,
            nameEn: EXAM_AREA_LABELS[area].en,
            nameEs: EXAM_AREA_LABELS[area].es,
            examArea: area,
            examAreaNumber: `${idx + 1}.0`,
            weightPercentage: EXAM_AREA_WEIGHTS[area],
            questionCount: 40,
            validatedCount: 35,
          }));
          setAvailableTopics(fallback);
        }
      })
      .catch(() => {
        // Fallback
        const fallback: TopicWithCount[] = (Object.keys(EXAM_AREA_WEIGHTS) as ExamArea[]).map((area, idx) => ({
          id: area,
          nameEn: EXAM_AREA_LABELS[area].en,
          nameEs: EXAM_AREA_LABELS[area].es,
          examArea: area,
          examAreaNumber: `${idx + 1}.0`,
          weightPercentage: EXAM_AREA_WEIGHTS[area],
          questionCount: 40,
          validatedCount: 35,
        }));
        setAvailableTopics(fallback);
      })
      .finally(() => setLoadingTopics(false));
  }, []);

  // Update mode presets
  const handleModeChange = (newMode: ExamMode) => {
    setMode(newMode);
    if (newMode === 'full_simulation') {
      setQuestionCount(100);
      setIsCustomCount(false);
      setDurationMinutes(120);
      setIsCustomDuration(false);
      setDifficulty('mixed');
      setStrictMode(true);
      setStudyMode(false);
      setSelectedTopics([]); // all
    } else if (newMode === 'subnetting_practice') {
      setQuestionCount(25);
      setIsCustomCount(false);
      setDurationMinutes(30);
      setIsCustomDuration(false);
      setStrictMode(false);
      setStudyMode(true);
    } else if (newMode === 'incorrect_review') {
      setQuestionCount(20);
      setIsCustomCount(false);
      setDurationMinutes(25);
      setIsCustomDuration(false);
      setStrictMode(false);
      setStudyMode(true);
    }
  };

  const handleTopicToggle = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((id) => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSelectAllTopics = () => {
    setSelectedTopics(availableTopics.map((t) => t.id));
  };

  const handleDeselectAllTopics = () => {
    setSelectedTopics([]);
  };

  const currentConfig: ExamConfig = {
    questionCount: isCustomCount ? parseInt(customQuestionCount, 10) || 10 : questionCount,
    durationMinutes: isCustomDuration ? parseInt(customDuration, 10) || 15 : durationMinutes,
    language: examLanguage,
    mode,
    difficulty,
    topics: selectedTopics,
    randomize,
    strictMode,
    studyMode,
    showExplanations,
    soundEnabled,
    perQuestionTimeLimit: perQuestionTimeLimit > 0 ? perQuestionTimeLimit : undefined,
    groupByTopic,
  };

  const handleStartExam = async () => {
    setCreatingExam(true);
    setError(null);
    try {
      const res = await api.createExam(currentConfig);
      if (res.success && res.data) {
        navigate(`/exam/${res.data.examId}`);
      } else {
        setError(res.error || 'Failed to start exam. Check your parameters.');
      }
    } catch (e: any) {
      setError(e.message || 'Error occurred while initializing exam session');
    } finally {
      setCreatingExam(false);
    }
  };

  const modeOptions: { mode: ExamMode; titleKey: string; descKey: string; icon: any }[] = [
    { mode: 'full_simulation', titleKey: 'config.mode.full_simulation', descKey: 'config.mode.full_simulation_desc', icon: PlayIcon },
    { mode: 'topic_practice', titleKey: 'config.mode.topic_practice', descKey: 'config.mode.topic_practice_desc', icon: BookOpenIcon },
    { mode: 'custom', titleKey: 'config.mode.custom', descKey: 'config.mode.custom_desc', icon: ShieldIcon },
    { mode: 'incorrect_review', titleKey: 'config.mode.incorrect_review', descKey: 'config.mode.incorrect_review_desc', icon: RefreshIcon },
    { mode: 'subnetting_practice', titleKey: 'config.mode.subnetting_practice', descKey: 'config.mode.subnetting_practice_desc', icon: TerminalIcon },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {t('config.title')}
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          {t('config.subtitle')}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
          <AlertTriangleIcon size={20} className="text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Config Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Exam Mode Selection */}
          <section className="card">
            <h2 className="text-lg font-bold text-white mb-4">
              1. {t('config.mode.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modeOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = mode === item.mode;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => handleModeChange(item.mode)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                        : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-700/40 hover:border-slate-600'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-100">{t(item.titleKey)}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-snug">{t(item.descKey)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Questions & Duration */}
          <section className="card grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Question Count */}
            <div>
              <h2 className="text-sm font-bold text-white mb-3">
                {t('config.questionCount.title')}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {QUESTION_COUNT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setQuestionCount(count);
                      setIsCustomCount(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${
                      !isCustomCount && questionCount === count
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomCount(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    isCustomCount
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t('config.questionCount.custom')}
                </button>
              </div>

              {isCustomCount && (
                <div className="mt-3">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    placeholder="Enter question count (1-150)"
                    value={customQuestionCount}
                    onChange={(e) => setCustomQuestionCount(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <h2 className="text-sm font-bold text-white mb-3">
                {t('config.duration.title')}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {DURATION_OPTIONS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setDurationMinutes(mins);
                      setIsCustomDuration(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${
                      !isCustomDuration && durationMinutes === mins
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    isCustomDuration
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t('config.questionCount.custom')}
                </button>
              </div>

              {isCustomDuration && (
                <div className="mt-3">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    placeholder="Enter minutes (5-300)"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              )}
            </div>
          </section>

          {/* 3. Language & Difficulty */}
          <section className="card grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-bold text-white mb-3">
                {t('config.language.title')}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExamLanguage('en')}
                  className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
                    examLanguage === 'en'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  {t('config.language.en')}
                </button>
                <button
                  type="button"
                  onClick={() => setExamLanguage('es')}
                  className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
                    examLanguage === 'es'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  {t('config.language.es')}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-white mb-3">
                {t('config.difficulty.title')}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {(['basic', 'intermediate', 'advanced', 'mixed'] as Difficulty[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      difficulty === lvl
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Topic Domain Selection */}
          <section className="card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {t('config.topics.title')}
                </h2>
                <p className="text-xs text-slate-400">
                  Select specific domains or leave empty to include all blueprint areas.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={handleSelectAllTopics}
                  className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  {t('config.topics.selectAll')}
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllTopics}
                  className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  {t('config.topics.deselectAll')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const areaLabel = topic.examArea && EXAM_AREA_LABELS[topic.examArea]
                  ? EXAM_AREA_LABELS[topic.examArea][language]
                  : topic.nameEn;

                return (
                  <div
                    key={topic.id}
                    onClick={() => handleTopicToggle(topic.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 text-white'
                        : 'border-slate-700/80 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-semibold text-slate-200">{areaLabel}</div>
                      <div className="text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>Blueprint Weight: {topic.weightPercentage}%</span>
                        {topic.validatedCount !== undefined && (
                          <span className="text-cyan-400">{topic.validatedCount} Qs</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Simulation Options Checkboxes */}
          <section className="card space-y-4">
            <h2 className="text-lg font-bold text-white">
              {t('config.options.title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800 h-4 w-4"
                />
                <span className="text-slate-200">{t('config.options.randomize')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupByTopic}
                  onChange={(e) => setGroupByTopic(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800 h-4 w-4"
                />
                <span className="text-slate-200">{t('config.options.groupByTopic')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strictMode}
                  onChange={(e) => {
                    setStrictMode(e.target.checked);
                    if (e.target.checked) setStudyMode(false);
                  }}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800 h-4 w-4"
                />
                <span className="text-slate-200">{t('config.options.strictMode')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={studyMode}
                  onChange={(e) => {
                    setStudyMode(e.target.checked);
                    if (e.target.checked) setStrictMode(false);
                  }}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800 h-4 w-4"
                />
                <span className="text-slate-200">{t('config.options.studyMode')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showExplanations}
                  onChange={(e) => setShowExplanations(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800 h-4 w-4"
                />
                <span className="text-slate-200">{t('config.options.showExplanations')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-800 h-4 w-4"
                />
                <span className="text-slate-200">{t('config.options.soundEnabled')}</span>
              </label>
            </div>
          </section>
        </div>

        {/* Right 1 Col: Summary Panel */}
        <div>
          <ExamSummaryCard
            config={currentConfig}
            isLoading={creatingExam}
            onStart={handleStartExam}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
