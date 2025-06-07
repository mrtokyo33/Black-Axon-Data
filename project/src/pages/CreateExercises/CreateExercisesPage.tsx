import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const CreateExercisesPage: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 circuit-bg opacity-20 z-0"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-8 z-10"
      >
        <div className="bg-gradient-to-br from-black to-darkgray border border-yellow/30 rounded-lg overflow-hidden">
          <div className="p-8 text-center">
            <div className="relative mb-6 mx-auto w-24 h-24 rounded-full bg-yellow/10 border-2 border-yellow flex items-center justify-center">
              <Lock size={40} className="text-yellow" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-yellow"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255, 215, 0, 0)",
                    "0 0 0 10px rgba(255, 215, 0, 0.1)",
                    "0 0 0 20px rgba(255, 215, 0, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </div>
            
            <h1 className="text-3xl font-orbitron text-yellow neon-glow mb-4">
              {translations.create.premiumRequired}
            </h1>
            
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              {translations.create.description}
            </p>
            
            <div className="bg-black/50 border border-yellow/20 rounded-lg p-6 mb-8">
              <h3 className="font-orbitron text-xl text-white mb-4">
                <span className="text-yellow">Premium</span> Features
              </h3>
              
              <ul className="space-y-3 text-left">
                <li className="flex items-start">
                  <Sparkles size={18} className="text-yellow mt-1 mr-2 flex-shrink-0" />
                  <span className="text-white/90">
                    Create custom exercises with adjustable difficulty levels
                  </span>
                </li>
                <li className="flex items-start">
                  <Sparkles size={18} className="text-yellow mt-1 mr-2 flex-shrink-0" />
                  <span className="text-white/90">
                    Use AI to generate problems tailored to your learning needs
                  </span>
                </li>
                <li className="flex items-start">
                  <Sparkles size={18} className="text-yellow mt-1 mr-2 flex-shrink-0" />
                  <span className="text-white/90">
                    Save and share your exercise collections with others
                  </span>
                </li>
                <li className="flex items-start">
                  <Sparkles size={18} className="text-yellow mt-1 mr-2 flex-shrink-0" />
                  <span className="text-white/90">
                    Track your performance and progress over time
                  </span>
                </li>
              </ul>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="neon-button px-8 py-3 font-rajdhani font-bold"
              onClick={() => navigate('/premium')}
            >
              {translations.create.button}
            </motion.button>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow to-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateExercisesPage;