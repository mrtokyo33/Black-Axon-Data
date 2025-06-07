import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

interface SubjectCardProps {
  title: string;
  description: string;
  difficulty?: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  onClick?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  description,
  difficulty,
  icon,
  isPremium = false,
  onClick
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'introduction':
        return 'text-blue-400';
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-orange-400';
      case 'hyperHard':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'introduction':
        return <Star size={16} />;
      case 'easy':
        return <Star size={16} />;
      case 'medium':
        return <><Star size={16} /><Star size={16} /></>;
      case 'hard':
        return <><Star size={16} /><Star size={16} /><Star size={16} /></>;
      case 'hyperHard':
        return <Sparkles size={16} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-lg border border-yellow/30
        ${isPremium ? 'bg-gradient-to-br from-darkgray to-black' : 'bg-darkgray/50'}
        transition-all duration-300 cursor-pointer group
      `}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="text-yellow mr-3">{icon}</div>
            <h3 className="font-orbitron text-xl">
              {title}
              {isPremium && (
                <span className="ml-2 text-xs font-rajdhani bg-yellow/20 text-yellow px-2 py-0.5 rounded">
                  PREMIUM
                </span>
              )}
            </h3>
          </div>
          {difficulty && (
            <div className={`flex items-center ${getDifficultyColor(difficulty)}`}>
              {getDifficultyIcon(difficulty)}
            </div>
          )}
        </div>
        
        <p className="text-white/80 text-sm">{description}</p>
        
        <div className="mt-4 flex justify-end">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 text-sm font-medium text-yellow border border-yellow/40 rounded-full
              bg-black/50 hover:bg-yellow/10 transition-all duration-200"
          >
            {isPremium ? 'Get Premium' : 'Explore'}
          </motion.div>
        </div>
      </div>
      
      {/* Bottom glow effect */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow/50"
        initial={{ scaleX: 0.3, opacity: 0.3 }}
        animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Top corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
        <div className={`absolute top-0 right-0 w-16 h-16 rotate-45 translate-x-6 -translate-y-6
          ${isPremium ? 'bg-yellow' : 'bg-yellow/30'}`}
        />
      </div>
    </motion.div>
  );
};

export default SubjectCard;