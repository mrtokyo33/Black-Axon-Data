import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Brain, Target, Rocket, BarChart as ChartBar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PremiumPage: React.FC = () => {
  const { translations } = useLanguage();
  
  const features = [
    {
      icon: <Brain size={24} />,
      title: translations.premium.features.ai.title,
      description: translations.premium.features.ai.description
    },
    {
      icon: <Target size={24} />,
      title: translations.premium.features.path.title,
      description: translations.premium.features.path.description
    },
    {
      icon: <ChartBar size={24} />,
      title: translations.premium.features.analytics.title,
      description: translations.premium.features.analytics.description
    },
    {
      icon: <Rocket size={24} />,
      title: translations.premium.features.support.title,
      description: translations.premium.features.support.description
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-16">
      <div className="absolute inset-0 circuit-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <motion.div
              className="w-20 h-20 rounded-full bg-yellow/20 border-2 border-yellow flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 215, 0, 0)",
                  "0 0 0 10px rgba(255, 215, 0, 0.1)",
                  "0 0 0 0 rgba(255, 215, 0, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Crown size={40} className="text-yellow" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-orbitron text-yellow neon-glow mb-4">
            {translations.premium.title}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {translations.premium.subtitle}
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-darkgray/50 border border-yellow/30 rounded-lg p-6 hover:border-yellow/50 transition-all duration-300"
            >
              <div className="flex items-start">
                <div className="mr-4 text-yellow">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-rajdhani font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg mx-auto bg-gradient-to-br from-black to-darkgray border border-yellow/30 rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-orbitron text-yellow neon-glow mb-2">
                {translations.premium.pricing.title}
              </h2>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-rajdhani font-bold">
                  ${translations.premium.pricing.price}
                </span>
                <span className="text-white/60 ml-2">
                  {translations.premium.pricing.period}
                </span>
              </div>
              <p className="text-white/80">
                {translations.premium.pricing.description}
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {translations.premium.pricing.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <Check size={18} className="text-yellow mr-2 flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-yellow text-black font-rajdhani font-bold rounded-lg hover:bg-yellow-light transition-colors duration-200 flex items-center justify-center"
            >
              <Sparkles size={18} className="mr-2" />
              {translations.premium.pricing.button}
            </motion.button>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow to-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPage;