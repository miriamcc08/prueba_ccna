import React, { useEffect, useState, useCallback } from 'react';
import {
  QuestionListItem,
  QuestionDetail,
  Difficulty,
  QuestionType,
  ValidationStatus,
  ExamArea,
  EXAM_AREA_LABELS,
} from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import {
  SearchIcon,
  FilterIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldIcon,
  AlertTriangleIcon,
} from '../components/Icons';

export const QuestionBankPage: React.FC = () => {
  const { t, language } = useTranslation();

  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Detail Modal
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getQuestions({
        page,
        pageSize,
        search: search.trim() || undefined,
        topic: selectedTopic || undefined,
        difficulty: selectedDifficulty || undefined,
        type: selectedType || undefined,
        status: selectedStatus || undefined,
      });

      if (res.success && res.data) {
        setQuestions(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.totalItems);
        } else {
          setTotalItems(res.data.length);
          setTotalPages(Math.ceil(res.data.length / pageSize) || 1);
        }
      } else {
        setError(res.error || 'Failed to fetch question bank');
      }
    } catch (e: any) {
      setError(e.message || 'Error loading questions');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, selectedTopic, selectedDifficulty, selectedType, selectedStatus]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleOpenDetail = async (id: string) => {
    setSelectedQuestionId(id);
    setLoadingDetail(true);
    try {
      const res = await api.getQuestionDetail(id);
      if (res.success && res.data) {
        setQuestionDetail(res.data);
      }
    } catch (e) {
      console.error('Error fetching detail', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedQuestionId(null);
    setQuestionDetail(null);
  };

  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'validated':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      case 'pending_review':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'rejected':
        return 'bg-red-950 text-red-400 border-red-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('questionBank.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {t('questionBank.subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card bg-slate-800/80 p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('questionBank.search')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-10 text-sm"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">{t('questionBank.allTopics')}</option>
              <option value="network_fundamentals">Network Fundamentals</option>
              <option value="network_access">Network Access</option>
              <option value="ip_connectivity">IP Connectivity</option>
              <option value="ip_services">IP Services</option>
              <option value="security_fundamentals">Security Fundamentals</option>
              <option value="automation_programmability">Automation &amp; Programmability</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">{t('questionBank.allDifficulties')}</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">{t('questionBank.allStatuses')}</option>
              <option value="validated">Validated</option>
              <option value="pending_review">Pending Review</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="card p-0 overflow-hidden bg-slate-800/90 border-slate-700/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4 w-12 font-semibold">#</th>
                <th className="py-3.5 px-4 font-semibold">{t('questionBank.columns.statement')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('questionBank.columns.topic')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('questionBank.columns.difficulty')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('questionBank.columns.type')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('questionBank.columns.status')}</th>
                <th className="py-3.5 px-4 font-semibold text-right">{t('questionBank.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin mr-2">⏳</div>
                    <span>{t('common.loading')}</span>
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No questions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                questions.map((q, index) => (
                  <tr
                    key={q.id || index}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="py-3.5 px-4 max-w-md font-medium text-slate-200">
                      <div className="line-clamp-2">{q.statement}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-cyan-400 font-medium">{q.topicName || q.examArea}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize">{q.difficulty}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {q.questionType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(q.validationStatus)}`}>
                        {q.validationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(q.id)}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-cyan-600 hover:text-white text-slate-200 text-xs font-semibold transition-colors"
                      >
                        {t('questionBank.viewDetail')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-700/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {questions.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(page * pageSize, totalItems)} of {totalItems} questions
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <span className="font-semibold text-slate-300">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Question Detail Modal */}
      {selectedQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-2xl w-full border-slate-700 bg-slate-900 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpenIcon size={20} className="text-cyan-400" />
                <span>{t('questionBank.modalTitle')}</span>
              </h3>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="text-slate-400 hover:text-white"
              >
                <XIcon size={20} />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-slate-400">
                <div className="inline-block animate-spin mr-2">⏳</div>
                <span>{t('common.loading')}</span>
              </div>
            ) : questionDetail ? (
              <div className="py-4 space-y-5 text-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Question Statement ({language.toUpperCase()}):
                  </span>
                  <div className="text-slate-100 font-medium leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    {language === 'es' ? questionDetail.statementEs || questionDetail.statementEn : questionDetail.statementEn}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    {t('questionBank.options')}:
                  </span>
                  <div className="space-y-2">
                    {questionDetail.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-lg border flex items-start gap-3 ${
                          opt.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold w-5">{opt.optionLabel}.</span>
                        <div className="flex-1">
                          <div>{language === 'es' ? opt.optionTextEs || opt.optionTextEn : opt.optionTextEn}</div>
                          {(language === 'es' ? opt.explanationEs : opt.explanationEn) && (
                            <div className="text-xs text-slate-400 mt-1 italic">
                              {language === 'es' ? opt.explanationEs : opt.explanationEn}
                            </div>
                          )}
                        </div>
                        {opt.isCorrect && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {((language === 'es' ? questionDetail.correctAnswerExplanationEs : questionDetail.correctAnswerExplanationEn) ||
                  (language === 'es' ? questionDetail.explanationEs : questionDetail.explanationEn)) && (
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      Technical Explanation:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'es'
                        ? questionDetail.correctAnswerExplanationEs || questionDetail.explanationEs
                        : questionDetail.correctAnswerExplanationEn || questionDetail.explanationEn}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400">
                Failed to load question details.
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCloseDetail}
                className="btn-secondary text-xs"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
