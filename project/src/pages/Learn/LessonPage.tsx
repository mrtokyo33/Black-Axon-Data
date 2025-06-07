import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LessonContent from '../../components/lessons/LessonContent';
import { loadLessons } from '../../utils/lessonLoader';

const LessonPage: React.FC = () => {
  const { subject } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [content, setContent] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');
  const [images, setImages] = React.useState<Record<string, string>>({});
  const [nextLesson, setNextLesson] = React.useState<string | null>(null);
  const [prevLesson, setPrevLesson] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Scroll to top when component mounts or when searchParams changes
    window.scrollTo(0, 0);
    
    const loadLesson = async () => {
      const id = searchParams.get('id');
      if (!id || !subject) return;
      
      try {
        // Load all lessons for the current subject
        const lessons = loadLessons(subject);
        const currentLesson = lessons.find(lesson => lesson.id === id);
        
        if (!currentLesson) {
          throw new Error('Lesson not found');
        }
        
        setTitle(currentLesson.title);
        setContent(currentLesson.content);
        
        // Load all images for this lesson
        const imageImports = import.meta.glob('/src/lessonsData/**/*.{jpg,png}');
        const loadedImages: Record<string, string> = {};
        
        for (const path in imageImports) {
          if (path.includes(`/lessonsData/${subject}/`)) {
            const imageName = path.split('/').pop() || '';
            const imageModule = await imageImports[path]();
            loadedImages[imageName] = imageModule.default;
          }
        }
        
        setImages(loadedImages);

        // Get next/prev lessons
        const currentIndex = lessons.findIndex(lesson => lesson.id === id);
        
        if (currentIndex > 0) {
          setPrevLesson(lessons[currentIndex - 1].id);
        } else {
          setPrevLesson(null);
        }
        
        if (currentIndex < lessons.length - 1) {
          setNextLesson(lessons[currentIndex + 1].id);
        } else {
          setNextLesson(null);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
        navigate('/learn');
      }
    };
    
    loadLesson();
  }, [subject, searchParams, navigate]);
  
  const navigateToLesson = (lessonId: string | null) => {
    if (lessonId && subject) {
      navigate(`/lesson/${subject}?id=${lessonId}`);
    }
  };
  
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 circuit-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center text-yellow hover:text-yellow-light transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            {translations.learn.backToLessons}
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-darkgray/40 border border-yellow/20 rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-3xl font-orbitron text-yellow mb-4">{title}</h1>
            <LessonContent content={content} images={images} />
            
            <div className="mt-12 flex justify-between items-center">
              <motion.button
                whileHover={prevLesson ? { x: -5 } : {}}
                onClick={() => navigateToLesson(prevLesson)}
                className={`flex items-center transition-colors ${
                  prevLesson 
                    ? 'text-yellow hover:text-yellow-light cursor-pointer' 
                    : 'text-yellow-900 cursor-not-allowed'
                }`}
                disabled={!prevLesson}
              >
                <ArrowLeft size={20} className="mr-2" />
                {translations.learn.previousLesson}
              </motion.button>

              <motion.button
                whileHover={nextLesson ? { x: 5 } : {}}
                onClick={() => navigateToLesson(nextLesson)}
                className={`flex items-center transition-colors ${
                  nextLesson 
                    ? 'text-yellow hover:text-yellow-light cursor-pointer' 
                    : 'text-yellow-900 cursor-not-allowed'
                }`}
                disabled={!nextLesson}
              >
                {translations.learn.nextLesson}
                <ArrowRight size={20} className="ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonPage;