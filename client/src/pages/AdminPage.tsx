import { parseQuestionCsv, QUESTION_CSV_TEMPLATE } from '@shared/questionCsv';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QuestionListItem,
  ValidationStatus,
  QuestionImportItem,
  ImportResult,
  EXAM_AREA_LABELS,
  ExamArea,
} from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import AdminQuestionEditor from '../components/AdminQuestionEditor';
import {
  ShieldIcon,
  UploadIcon,
  BarChartIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  XIcon,
} from '../components/Icons';

type AdminTab = 'questions' | 'import' | 'statistics' | 'create';

export const AdminPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const l = (es: string, en: string) => language === 'es' ? es : en;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('questions');

  // Question Management State
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionPage, setQuestionPage] = useState(1);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionStatus, setQuestionStatus] = useState('');
  const [pagination, setPagination] = useState<import('@shared/types').PaginationInfo | null>(null);
  const requestVersion = useRef(0);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; status: ValidationStatus } | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewEvidence, setReviewEvidence] = useState('');
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [reviewDetail, setReviewDetail] = useState<import('@shared/types').QuestionDetail | null>(null);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [revisionDraft, setRevisionDraft] = useState({ statementEn: '', statementEs: '', explanationEn: '', explanationEs: '', sourceUrl: '' });
  const [revisionOptions, setRevisionOptions] = useState<import('@shared/types').QuestionOptionDetail[]>([]);
  const [validationMessage, setValidationMessage] = useState('');
  const revisionChanged = !!reviewDetail && (Object.keys(revisionDraft) as Array<keyof typeof revisionDraft>).some(key => revisionDraft[key] !== (reviewDetail[key] || '')) || (!!reviewDetail && JSON.stringify(revisionOptions) !== JSON.stringify(reviewDetail.options));
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Import State
  const [jsonInput, setJsonInput] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Statistics State
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Redirect non-admins or unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadQuestions = async () => {
    const version = ++requestVersion.current;
    setLoadingQuestions(true);
    try {
      const res = await api.getQuestions({ page: questionPage, pageSize: 50, search: questionSearch, status: questionStatus, language });
      if (version !== requestVersion.current) return;
      if (res.success && res.data) {
        setQuestions(res.data); setPagination(res.pagination || null);
        if (res.pagination && questionPage > Math.max(1, res.pagination.totalPages)) setQuestionPage(Math.max(1, res.pagination.totalPages));
      } else { setQuestions([]); setPagination(null); setActionMessage(res.error || l('No se pudo cargar el banco.', 'Unable to load the question bank.')); }
    } catch { if (version === requestVersion.current) { setQuestions([]); setPagination(null); setActionMessage(l('No se pudo cargar el banco.', 'Unable to load the question bank.')); } }
    finally { if (version === requestVersion.current) setLoadingQuestions(false); }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.getAdminStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setStats(null);
        setActionMessage(res.error || t('adminWorkflow.statsError'));
      }
    } catch {
      setStats(null);
      setActionMessage(t('adminWorkflow.statsError'));
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'questions') {
      loadQuestions();
    } else if (activeTab === 'statistics') {
      loadStats();
    }
  }, [activeTab, isAdmin, questionPage, questionSearch, questionStatus, language]);

  const handleUpdateStatus = async (id: string, status: ValidationStatus) => {
    setReviewTarget({ id, status }); setReviewNotes(''); setReviewEvidence(''); setReviewConfirmed(false); setReviewDetail(null); setRevisionOptions([]); setValidationMessage('');
    const detail = await api.getQuestionDetail(id);
    if (detail.success && detail.data) {
      setReviewDetail(detail.data);
      if (detail.data.sourceUrl?.startsWith('https://')) setReviewEvidence(detail.data.sourceUrl);
      setRevisionDraft({ statementEn: detail.data.statementEn, statementEs: detail.data.statementEs, explanationEn: detail.data.explanationEn || '', explanationEs: detail.data.explanationEs || '', sourceUrl: detail.data.sourceUrl || '' });
      setRevisionOptions(detail.data.options.map(option => ({ ...option })));
    }
    else setActionMessage(detail.error || t('adminWorkflow.detailError'));
  };
  const submitReview = async () => {
    if (!reviewTarget) return;
    if (revisionChanged) { setActionMessage(t('adminWorkflow.saveRevisionFirst')); return; }
    setReviewBusy(true);
    try {
      const res = await api.updateQuestionStatus(reviewTarget.id, reviewTarget.status, reviewNotes, reviewEvidence || undefined);
      if (res.success) {
        setReviewTarget(null); await loadQuestions(); setActionMessage(t('adminWorkflow.saved'));
      } else setActionMessage(res.error || t('adminWorkflow.saveError'));
    } finally { setReviewBusy(false); }
  };

  const saveRevision = async () => {
    if (!reviewTarget || !revisionChanged) return;
    setReviewBusy(true);
    try {
      const res = await api.createQuestionRevision(reviewTarget.id, { ...revisionDraft, options: revisionOptions, multipleAnswerCount: reviewDetail?.questionType === 'multiple_choice' ? revisionOptions.filter(option => option.isCorrect).length : null });
      if (res.success) { setReviewTarget(null); await loadQuestions(); setActionMessage(t('adminWorkflow.revisionSaved')); }
      else setActionMessage(res.error || t('adminWorkflow.saveError'));
    } finally { setReviewBusy(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setImportError(l('El archivo supera 2 MiB.', 'The file exceeds 2 MiB.')); e.target.value = ''; return; }
    setImportFormat(file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'json');
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonInput(content);
        setImportError(null);
      } catch {
        setImportError('Failed to parse uploaded JSON file.');
      }
    };
    reader.onerror = () => setImportError(l('No se pudo leer el archivo.', 'Unable to read the file.'));
    reader.readAsText(file);
  };

  const handleProcessImport = async () => {
    setImportError(null);
    setImportResult(null);

    let parsedQuestions: QuestionImportItem[];
    try {
      const payload = importFormat === 'csv' ? parseQuestionCsv(jsonInput) : JSON.parse(jsonInput);
      parsedQuestions = Array.isArray(payload) ? payload : payload?.questions;
      if (!Array.isArray(parsedQuestions)) {
        setImportError(l('Usa una lista JSON o un objeto con questions como lista.', 'Use a JSON array or an object with a questions array.'));
        return;
      }
    } catch (e: any) {
      setImportError(`${l('Formato inválido', 'Invalid format')} (${importFormat.toUpperCase()}): ${e.message}`);
      return;
    }

    setIsImporting(true);
    try {
      const res = await api.importQuestions(parsedQuestions);
      if (res.success && res.data) {
        setImportResult(res.data);
      } else {
        setImportError(res.error || 'Import request failed.');
      }
    } catch (e: any) {
      setImportError(e.message || 'Error occurred during import.');
    } finally {
      setIsImporting(false);
    }
  };

  if (authLoading) return <p>{t('common.loading')}</p>;
  if (!isAuthenticated) return null;

  if (!isAdmin && isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 card text-center space-y-4 border-amber-500/50">
        <ShieldIcon size={36} className="text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">{l('Acceso restringido', 'Restricted access')}</h2>
        <p className="text-slate-300 text-sm">
          {l('Necesitas permisos de administrador para acceder al panel.', 'Administrator permissions are required to access this panel.')}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-secondary mx-auto mt-4"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldIcon className="text-cyan-400" size={28} />
            <span>{t('admin.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {l('Crea, importa y revisa preguntas antes de incorporarlas a los exámenes.', 'Create, import and review questions before making them available in exams.')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button type="button" onClick={() => { setActiveTab('create'); setReviewTarget(null); }} className="btn-secondary">{l('Crear pregunta', 'Create question')}</button>
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'questions' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('admin.tabs.questions')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'import' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('admin.tabs.import')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('statistics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'statistics' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('admin.tabs.statistics')}
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2">
          <CheckCircleIcon size={16} className="text-cyan-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {activeTab === 'create' && <AdminQuestionEditor onCreated={() => {
        setQuestionPage(1); setQuestionSearch(''); setQuestionStatus('pending_review'); setActiveTab('questions');
        setActionMessage(l('Pregunta creada y guardada pendiente de revisión.', 'Question created and saved for review.'));
      }} />}

      {reviewTarget && <section className="card space-y-3" aria-label={t('adminWorkflow.title')}>
        <h2>{t('adminWorkflow.title')}: {reviewTarget.status}</h2>
        {reviewDetail ? <div className="space-y-2">
          <p>{reviewDetail.statementEn}</p><p>{reviewDetail.statementEs}</p>
          {reviewDetail.questionFamilyId && <p>{t('adminWorkflow.exerciseFamily')}: {reviewDetail.questionFamilyId}</p>}
          {reviewDetail.sourceUrl?.startsWith('https://') && <a className="text-cyan-300 underline" href={reviewDetail.sourceUrl} target="_blank" rel="noopener noreferrer">{t('adminWorkflow.openReference')}</a>}
          {reviewDetail.options.map(option => <p key={option.id}>{option.optionLabel}: {option.optionTextEn} / {option.optionTextEs} {option.isCorrect ? '✓' : ''}</p>)}
          <p>{reviewDetail.explanationEn}</p><p>{reviewDetail.explanationEs}</p>
          {reviewDetail.sourceLicense && <p>{l('Autoría o licencia', 'Authorship or license')}: {reviewDetail.sourceLicense}</p>}
        </div> : <p>{t('common.loading')}</p>}
        {reviewDetail && <details className="border border-slate-600 rounded p-3">
          <summary>{t('adminWorkflow.editRevision')}</summary>
          <p>{t('adminWorkflow.revisionHelp')}</p>
          {(Object.keys(revisionDraft) as Array<keyof typeof revisionDraft>).map(key => <label key={key} className="block mt-2">{t(`adminWorkflow.revision_${key}`)}<textarea className="input-field block w-full" value={revisionDraft[key]} onChange={e => setRevisionDraft(prev => ({ ...prev, [key]: e.target.value }))} /></label>)}
          {revisionOptions.map((option, index) => <fieldset key={option.id} className="mt-3 border border-slate-700 p-2">
            <legend>{l('Revisión de opción', 'Option revision')} {option.optionLabel}</legend>
            <label className="block">{l('Revisión opción', 'Revise option')} {option.optionLabel} EN<textarea className="input-field w-full" value={option.optionTextEn} onChange={e => setRevisionOptions(previous => previous.map((value, i) => i === index ? { ...value, optionTextEn: e.target.value } : value))} /></label>
            <label className="block">{l('Revisión opción', 'Revise option')} {option.optionLabel} ES<textarea className="input-field w-full" value={option.optionTextEs} onChange={e => setRevisionOptions(previous => previous.map((value, i) => i === index ? { ...value, optionTextEs: e.target.value } : value))} /></label>
            <label><input type={reviewDetail.questionType === 'multiple_choice' ? 'checkbox' : 'radio'} name="revision-correct" checked={option.isCorrect} onChange={e => setRevisionOptions(previous => previous.map((value, i) => reviewDetail.questionType === 'multiple_choice' ? i === index ? { ...value, isCorrect: e.target.checked } : value : { ...value, isCorrect: i === index }))} /> {l('Correcta de revisión', 'Revision correct')} {option.optionLabel}</label>
          </fieldset>)}
          <button className="btn-secondary mt-3" disabled={reviewBusy || !revisionChanged || revisionDraft.statementEn.trim().length < 5 || revisionDraft.statementEs.trim().length < 5} onClick={saveRevision}>{t('adminWorkflow.saveRevision')}</button>
        </details>}
        {revisionChanged && <p role="status">{t('adminWorkflow.saveRevisionFirst')}</p>}
        <button type="button" className="btn-secondary" disabled={!reviewDetail || reviewBusy || revisionChanged} onClick={async () => {
          if (!reviewTarget) return;
          setReviewBusy(true);
          try {
            const res = await api.validateQuestion(reviewTarget.id);
            setValidationMessage(res.success && res.data ? res.data.valid ? l('Comprobaciones automáticas correctas. La revisión técnica y de traducción sigue siendo necesaria.', 'Automated checks passed. Technical and translation review is still required.') : [...res.data.answerValidation.errors, ...(res.data.subnetValidation?.errors || [])].join(' · ') : res.error || l('No se pudo comprobar.', 'Unable to check.'));
          } finally { setReviewBusy(false); }
        }}>{l('Ejecutar comprobaciones', 'Run checks')}</button>
        {validationMessage && <p role="status">{validationMessage}</p>}
        <label className="block">{t('adminWorkflow.notes')}<textarea className="input-field block w-full" minLength={20} value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} /></label>
        <label className="block">{t('adminWorkflow.evidence')}<input className="input-field block w-full" type="url" value={reviewEvidence} onChange={e => setReviewEvidence(e.target.value)} /></label>
        {reviewTarget.status === 'validated' && <label className="block"><input type="checkbox" checked={reviewConfirmed} onChange={e => setReviewConfirmed(e.target.checked)} /> {t('adminWorkflow.confirm')}</label>}
        <button className="btn-primary" disabled={reviewBusy || !reviewDetail || revisionChanged || reviewNotes.trim().length < 20 || (reviewTarget.status === 'validated' && (!reviewConfirmed || !reviewEvidence.startsWith('https://')))} onClick={submitReview}>{t('adminWorkflow.save')}</button>
        <button className="btn-secondary" onClick={() => setReviewTarget(null)}>{t('common.cancel')}</button>
      </section>}
      {/* Tab 1: Question Approval & Management */}
      {activeTab === 'questions' && (
        <div className="card p-0 overflow-hidden bg-slate-800/90 border-slate-700/80 shadow-xl">
          <div className="p-4 flex flex-wrap gap-3">
            <label>{l('Buscar preguntas', 'Search questions')}<input className="input-field" value={questionSearch} onChange={e => { setQuestionSearch(e.target.value); setQuestionPage(1); }} /></label>
            <label>{l('Estado de revisión', 'Review status')}<select className="input-field" value={questionStatus} onChange={e => { setQuestionStatus(e.target.value); setQuestionPage(1); }}>
              <option value="">{l('Todos', 'All')}</option><option value="pending_review">{l('Pendientes', 'Pending')}</option><option value="validated">{l('Aprobadas', 'Approved')}</option><option value="draft">{l('Borradores', 'Drafts')}</option><option value="rejected">{l('Rechazadas', 'Rejected')}</option>
            </select></label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Statement</th>
                  <th className="py-3.5 px-4 font-semibold">Domain</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loadingQuestions ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin mr-2">⏳</div>
                      <span>{t('common.loading')}</span>
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No questions found in bank.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-700/20">
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-medium text-slate-200 line-clamp-2">{q.statement}</div>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {q.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-cyan-400 font-medium">{q.topicName || q.examArea}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{q.questionType}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            q.validationStatus === 'validated'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                              : q.validationStatus === 'pending_review'
                              ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                              : 'bg-red-950 text-red-400 border-red-500/40'
                          }`}
                        >
                          {q.validationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Approve / Validate"
                            onClick={() => handleUpdateStatus(q.id, 'validated')}
                            className="p-1 rounded bg-emerald-950 hover:bg-emerald-800 text-emerald-400 hover:text-white border border-emerald-700"
                          >
                            <CheckIcon size={14} />
                          </button>
                          <button
                            type="button"
                            title="Reject"
                            onClick={() => handleUpdateStatus(q.id, 'rejected')}
                            className="p-1 rounded bg-red-950 hover:bg-red-800 text-red-400 hover:text-white border border-red-700"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <nav aria-label={l('Paginación de preguntas', 'Question pagination')} className="p-4 flex gap-3 items-center flex-wrap">
            <button type="button" className="btn-secondary" disabled={loadingQuestions || questionPage <= 1} onClick={() => setQuestionPage(value => value - 1)}>{l('Página anterior', 'Previous page')}</button>
            <span>{l('Página', 'Page')} {questionPage} / {Math.max(1, pagination?.totalPages || 1)} · {pagination?.totalItems || 0} {l('preguntas', 'questions')}</span>
            <button type="button" className="btn-secondary" disabled={loadingQuestions || questionPage >= (pagination?.totalPages || 1)} onClick={() => setQuestionPage(value => value + 1)}>{l('Página siguiente', 'Next page')}</button>
          </nav>
        </div>
      )}

      {/* Tab 2: Question Import */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadIcon size={20} className="text-cyan-400" />
              <span>{t('admin.import.title')}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('admin.import.instructions')} {l('Se admite una lista JSON o un lote con questions. También CSV con la plantilla descargable. La generación automática con IA no está disponible.', 'A JSON array or a batch with questions is supported. CSV with the downloadable template is also supported. Automatic AI generation is not available.')}
            </p>

            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/40 transition-colors">
              <input
                type="file"
                accept=".json,.csv,application/json,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="json-file-input"
              />
              <label htmlFor="json-file-input" className="cursor-pointer block">
                <UploadIcon size={32} className="text-slate-400 mx-auto mb-2" />
                <span className="text-sm font-semibold text-cyan-400">
                  {t('admin.import.dropzone')}
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  {l('JSON o CSV UTF-8 · máximo 2 MiB por archivo', 'JSON or UTF-8 CSV · maximum 2 MiB per file')}
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label>{l('Formato de importación', 'Import format')}<select className="input-field ml-2" value={importFormat} onChange={e => { setImportFormat(e.target.value as 'json' | 'csv'); setImportError(null); setImportResult(null); }}><option value="json">JSON</option><option value="csv">CSV</option></select></label>
              <a className="text-cyan-300 underline" href={'data:text/csv;charset=utf-8,' + encodeURIComponent('\uFEFF' + QUESTION_CSV_TEMPLATE)} download="plantilla-preguntas.csv">{l('Descargar plantilla CSV', 'Download CSV template')}</a>
            </div>
            {importFormat === 'csv' && <p className="text-sm text-slate-300">{l('Usa comas como separador y UTF-8. correctAnswers: A para una respuesta o A|C para varias. Completa las opciones en ambos idiomas. Los candidatos se guardan pendientes de revisión.', 'Use commas and UTF-8. correctAnswers: A for one answer or A|C for several. Fill options in both languages. Candidates are saved pending review.')}</p>}
            {/* Textarea Preview / Manual Paste */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('admin.import.preview')} ({importFormat.toUpperCase()})
              </label>
              <textarea
                aria-label={l('Contenido de importación', 'Import content')}
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[
  {
    "statementEn": "Which command configures OSPF area 0 on interface GigabitEthernet0/0?",
    "statementEs": "¿Qué comando configura OSPF área 0 en la interfaz GigabitEthernet0/0?",
    "questionType": "single_choice",
    "difficulty": "intermediate",
    "primaryTopicExamArea": "ip_connectivity",
    "options": [
      { "optionLabel": "A", "optionTextEn": "ip ospf 1 area 0", "optionTextEs": "ip ospf 1 area 0", "isCorrect": true },
      { "optionLabel": "B", "optionTextEn": "router ospf area 0", "optionTextEs": "router ospf area 0", "isCorrect": false }
    ]
  }
]'
                className="input-field font-mono text-xs"
              />
            </div>

            {importError && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangleIcon size={16} className="text-red-400 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={!jsonInput.trim() || isImporting}
              aria-label={l('Procesar importación', 'Process import')}
              onClick={handleProcessImport}
              className="btn-primary"
            >
              <span>{isImporting ? t('admin.import.importing') : t('admin.import.button')}</span>
            </button>
          </div>

          {/* Import Results Banner */}
          {importResult && (
            <div className="card bg-slate-900 border-emerald-500/40 p-6 space-y-4">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircleIcon size={20} />
                <span>{t('admin.import.success')}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block">Total Received</span>
                  <span className="text-lg font-bold text-white font-mono">{importResult.totalReceived}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block">Imported Valid</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">{importResult.imported}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block">Duplicates</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">{importResult.duplicates}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block">Rejected</span>
                  <span className="text-lg font-bold text-red-400 font-mono">{importResult.rejected}</span>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-red-400 block">Errors detail:</span>
                  <div className="max-h-40 overflow-y-auto space-y-1 text-xs text-slate-300 font-mono">
                    {importResult.errors.map((err, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950 border border-red-900/30">
                        Item #{err.index}: {err.reason} ({err.statement})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Statistics */}
      {activeTab === 'statistics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card border-slate-700/60 bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-400">{t('admin.stats.totalInBank')}</span>
              <div className="text-3xl font-extrabold text-white font-mono mt-2">{stats.totalQuestions}</div>
            </div>
            <div className="card border-slate-700/60 bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-400">{t('admin.stats.validated')}</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">{stats.validatedQuestions}</div>
            </div>
            <div className="card border-slate-700/60 bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-400">{t('admin.stats.pending')}</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{stats.pendingQuestions}</div>
            </div>
            <div className="card border-slate-700/60 bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-400">{t('admin.stats.rejected')}</span>
              <div className="text-3xl font-extrabold text-red-400 font-mono mt-2">{stats.rejectedQuestions}</div>
            </div>
          </div>

          {stats.coverageByArea && (
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">
                {t('admin.stats.coverageTitle')}
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.coverageByArea).map(([areaKey, count]) => {
                  const area = areaKey as ExamArea;
                  const label = EXAM_AREA_LABELS[area] ? EXAM_AREA_LABELS[area][language] : areaKey;
                  return (
                    <div key={areaKey} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs font-semibold text-slate-200">{label}</span>
                      <span className="text-sm font-bold text-cyan-400 font-mono">{count as number} questions</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
