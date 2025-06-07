import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import NeuralNetwork from '../../components/ui/NeuralNetwork';

const HomePage: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <NeuralNetwork />
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-orbitron text-yellow neon-glow mb-4"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3)",
                  "0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)",
                  "0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {translations.home.hero.title}
            </motion.h1>
            <p className="text-xl text-white/80 mb-12">
              {translations.home.hero.subtitle}
            </p>
            
            <div className="flex items-center justify-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button px-8 py-3 text-lg font-rajdhani font-bold"
                onClick={() => navigate('/learn')}
              >
                <span className="flex items-center">
                  <Book className="mr-2" size={20} />
                  {translations.learn.title}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-70 z-0"></div>
      </section>
      
      {/* Premium Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-black to-black border border-yellow/30 rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-8 md:mb-0 md:mr-12">
                  <h2 className="text-3xl font-orbitron text-yellow neon-glow mb-4">
                    {translations.home.premium.title}
                  </h2>
                  <p className="text-xl text-white/80 mb-6">
                    {translations.home.premium.subtitle}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {translations.home.premium.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="neon-button px-8 py-3 font-rajdhani font-bold"
                    onClick={() => navigate('/premium')}
                  >
                    {translations.home.premium.button}
                  </motion.button>
                </div>
                
                <div className="w-full md:w-1/3">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      boxShadow: [
                        "0 0 10px rgba(255, 215, 0, 0.3)",
                        "0 0 20px rgba(255, 215, 0, 0.6)",
                        "0 0 10px rgba(255, 215, 0, 0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="relative aspect-square rounded-full border-4 border-yellow flex items-center justify-center bg-black/50 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => navigate('/premium')}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow/10 to-transparent"></div>
                    <span className="font-orbitron text-5xl text-yellow neon-glow">PRO</span>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow to-transparent"></div>
          </div>
        </div>
      </section>
      
      {/* Animated background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default HomePage;