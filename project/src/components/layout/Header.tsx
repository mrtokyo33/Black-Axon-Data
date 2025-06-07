import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const location = useLocation();
  const { language, changeLanguage, translations } = useLanguage();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { name: translations.nav.home, path: '/' },
    { name: translations.nav.learn, path: '/learn' },
    { name: translations.nav.practice, path: '/practice' },
    { name: translations.nav.create, path: '/create' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-darkgray">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/black-axon-logo.svg" alt="Black Axon Academy" className="w-10 h-10" />
            <span className="font-orbitron text-2xl font-bold text-yellow neon-glow">BLACK AXON ACADEMY</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-rajdhani text-lg font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-yellow neon-glow'
                    : 'text-white hover:text-yellow'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center space-x-2 text-white hover:text-yellow transition-colors duration-200"
              >
                <Globe size={22} />
                <span className="uppercase">{language}</span>
              </button>
              
              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-darkgray border border-yellow/30 rounded-md shadow-lg overflow-hidden z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        changeLanguage('pt');
                        setShowLangDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-yellow/10 hover:text-yellow"
                    >
                      Português
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setShowLangDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-yellow/10 hover:text-yellow"
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ru');
                        setShowLangDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-yellow/10 hover:text-yellow"
                    >
                      Русский
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-yellow transition-colors duration-200"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-darkgray border-b border-yellow/30"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`font-rajdhani font-medium text-lg px-3 py-2 rounded transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-yellow bg-yellow/10 neon-glow'
                      : 'text-white hover:text-yellow hover:bg-yellow/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <hr className="border-yellow/20" />
              
              {/* Mobile Language Selector */}
              <div className="flex flex-col space-y-2 py-2">
                <p className="text-sm text-yellow/70">{translations.language}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => changeLanguage('pt')}
                    className={`px-3 py-1 rounded text-sm ${
                      language === 'pt'
                        ? 'bg-yellow/20 text-yellow border border-yellow/50'
                        : 'text-white hover:bg-yellow/10'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`px-3 py-1 rounded text-sm ${
                      language === 'en'
                        ? 'bg-yellow/20 text-yellow border border-yellow/50'
                        : 'text-white hover:bg-yellow/10'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLanguage('ru')}
                    className={`px-3 py-1 rounded text-sm ${
                      language === 'ru'
                        ? 'bg-yellow/20 text-yellow border border-yellow/50'
                        : 'text-white hover:bg-yellow/10'
                    }`}
                  >
                    RU
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;