import { LessonData } from '../types/lessons';

export function loadLessons(subject: string): LessonData[] {
  try {
    const lessons: LessonData[] = [];
    const files = import.meta.glob('/src/lessonsData/**/*.md', { as: 'raw', eager: true });
    
    for (const path in files) {
      if (path.startsWith(`/src/lessonsData/${subject}/`)) {
        const content = files[path];
        const lines = content.split('\n');
        const title = lines[0].trim();
        const description = lines[1].trim();
        const difficulty = lines[2].trim();
        const id = path.split('/').pop()?.replace('.md', '') || '';
        
        lessons.push({
          subject,
          id,
          title,
          description,
          difficulty,
          content
        });
      }
    }
    
    // Sort numerically by ID
    return lessons.sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      return numA - numB;
    });
  } catch (error) {
    console.error('Error loading lessons:', error);
    return [];
  }
}