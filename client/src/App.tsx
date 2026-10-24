import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ConfigPage from './pages/ConfigPage';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';
import ReviewPage from './pages/ReviewPage';
import QuestionBankPage from './pages/QuestionBankPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/questions" element={<QuestionBankPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Full screen exam view (or inside layout) */}
      <Route element={<Layout />}>
        <Route path="/exam/:id" element={<ExamPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/review/:id" element={<ReviewPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
