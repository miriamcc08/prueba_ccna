import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { NetworkIcon, AlertCircleIcon, ShieldIcon } from '../components/Icons';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8 card bg-slate-800/95 border-slate-700/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center mb-4">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <NetworkIcon size={24} className="text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {(formError || error) && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircleIcon size={18} className="text-red-400 flex-shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {t('auth.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@ccna-prep.com"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {t('auth.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-sm font-bold shadow-md shadow-cyan-500/20 mt-2"
          >
            <span>{isLoading ? t('common.loading') : t('auth.signInButton')}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-700/60">
          <span>{t('auth.noAccount')} </span>
          <Link
            to="/register"
            className="font-bold text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline"
          >
            {t('auth.registerNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
