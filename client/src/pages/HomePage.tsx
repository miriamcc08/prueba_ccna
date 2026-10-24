import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ExamHistoryItem } from '@shared/types';
import {
  NetworkIcon,
  PlayIcon,
  BookOpenIcon,
  RefreshIcon,
  BarChartIcon,
  TerminalIcon,
  ShieldIcon,
  AwardIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '../components/Icons';

export const HomePage: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingStats(true);
      api.getExamHistory()
        .then((res) => {
          if (res.success && res.data) {
            setHistory(res.data);
          }
        })
        .finally(() => setLoadingStats(false));
    }
  }, [isAuthenticated]);

  const totalExams = history.length;
  const avgScore = totalExams > 0
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalExams)
    : 0;
  const totalQuestionsPracticed = history.reduce((sum, h) => sum + h.questionCount, 0);
  const readinessPercentage = Math.min(100, Math.round(avgScore * 0.95 + Math.min(totalExams * 5, 20)));

  const actionCards = [
    {
      id: 'full_simulation',
      title: t('home.startSimulation'),
      description: t('home.startSimulationDesc'),
      icon: PlayIcon,
      color: 'from-teal-500 to-cyan-500',
      badge: '120 min • 100 Qs',
      action: () => navigate('/config?mode=full_simulation'),
    },
    {
      id: 'topic_practice',
      title: t('home.practiceByTopic'),
      description: t('home.practiceByTopicDesc'),
      icon: BookOpenIcon,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Custom Domains',
      action: () => navigate('/config?mode=topic_practice'),
    },
    {
      id: 'subnetting_practice',
      title: t('home.quickSubnetting'),
      description: t('home.quickSubnettingDesc'),
      icon: TerminalIcon,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Speed Drill',
      action: () => navigate('/config?mode=subnetting_practice'),
    },
    {
      id: 'incorrect_review',
      title: t('home.reviewMistakes'),
      description: t('home.reviewMistakesDesc'),
      icon: RefreshIcon,
      color: 'from-amber-500 to-orange-600',
      badge: 'Adaptive',
      action: () => navigate('/config?mode=incorrect_review'),
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 border border-slate-700/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold mb-6">
            <SparklesIcon size={14} />
            <span>{t('home.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            CCNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">200-301</span> Exam Simulator
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t('home.subtitle')}
          </p>

          {/* Quick Start Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/config?mode=full_simulation')}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center gap-2.5 text-sm sm:text-base group"
            >
              <PlayIcon size={18} className="group-hover:translate-x-0.5 transition-transform" />
              <span>{t('home.startSimulation')}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/config')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <span>{t('nav.config')}</span>
              <ChevronRightIcon size={16} />
            </button>
          </div>

          {/* Language selector prominent on first visit */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center gap-3 text-xs text-slate-400">
            <span>{t('home.chooseLanguagePrompt')}</span>
            <div className="inline-flex rounded-lg bg-slate-900 border border-slate-700 p-0.5 font-medium">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-cyan-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-md transition-all ${
                  language === 'es'
                    ? 'bg-cyan-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* User Stats Overview (if logged in or taken tests) */}
      {isAuthenticated && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card border-slate-700/60 bg-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>{t('home.stats.totalExams')}</span>
              <AwardIcon size={18} className="text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingStats ? '...' : totalExams}
            </div>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>{t('home.stats.avgScore')}</span>
              <BarChartIcon size={18} className="text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {loadingStats ? '...' : `${avgScore}%`}
            </div>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>{t('home.stats.questionsPracticed')}</span>
              <BookOpenIcon size={18} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingStats ? '...' : totalQuestionsPracticed}
            </div>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>{t('home.stats.readiness')}</span>
              <ShieldIcon size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {loadingStats ? '...' : `${readinessPercentage}%`}
            </div>
          </div>
        </section>
      )}

      {/* Quick Action Simulation Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Simulation & Study Modes
            </h2>
            <p className="text-sm text-slate-400">
              Select an exam mode to test your knowledge or target areas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 sm:p-7 hover:border-cyan-500/60 hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} p-0.5 shadow-md flex items-center justify-center text-white`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Start Practice</span>
                  <ChevronRightIcon size={16} className="ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blueprint Domain Highlights */}
      <section className="card bg-slate-800/60 border-slate-700/60">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <NetworkIcon size={20} className="text-cyan-400" />
          <span>CCNA 200-301 Exam Blueprint Structure</span>
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Official Cisco exam domain weight distribution covered in our question bank:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70">
            <div className="text-lg font-extrabold text-cyan-400 font-mono">20%</div>
            <div className="text-xs font-medium text-slate-300 mt-1">Network Fundamentals</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70">
            <div className="text-lg font-extrabold text-cyan-400 font-mono">20%</div>
            <div className="text-xs font-medium text-slate-300 mt-1">Network Access</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70">
            <div className="text-lg font-extrabold text-cyan-400 font-mono">25%</div>
            <div className="text-xs font-medium text-slate-300 mt-1">IP Connectivity</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70">
            <div className="text-lg font-extrabold text-cyan-400 font-mono">10%</div>
            <div className="text-xs font-medium text-slate-300 mt-1">IP Services</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70">
            <div className="text-lg font-extrabold text-cyan-400 font-mono">15%</div>
            <div className="text-xs font-medium text-slate-300 mt-1">Security Fundamentals</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70">
            <div className="text-lg font-extrabold text-cyan-400 font-mono">10%</div>
            <div className="text-xs font-medium text-slate-300 mt-1">Automation &amp; Programmability</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
