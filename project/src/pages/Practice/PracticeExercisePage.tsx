import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { loadPracticeData } from '../../utils/practiceLoader';
import { Exercise, PracticeData, PracticeProgress } from '../../types/practice';

const PracticeExercisePage: React.FC = () => {
  const { subject } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  
  const [practiceData, setPracticeData] = useState<PracticeData | null>(null);
  const [progress, setProgress] = useState<PracticeProgress>({
    currentExercise: 0,
    totalExercises: 0,
    correctAnswers: 0,
    completed: false,
    score: 0
  });
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const practiceId = searchParams.get('id');
    if (!practiceId || !subject) return;

    const practiceList = loadPracticeData(subject);
    const practice = practiceList.find(p => p.id === practiceId);
    
    if (practice) {
      setPracticeData(practice);
      setProgress({
        currentExercise: 0,
        totalExercises: practice.exercises.length,
        correctAnswers: 0,
        completed: false,
        score: 0
      });
    }
  }, [subject, searchParams]);

  const currentExercise = practiceData?.exercises[progress.currentExercise];

  const handleAnswer = () => {
    if (!currentExercise || !userAnswer) return;

    let correct = false;
    
    if (currentExercise.type === 'escolha') {
      correct = userAnswer === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'numero') {
      const userNum = parseFloat(userAnswer.replace(',', '.'));
      const correctNum = parseFloat(currentExercise.correctAnswer);
      correct = !isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.01;
    }

    setIsCorrect(correct);
    setShowResult(true);
    setShowExplanation(true);

    if (correct) {
      setProgress(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1
      }));
    }
  };

  const nextExercise = () => {
    const newProgress = { ...progress };
    
    if (progress.currentExercise < progress.totalExercises - 1) {
      newProgress.currentExercise = progress.currentExercise + 1;
    } else {
      newProgress.completed = true;
      newProgress.score = Math.round((progress.correctAnswers / progress.totalExercises) * 100);
    }

    setProgress(newProgress);
    setUserAnswer('');
    setShowResult(false);
    setShowExplanation(false);
  };

  const resetPractice = () => {
    setProgress({
      currentExercise: 0,
      totalExercises: practiceData?.exercises.length || 0,
      correctAnswers: 0,
      completed: false,
      score: 0
    });
    setUserAnswer('');
    setShowResult(false);
    setShowExplanation(false);
  };

  const renderExercise = () => {
    if (!currentExercise) return null;

    switch (currentExercise.type) {
      case 'escolha':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-quicksand text-white mb-6">
              {currentExercise.question}
            </h3>
            <div className="space-y-3">
              {currentExercise.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    userAnswer === option
                      ? 'border-yellow bg-yellow/10 text-yellow'
                      : 'border-yellow/30 bg-darkgray/30 text-white hover:border-yellow/50 hover:bg-yellow/5'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-medium text-yellow mr-3">
                    {String.fromCharCode(97 + index)})
                  </span> 
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'numero':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-quicksand text-white mb-6">
              {currentExercise.question}
            </h3>
            <div className="flex flex-col items-center space-y-4">
              <input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                className="w-full max-w-xs px-4 py-3 text-center text-xl bg-darkgray border border-yellow/30 rounded-lg text-yellow focus:outline-none focus:border-yellow/80"
                placeholder="Digite o número..."
              />
              <div className="text-sm text-white/60">
                💡 Use vírgula ou ponto para decimais
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!practiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Carregando exercícios...</div>
      </div>
    );
  }

  if (progress.completed) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 circuit-bg opacity-20 z-0"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-darkgray/50 border border-yellow/30 rounded-lg overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="mb-6">
                <Trophy size={64} className="text-yellow mx-auto mb-4" />
                <h1 className="text-3xl font-orbitron text-yellow neon-glow mb-2">
                  Exercício Concluído!
                </h1>
                <p className="text-xl text-white/80">
                  {practiceData.title}
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-6 mb-8">
                <div className="text-4xl font-bold text-yellow mb-2">
                  {progress.score}%
                </div>
                <div className="text-white/80">
                  {progress.correctAnswers} de {progress.totalExercises} questões corretas
                </div>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetPractice}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-yellow/10 text-yellow border border-yellow/30 rounded-lg hover:bg-yellow/20 transition-all duration-200"
                >
                  <RotateCcw size={20} />
                  <span>Refazer Exercício</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/practice')}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-darkgray/50 text-white border border-white/30 rounded-lg hover:bg-darkgray/70 transition-all duration-200"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar às Práticas</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 circuit-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center text-yellow hover:text-yellow-light transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar às Práticas
          </button>
          
          <div className="text-white/60 text-sm">
            {progress.currentExercise + 1} de {progress.totalExercises}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-orbitron text-yellow">
              {practiceData.title}
            </h1>
            <div className="text-white/80">
              {Math.round(((progress.currentExercise + 1) / progress.totalExercises) * 100)}%
            </div>
          </div>
          <div className="w-full bg-darkgray/50 rounded-full h-2">
            <motion.div
              className="bg-yellow h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((progress.currentExercise + 1) / progress.totalExercises) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Exercise Card */}
        <motion.div
          key={progress.currentExercise}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-darkgray/40 border border-yellow/20 rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="mb-8">
              <div className="text-sm text-yellow/70 mb-2">
                Questão {progress.currentExercise + 1}
              </div>
              {renderExercise()}
            </div>

            {/* Answer Button */}
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnswer}
                disabled={!userAnswer}
                className="w-full px-6 py-3 bg-yellow text-black font-medium rounded-lg hover:bg-yellow-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar Resposta
              </motion.button>
            )}

            {/* Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className={`flex items-center space-x-3 p-4 rounded-lg ${
                    isCorrect 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {isCorrect ? <Check size={24} /> : <X size={24} />}
                    <span className="font-medium">
                      {isCorrect ? 'Correto!' : 'Incorreto'}
                    </span>
                    {!isCorrect && currentExercise?.type === 'escolha' && (
                      <span className="text-white/80">
                        - Resposta correta: {currentExercise.correctAnswer}
                      </span>
                    )}
                    {!isCorrect && currentExercise?.type === 'numero' && (
                      <span className="text-white/80">
                        - Resposta correta: {currentExercise.correctAnswer}
                      </span>
                    )}
                  </div>

                  {showExplanation && currentExercise?.explanation && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-blue-400 font-medium mb-2">Explicação:</div>
                      <div className="text-white/90">
                        {currentExercise.explanation}
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextExercise}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-yellow text-black font-medium rounded-lg hover:bg-yellow-light transition-all duration-200"
                  >
                    <span>
                      {progress.currentExercise < progress.totalExercises - 1 
                        ? 'Próxima Questão' 
                        : 'Finalizar'
                      }
                    </span>
                    <ArrowRight size={20} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PracticeExercisePage;