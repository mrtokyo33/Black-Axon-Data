import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { LessonData, Difficulty } from '../../types/lessons';
import { loadLessons } from '../../utils/lessonLoader';
import { Star, BookOpen } from 'lucide-react';

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

interface SubjectContentProps {
  subject: Subject;
}

const SubjectContent: React.FC<SubjectContentProps> = ({ subject }) => {
  const [lessons, setLessons] = React.useState<LessonData[]>([]);
  const { translations } = useLanguage();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchLessons = async () => {
      const loadedLessons = loadLessons(getSubjectNumber(subject));
      setLessons(loadedLessons);
    };

    fetchLessons();
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

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'introduction':
        return 'bg-blue-500/20 text-blue-400';
      case 'easy':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      case 'hyperHard':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyStars = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'introduction':
        return null;
      case 'easy':
        return <Star size={14} fill="currentColor" />;
      case 'medium':
        return (
          <>
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </>
        );
      case 'hard':
        return (
          <>
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </>
        );
      case 'hyperHard':
        return (
          <>
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </>
        );
      default:
        return null;
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    const labels = {
      introduction: 'Introdução',
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      hyperHard: 'Muito Difícil'
    };
    return labels[difficulty] || difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
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

  const handleLessonClick = (lesson: LessonData) => {
    navigate(`/lesson/${getSubjectNumber(subject)}?id=${lesson.id}`);
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
            {translations.learn.subjects[subject]}
          </h2>
          <p className="text-white/80">
            {translations.learn.welcomeMessages[subject]}
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      {lessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLessonClick(lesson)}
              className="bg-darkgray/40 border border-yellow/20 rounded-lg p-6 hover:border-yellow/40 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-orbitron text-white group-hover:text-yellow transition-colors duration-300">
                  {lesson.title}
                </h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${getDifficultyColor(lesson.difficulty as Difficulty)}`}>
                  <span className="flex items-center space-x-1">
                    {getDifficultyStars(lesson.difficulty as Difficulty)}
                  </span>
                  <span className="text-xs font-medium ml-2">
                    {getDifficultyLabel(lesson.difficulty as Difficulty)}
                  </span>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-4">
                {lesson.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-white/70">
                  <BookOpen size={14} className="mr-1" />
                  <span className="text-sm">Lição</span>
                </div>
                <span className="text-yellow text-sm group-hover:text-yellow-light">
                  Aprender →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white/60 py-12">
          Nenhuma lição disponível ainda.
        </div>
      )}
    </motion.div>
  );
};

export default SubjectContent;