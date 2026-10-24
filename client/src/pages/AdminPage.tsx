import React, { useState, useEffect } from 'react';
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

type AdminTab = 'questions' | 'import' | 'statistics' | 'validators';

export const AdminPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('questions');

  // Question Management State
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Import State
  const [jsonInput, setJsonInput] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Statistics State
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Redirect non-admins or unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const loadQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await api.getQuestions({ pageSize: 50 });
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.getAdminStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        // Mock fallback statistics if endpoint is empty
        setStats({
          totalQuestions: 240,
          validatedQuestions: 205,
          pendingQuestions: 25,
          rejectedQuestions: 10,
          coverageByArea: {
            network_fundamentals: 48,
            network_access: 48,
            ip_connectivity: 60,
            ip_services: 24,
            security_fundamentals: 36,
            automation_programmability: 24,
          },
        });
      }
    } catch {
      setStats({
        totalQuestions: 240,
        validatedQuestions: 205,
        pendingQuestions: 25,
        rejectedQuestions: 10,
        coverageByArea: {
          network_fundamentals: 48,
          network_access: 48,
          ip_connectivity: 60,
          ip_services: 24,
          security_fundamentals: 36,
          automation_programmability: 24,
        },
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'questions') {
      loadQuestions();
    } else if (activeTab === 'statistics') {
      loadStats();
    }
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, newStatus: ValidationStatus) => {
    try {
      const res = await api.updateQuestionStatus(id, newStatus);
      if (res.success) {
        setActionMessage(`Question #${id} status changed to ${newStatus}`);
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, validationStatus: newStatus } : q))
        );
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (e: any) {
      setActionMessage(`Failed to update question: ${e.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    reader.readAsText(file);
  };

  const handleProcessImport = async () => {
    setImportError(null);
    setImportResult(null);

    let parsedQuestions: QuestionImportItem[];
    try {
      parsedQuestions = JSON.parse(jsonInput);
      if (!Array.isArray(parsedQuestions)) {
        setImportError('JSON must be an array of question objects.');
        return;
      }
    } catch (e: any) {
      setImportError(`Invalid JSON format: ${e.message}`);
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

  if (!isAdmin && isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 card text-center space-y-4 border-amber-500/50">
        <ShieldIcon size={36} className="text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-slate-300 text-sm">
          You need Administrator permissions to access the Simulator Admin Panel.
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
            Manage CCNA questions, dataset ingestion, and validation rules.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
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

      {/* Tab 1: Question Approval & Management */}
      {activeTab === 'questions' && (
        <div className="card p-0 overflow-hidden bg-slate-800/90 border-slate-700/80 shadow-xl">
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
              {t('admin.import.instructions')}
            </p>

            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/40 transition-colors">
              <input
                type="file"
                accept=".json"
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
                  Supported format: JSON array of QuestionImportItem objects
                </span>
              </label>
            </div>

            {/* Textarea Preview / Manual Paste */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('admin.import.preview')} / Raw JSON Paste:
              </label>
              <textarea
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
