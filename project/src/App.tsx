import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import LearnPage from './pages/Learn/LearnPage';
import LessonPage from './pages/Learn/LessonPage';
import PracticePage from './pages/Practice/PracticePage';
import PracticeExercisePage from './pages/Practice/PracticeExercisePage';
import CreateExercisesPage from './pages/CreateExercises/CreateExercisesPage';
import PremiumPage from './pages/Premium/PremiumPage';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/lesson/:subject" element={<LessonPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice-exercise/:subject" element={<PracticeExercisePage />} />
            <Route path="/create" element={<CreateExercisesPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </Layout>
      </LanguageProvider>
    </Router>
  );
}

export default App;