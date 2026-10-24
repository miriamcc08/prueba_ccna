import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../hooks/useAuth';
import {
  NetworkIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  LogOutIcon,
  ShieldIcon,
  BookOpenIcon,
  BarChartIcon,
  LayersIcon,
} from './Icons';

export const Layout: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), exact: true },
    { to: '/config', label: t('nav.config') },
    { to: '/history', label: t('nav.history') },
    { to: '/questions', label: t('nav.questions') },
    ...(isAdmin ? [{ to: '/admin', label: t('nav.admin') }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <NetworkIcon className="text-cyan-400 group-hover:scale-110 transition-transform" size={22} />
                  </div>
                </div>
                <div>
                  <div className="font-extrabold tracking-tight text-lg text-white flex items-center gap-1.5">
                    CCNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">200-301</span>
                  </div>
                  <div className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase">
                    Exam Simulator
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Language Toggle + User Action Menu */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700/60 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    language === 'en'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    language === 'es'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ES
                </button>
              </div>

              {/* User Section */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                      {user.username.slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-slate-200 hidden lg:inline max-w-[120px] truncate">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title={t('nav.logout')}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <LogOutIcon size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow-md shadow-cyan-500/10 transition-all"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-semibold mr-1">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-2 py-0.5 rounded ${language === 'es' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                >
                  ES
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-5 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-4 border-t border-slate-800">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <UserIcon size={18} className="text-cyan-400" />
                    <span className="text-sm font-medium text-slate-200">{user.username}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-sm font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/60 py-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <NetworkIcon size={16} className="text-cyan-400" />
            <span>CCNA 200-301 Preparation Simulator</span>
            <span className="text-slate-600">•</span>
            <span>Cisco Systems Blueprint Compatible</span>
          </div>
          <div>
            Built with React 18, Vite, TypeScript & Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
