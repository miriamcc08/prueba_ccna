import { useEffect, useState } from 'react';
import { ExamConfig, TopicWithCount } from '@shared/types';
import api from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

export default function StudyTopicPractice({ examId, config, onCreated }: { examId: string; config: ExamConfig; onCreated: (id: string) => void }) {
  const { language } = useTranslation();
  const l = (es: string, en: string) => language === 'es' ? es : en;
  const [topics, setTopics] = useState<TopicWithCount[]>([]);
  const [topicId, setTopicId] = useState('');
  const [count, setCount] = useState(1);
  const [available, setAvailable] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retryVersion, setRetryVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    api.getTopics().then(result => {
      if (!active) return;
      if (result.success && result.data) { setTopics(result.data); setTopicId(previous => result.data!.some(topic => topic.id === previous) ? previous : result.data![0]?.id || ''); }
      else setError(result.error || l('No se pudieron cargar los temas.', 'Unable to load topics.'));
      setLoading(false);
    });
    return () => { active = false; };
  }, [retryVersion]);
  useEffect(() => {
    let active = true;
    setAvailable(null);
    if (topicId) {
      setError('');
      api.getExamAvailability({ ...config, mode: 'topic_practice', topics: [topicId], questionCount: 1, randomize: true, groupByTopic: false }).then(result => {
        if (!active) return;
        if (result.success && result.data) setAvailable(result.data.available);
        else setError(result.error || l('No se pudo comprobar la disponibilidad.', 'Unable to check availability.'));
      });
    }
    return () => { active = false; };
  }, [topicId, config, retryVersion]);
  const valid = !!topicId && available !== null && count >= 1 && Number.isInteger(count) && count <= Math.min(200, available);
  return <form className="card space-y-3" aria-label={l('Nueva práctica por tema', 'New topic practice')} onSubmit={async event => {
    event.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError('');
    try {
      const result = await api.changeStudyTopic(examId, topicId, count);
      if (result.success && result.data) onCreated(result.data.examId);
      else setError(result.error || l('No se pudo crear la práctica.', 'Unable to create practice.'));
    } finally { setBusy(false); }
  }}>
    <p>{l('Se crea otra práctica con el tema elegido y tus preferencias. El intento anterior se conserva; si tenía reloj, continúa avanzando.', 'A separate practice uses the chosen topic and your preferences. The original attempt is preserved; its clock keeps running if timed.')}</p>
    <fieldset disabled={busy || loading} className="flex flex-wrap gap-4 items-end">
      <label>{l('Tema de la nueva práctica', 'New practice topic')}<select required className="input-field block" value={topicId} onChange={event => { setTopicId(event.target.value); setCount(1); }}>
        {!topics.length && <option value="">{loading ? l('Cargando…', 'Loading…') : l('Sin temas disponibles', 'No topics available')}</option>}
        {topics.map(topic => <option key={topic.id} value={topic.id}>{language === 'es' ? topic.nameEs : topic.nameEn}</option>)}
      </select></label>
      <label>{l('Preguntas de la nueva práctica', 'New practice questions')}<input className="input-field block" type="number" min={1} max={available === null ? 200 : Math.max(1, Math.min(200, available))} required value={count} onChange={event => setCount(Number(event.target.value))} /></label>
      <button type="submit" className="btn-primary" disabled={!valid || busy}>{busy ? l('Creando práctica…', 'Creating practice…') : l('Iniciar práctica del tema', 'Start topic practice')}</button>
    </fieldset>
    <p role="status">{available === null ? error ? l('Disponibilidad no disponible.', 'Availability unavailable.') : l('Comprobando disponibilidad…', 'Checking availability…') : l(`Familias aprobadas disponibles con esta dificultad: ${available}.`, `Approved families available at this difficulty: ${available}.`)}</p>
    {available === 0 && <p>{l('Elige otro tema: no hay preguntas aprobadas para estos filtros.', 'Choose another topic: no approved questions match these filters.')}</p>}
    {error && <div className="space-y-2"><p role="alert" className="text-red-300">{error}</p><button type="button" className="btn-secondary" disabled={busy || loading} onClick={() => setRetryVersion(version => version + 1)}>{l('Reintentar disponibilidad', 'Retry availability')}</button></div>}
  </form>;
}
