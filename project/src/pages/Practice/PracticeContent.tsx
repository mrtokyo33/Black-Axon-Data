import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Play, Clock, Trophy, Star } from 'lucide-react';
import { loadPracticeData } from '../../utils/practiceLoader';
import { PracticeData } from '../../types/practice';

// Import banner images
import physicsBanner from '../../assets/images/banners/physics-banner.jpg';
import mathBanner from '../../assets/images/banners/math-banner.jpg';
import programmingBanner from '../../assets/images/banners/programming-banner.jpg';
import hackingBanner from '../../assets/images/banners/hacking-banner.jpg';
import chemistryBanner from '../../assets/images/banners/chemistry-banner.jpg';
import biologyBanner from '../../assets/images/banners/biology-banner.jpg';
import philosophyBanner from '../../assets/images/banners/philosophy-banner.jpg';
import psychologyBanner from '../../assets/images/banners/psychology-banner.jpg';
import neuroscienceBanner from '../../assets/images/banners/neuroscience-banner.jpg';
import economicsBanner from '../../assets/images/banners/economics-banner.jpg';

type Subject = keyof typeof import('../../locales/en').enTranslations.learn.subjects;

interface PracticeContentProps {
  subject: Subject;
  searchTerm: string;
}

const PracticeContent: React.FC<PracticeContentProps> = ({ subject, searchTerm }) => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [practiceData, setPracticeData] = React.useState<PracticeData[]>([]);

  React.useEffect(() => {
    const subjectNumber = getSubjectNumber(subject);
    const data = loadPracticeData(subjectNumber);
    setPracticeData(data);
  }, [subject]);

  const getSubjectNumber = (subjectName: Subject): string => {
    const subjectMap: Record<Subject, string> = {
      physics: '0',
      math: '1',
      programming: '2',
      hacking: '3',
      chemistry: '4',
      biology: '5',
      philosophy: '6',
      psychology: '7',
      neuroscience: '8',
      economics: '9'
    };
    return subjectMap[subjectName];
  };

  const filteredPractices = practiceData.filter(practice =>
    practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} size={14} fill="currentColor" />
    ));
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const subjectImages: Record<Subject, string> = {
    physics: physicsBanner,
    math: mathBanner,
    programming: programmingBanner,
    hacking: hackingBanner,
    chemistry: chemistryBanner,
    biology: biologyBanner,
    philosophy: philosophyBanner,
    psychology: psychologyBanner,
    neuroscience: neuroscienceBanner,
    economics: economicsBanner
  };

  const handlePracticeClick = (practice: PracticeData) => {
    const subjectNumber = getSubjectNumber(subject);
    navigate(`/practice-exercise/${subjectNumber}?id=${practice.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-darkgray/40 border border-yellow/20 rounded-lg overflow-hidden">
        <div className="relative h-48 md:h-72 overflow-hidden">
          <img 
            src={subjectImages[subject]}
            alt={translations.learn.subjects[subject]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkgray to-transparent"></div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-orbitron text-yellow mb-4">
            Exercícios de {translations.learn.subjects[subject]}
          </h2>
          <p className="text-white/80">
            Teste seus conhecimentos com exercícios práticos e desafios em {translations.learn.subjects[subject].toLowerCase()}.
          </p>
        </div>
      </div>

      {/* Practices Grid */}
      {filteredPractices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPractices.map((practice, index) => (
            <motion.div
              key={practice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePracticeClick(practice)}
              className="bg-darkgray/40 border border-yellow/20 rounded-lg p-6 hover:border-yellow/40 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-orbitron text-white group-hover:text-yellow transition-colors duration-300">
                  {practice.title}
                </h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${getDifficultyColor(practice.difficulty)}`}>
                  <span className="flex items-center space-x-1">
                    {getDifficultyStars(practice.difficulty)}
                  </span>
                  <span className="text-xs font-medium ml-2">
                    {getDifficultyLabel(practice.difficulty)}
                  </span>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-4">
                {practice.description}
              </p>

              <div className="flex items-center justify-between text-sm text-white/70">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    ~{Math.ceil(practice.exercises.length * 1.5)} min
                  </div>
                  <div className="flex items-center">
                    <Play size={14} className="mr-1" />
                    {practice.exercises.length} questões
                  </div>
                </div>
                <span className="text-yellow text-sm group-hover:text-yellow-light">
                  Iniciar →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white/60 py-12">
          {searchTerm ? 'Nenhum exercício encontrado.' : 'Nenhum exercício disponível ainda.'}
        </div>
      )}
    </motion.div>
  );
};

export default PracticeContent;