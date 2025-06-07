import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Calculator, Code, Terminal, FlaskRound as Flask, Leaf, BookOpen, Brain, Microscope, BarChart3, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

type Subject = keyof typeof import('../../locales/en').enTranslations.learn.subjects;

interface SubjectSidebarProps {
  activeSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
}

interface SubjectInfo {
  icon: React.ReactNode;
  color: string;
}

const SubjectSidebar: React.FC<SubjectSidebarProps> = ({ activeSubject, onSubjectChange }) => {
  const { translations } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const subjectIcons: Record<Subject, SubjectInfo> = {
    physics: { icon: <Atom size={20} />, color: 'from-blue-500/20 to-blue-500/5' },
    math: { icon: <Calculator size={20} />, color: 'from-purple-500/20 to-purple-500/5' },
    programming: { icon: <Code size={20} />, color: 'from-green-500/20 to-green-500/5' },
    hacking: { icon: <Terminal size={20} />, color: 'from-red-500/20 to-red-500/5' },
    chemistry: { icon: <Flask size={20} />, color: 'from-emerald-500/20 to-emerald-500/5' },
    biology: { icon: <Leaf size={20} />, color: 'from-lime-500/20 to-lime-500/5' },
    philosophy: { icon: <BookOpen size={20} />, color: 'from-amber-500/20 to-amber-500/5' },
    psychology: { icon: <Brain size={20} />, color: 'from-pink-500/20 to-pink-500/5' },
    neuroscience: { icon: <Microscope size={20} />, color: 'from-teal-500/20 to-teal-500/5' },
    economics: { icon: <BarChart3 size={20} />, color: 'from-gray-500/20 to-gray-500/5' },
  };
  
  const subjects = Object.keys(translations.learn.subjects) as Subject[];

  // Mobile subject selector
  const MobileSubjectSelector = () => (
    <div className="md:hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-darkgray/30 border border-yellow/20 rounded-lg text-white"
      >
        <div className="flex items-center">
          {subjectIcons[activeSubject].icon}
          <span className="ml-3">{translations.learn.subjects[activeSubject]}</span>
        </div>
        <ChevronDown
          size={20}
          className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-darkgray/30 border border-yellow/20 rounded-lg overflow-hidden"
          >
            {subjects.map((subject) => (
              <motion.button
                key={subject}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSubjectChange(subject);
                  setIsExpanded(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-left transition-all duration-200
                  ${activeSubject === subject
                    ? 'bg-yellow/20 text-yellow'
                    : 'text-white/80 hover:bg-yellow/10 hover:text-white'
                  }
                `}
              >
                <div className={`mr-3 ${activeSubject === subject ? 'text-yellow' : 'text-white/70'}`}>
                  {subjectIcons[subject].icon}
                </div>
                {translations.learn.subjects[subject]}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:block bg-darkgray/30 border border-yellow/20 rounded-lg p-4">
      <h2 className="font-orbitron text-lg text-yellow mb-4">{translations.learn.title}</h2>
      
      <div className="space-y-2">
        {subjects.map((subject) => (
          <motion.button
            key={subject}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center px-3 py-2 rounded text-left transition-all duration-200
              ${activeSubject === subject
                ? 'bg-gradient-to-r from-yellow/20 to-transparent border-l-2 border-yellow text-yellow'
                : 'hover:bg-gradient-to-r hover:from-yellow/10 hover:to-transparent text-white/80 hover:text-white'
              }
            `}
            onClick={() => onSubjectChange(subject)}
          >
            <div className={`mr-3 ${activeSubject === subject ? 'text-yellow' : 'text-white/70'}`}>
              {subjectIcons[subject].icon}
            </div>
            {translations.learn.subjects[subject]}
          </motion.button>
        ))}
      </div>
    </div>
  );
  
  return (
    <>
      <MobileSubjectSelector />
      <DesktopSidebar />
    </>
  );
};

export default SubjectSidebar;