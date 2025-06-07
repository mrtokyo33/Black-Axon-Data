import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import SubjectSidebar from './SubjectSidebar';
import SubjectContent from './SubjectContent';

type Subject = keyof typeof import('../../locales/en').enTranslations.learn.subjects;

const LearnPage: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<Subject>('physics');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow to-transparent"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Subject Sidebar */}
          <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
            <SubjectSidebar
              activeSubject={activeSubject}
              onSubjectChange={handleSubjectChange}
            />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-orbitron text-white mb-4">
                <span className="text-yellow neon-glow">{translations.learn.subjects[activeSubject]}</span>
              </h1>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={translations.learn.searchPlaceholder}
                  className="w-full px-4 py-2 pl-10 bg-darkgray/50 border border-yellow/30 rounded focus:outline-none focus:border-yellow/80 text-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow/60" size={18} />
              </div>
            </div>
            
            {/* Subject Content */}
            <SubjectContent subject={activeSubject} />

            {/* Back Button */}
            <div className="mt-12 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center px-6 py-3 bg-yellow/10 text-yellow border border-yellow/30 rounded-lg hover:bg-yellow/20 transition-all duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                {translations.nav.home}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background circuit pattern */}
      <div className="absolute inset-0 circuit-bg opacity-20 z-0 pointer-events-none"></div>
    </div>
  );
};

export default LearnPage;