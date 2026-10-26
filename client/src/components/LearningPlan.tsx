import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningProfile, EXAM_AREA_LABELS } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';

export default function LearningPlan() {
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api.getLearningProfile(language).then(res => {
      if (!active) return;
      if (res.success && res.data) { setProfile(res.data); setError(''); }
      else setError(res.error || t('learning.error'));
    });
    return () => { active = false; };
  }, [language]);
  if (error) return <p role="alert">{error}</p>;
  if (!profile) return <p>{t('common.loading')}</p>;
  return <section className="card space-y-4" aria-label={t('learning.title')}>
    <h2 className="text-xl font-bold">{t('learning.title')}</h2>
    {profile.overallProgress.totalExams === 0 && <p>{t('learning.empty')}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      {profile.studyPlan.slice(0, 3).map(plan => <article key={plan.area} className="p-4 rounded border border-slate-700 space-y-2">
        <h3>{EXAM_AREA_LABELS[plan.area][language]}</h3>
        <p>{plan.message}</p>
        {plan.focusTopics.length > 0 && <p>{plan.focusTopics.join(', ')}</p>}
        <button className="btn-secondary" onClick={() => navigate(`/config?mode=topic_practice&area=${plan.area}`)}>{t('learning.practice')}</button>
      </article>)}
    </div>
    {profile.repeatedErrors.length > 0 && <div><h3>{t('learning.repeated')}</h3><ul>{profile.repeatedErrors.map(item => <li key={item.topicId}>{item.topicName}: {item.errorCount}</li>)}</ul></div>}
    {profile.slowTopics.length > 0 && <div><h3>{t('learning.slow')}</h3><p>{profile.slowTopics.join(', ')}</p></div>}
  </section>;
}
