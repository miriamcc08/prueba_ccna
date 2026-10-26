import React, { useEffect, useState } from 'react';
import { Difficulty, QuestionType, TopicWithCount } from '@shared/types';
import api from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

type Option = { optionTextEn: string; optionTextEs: string; isCorrect: boolean };
const emptyOptions = (): Option[] => Array.from({ length: 4 }, () => ({ optionTextEn: '', optionTextEs: '', isCorrect: false }));

export default function AdminQuestionEditor({ onCreated }: { onCreated: () => void }) {
  const { language } = useTranslation();
  const l = (es: string, en: string) => language === 'es' ? es : en;
  const [topics, setTopics] = useState<TopicWithCount[]>([]);
  const [topicId, setTopicId] = useState('');
  const [type, setType] = useState<QuestionType>('single_choice');
  const [difficulty, setDifficulty] = useState<Difficulty>('basic');
  const [statementEn, setStatementEn] = useState('');
  const [statementEs, setStatementEs] = useState('');
  const [explanationEn, setExplanationEn] = useState('');
  const [explanationEs, setExplanationEs] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceLicense, setSourceLicense] = useState('');
  const [family, setFamily] = useState('');
  const [options, setOptions] = useState<Option[]>(emptyOptions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api.getTopics().then(res => {
      if (!active) return;
      if (res.success && res.data) { setTopics(res.data); setTopicId(res.data[0]?.id || ''); }
      else setError(res.error || 'Unable to load topics.');
    });
    return () => { active = false; };
  }, []);
  const update = (index: number, changes: Partial<Option>) => setOptions(previous => previous.map((option, i) => i === index ? { ...option, ...changes } : option));
  const changeType = (value: QuestionType) => {
    setType(value);
    if (value === 'true_false') setOptions([
      { optionTextEn: 'True', optionTextEs: 'Verdadero', isCorrect: false },
      { optionTextEn: 'False', optionTextEs: 'Falso', isCorrect: false },
    ]);
    else setOptions(previous => previous.map(option => ({ ...option, isCorrect: false })));
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    const correct = options.filter(o => o.isCorrect).length;
    if ((type === 'multiple_choice' && correct < 2) || (type !== 'multiple_choice' && correct !== 1)) {
      setError(l('Marca una respuesta correcta, o al menos dos para selección múltiple.', 'Mark one correct answer, or at least two for multiple selection.')); return;
    }
    if (!sourceUrl.startsWith('https://')) { setError(l('La referencia debe usar HTTPS.', 'The reference must use HTTPS.')); return; }
    setBusy(true);
    try {
      const res = await api.createQuestion({
        statementEn: statementEn.trim(), statementEs: statementEs.trim(), questionType: type, difficulty,
        primaryTopicId: topicId, validationStatus: 'pending_review',
        multipleAnswerCount: type === 'multiple_choice' ? correct : null,
        explanationEn: explanationEn.trim(), explanationEs: explanationEs.trim(), sourceUrl, sourceLicense: sourceLicense.trim(),
        ...(family.trim() ? { questionFamilyId: family.trim() } : {}),
        options: options.map((option, index) => ({ ...option, optionLabel: String.fromCharCode(65 + index) })),
      });
      if (res.success) onCreated();
      else setError([res.error, res.message].filter(Boolean).join(': '));
    } finally { setBusy(false); }
  };
  const types: QuestionType[] = ['single_choice', 'multiple_choice', 'true_false', 'subnetting', 'ipv4_calculation', 'ipv6_addressing', 'routing_table', 'ios_commands', 'router_config', 'switch_config', 'troubleshooting', 'topology_analysis', 'network_security', 'automation'];
  const typeNames: Record<string, string> = { single_choice: l('Selección única', 'Single choice'), multiple_choice: l('Selección múltiple', 'Multiple selection'), true_false: l('Verdadero o falso', 'True or false'), subnetting: 'Subnetting', ipv4_calculation: l('Cálculo IPv4', 'IPv4 calculation'), ipv6_addressing: l('Direccionamiento IPv6', 'IPv6 addressing'), routing_table: l('Tabla de routing', 'Routing table'), ios_commands: l('Comandos IOS', 'IOS commands'), router_config: l('Configuración de router', 'Router configuration'), switch_config: l('Configuración de switch', 'Switch configuration'), troubleshooting: 'Troubleshooting', topology_analysis: l('Análisis de topología', 'Topology analysis'), network_security: l('Seguridad de redes', 'Network security'), automation: l('Automatización', 'Automation') };
  return <form className="card space-y-4" onSubmit={submit} aria-label={l('Crear pregunta', 'Create question')}>
    <h2 className="text-lg font-bold">{l('Crear pregunta', 'Create question')}</h2>
    <p>{l('Redacta ambos idiomas y marca las respuestas. Se guardará pendiente de revisión; aprobarla es un paso separado.', 'Write both languages and select the answers. It will be saved for review; approval is a separate step.')}</p>
    <fieldset disabled={busy} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <label>{l('Tema principal', 'Primary topic')}<select className="input-field w-full" required value={topicId} onChange={e => setTopicId(e.target.value)}>{!topics.length && <option value="">{l('Cargando temas', 'Loading topics')}</option>}{topics.map(topic => <option key={topic.id} value={topic.id}>{language === 'es' ? topic.nameEs : topic.nameEn}</option>)}</select></label>
        <label>{l('Tipo de pregunta', 'Question type')}<select className="input-field w-full" value={type} onChange={e => changeType(e.target.value as QuestionType)}>{types.map(value => <option key={value} value={value}>{typeNames[value]}</option>)}</select></label>
        <label>{l('Dificultad', 'Difficulty')}<select className="input-field w-full" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}><option value="basic">{l('Básica', 'Basic')}</option><option value="intermediate">{l('Intermedia', 'Intermediate')}</option><option value="advanced">{l('Avanzada', 'Advanced')}</option></select></label>
      </div>
      <label className="block">{l('Enunciado EN', 'Statement EN')}<textarea className="input-field w-full" required minLength={5} value={statementEn} onChange={e => setStatementEn(e.target.value)} /></label>
      <label className="block">{l('Enunciado ES', 'Statement ES')}<textarea className="input-field w-full" required minLength={5} value={statementEs} onChange={e => setStatementEs(e.target.value)} /></label>
      {type === 'multiple_choice' && <p>{l('Indica también en ambos enunciados cuántas respuestas se deben seleccionar.', 'Also state in both statements how many answers to select.')}</p>}
      {options.map((option, index) => <fieldset key={index} className="border border-slate-600 rounded p-3 grid sm:grid-cols-2 gap-3">
        <legend>{l('Opción', 'Option')} {String.fromCharCode(65 + index)}</legend>
        <label>{l('Opción', 'Option')} {String.fromCharCode(65 + index)} — EN<input className="input-field w-full" required value={option.optionTextEn} onChange={e => update(index, { optionTextEn: e.target.value })} /></label>
        <label>{l('Opción', 'Option')} {String.fromCharCode(65 + index)} — ES<input className="input-field w-full" required value={option.optionTextEs} onChange={e => update(index, { optionTextEs: e.target.value })} /></label>
        <label><input type={type === 'multiple_choice' ? 'checkbox' : 'radio'} name="correct-answer" checked={option.isCorrect} onChange={e => type === 'multiple_choice' ? update(index, { isCorrect: e.target.checked }) : setOptions(previous => previous.map((value, i) => ({ ...value, isCorrect: i === index })))} /> {l('Correcta', 'Correct')} {String.fromCharCode(65 + index)}</label>
        {type !== 'true_false' && options.length > 2 && <button className="btn-secondary" type="button" onClick={() => setOptions(previous => previous.filter((_, i) => i !== index))}>{l('Quitar opción', 'Remove option')} {String.fromCharCode(65 + index)}</button>}
      </fieldset>)}
      {type !== 'true_false' && options.length < 6 && <button className="btn-secondary" type="button" onClick={() => setOptions(previous => [...previous, { optionTextEn: '', optionTextEs: '', isCorrect: false }])}>{l('Añadir opción', 'Add option')}</button>}
      <label className="block">{l('Explicación EN', 'Explanation EN')}<textarea className="input-field w-full" required minLength={5} value={explanationEn} onChange={e => setExplanationEn(e.target.value)} /></label>
      <label className="block">{l('Explicación ES', 'Explanation ES')}<textarea className="input-field w-full" required minLength={5} value={explanationEs} onChange={e => setExplanationEs(e.target.value)} /></label>
      <label className="block">{l('Referencia técnica HTTPS', 'HTTPS technical reference')}<input className="input-field w-full" type="url" pattern="https://.*" required value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} /></label>
      <label className="block">{l('Autoría o licencia', 'Authorship or license')}<input className="input-field w-full" required value={sourceLicense} onChange={e => setSourceLicense(e.target.value)} placeholder={l('Autoría propia o autorización de reutilización', 'Original authorship or permission to reuse')} /></label>
      <label className="block">{l('Familia de ejercicio (opcional)', 'Exercise family (optional)')}<input className="input-field w-full" value={family} onChange={e => setFamily(e.target.value)} /></label>
      <button className="btn-primary" type="submit" disabled={!topicId}>{busy ? l('Guardando…', 'Saving…') : l('Guardar pendiente de revisión', 'Save for review')}</button>
    </fieldset>
    {error && <p role="alert" className="text-red-300">{error}</p>}
  </form>;
}
