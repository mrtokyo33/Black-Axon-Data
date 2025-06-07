import { Exercise, PracticeData } from '../types/practice';

export function loadPracticeData(subject: string): PracticeData[] {
  try {
    const practiceData: PracticeData[] = [];
    const files = import.meta.glob('/src/practiceData/**/*.md', { as: 'raw', eager: true });
    
    for (const path in files) {
      if (path.startsWith(`/src/practiceData/${subject}/`)) {
        const content = files[path];
        const parsed = parsePracticeFile(content);
        const id = path.split('/').pop()?.replace('.md', '') || '';
        
        if (parsed) {
          practiceData.push({
            ...parsed,
            subject,
            id
          });
        }
      }
    }
    
    // Sort numerically by ID
    return practiceData.sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      return numA - numB;
    });
  } catch (error) {
    console.error('Error loading practice data:', error);
    return [];
  }
}

function parsePracticeFile(content: string): Omit<PracticeData, 'subject' | 'id'> | null {
  try {
    const lines = content.split('\n');
    const title = lines[0].trim();
    const description = lines[1].trim();
    const difficulty = lines[2].trim();
    
    // Find exercises between @exercicio and @end
    const exercises: Exercise[] = [];
    let currentExercise: Partial<Exercise> = {};
    let inExercise = false;
    let exerciseId = 1;
    
    for (let i = 4; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('@exercicio')) {
        inExercise = true;
        currentExercise = { id: exerciseId.toString() };
        
        // Extract type
        const typeMatch = line.match(/tipo=(\w+)/);
        if (typeMatch) {
          currentExercise.type = typeMatch[1] as Exercise['type'];
        }
        continue;
      }
      
      if (line === '@end') {
        if (currentExercise.question && currentExercise.type) {
          exercises.push(currentExercise as Exercise);
          exerciseId++;
        }
        currentExercise = {};
        inExercise = false;
        continue;
      }
      
      if (inExercise && line) {
        if (line.startsWith('Pergunta:')) {
          currentExercise.question = line.replace('Pergunta:', '').trim();
        } else if (line.startsWith('Opções:')) {
          currentExercise.options = [];
        } else if (line.startsWith('- ')) {
          if (currentExercise.options) {
            const option = line.replace('- ', '');
            if (option.endsWith('*')) {
              // This is the correct answer
              const cleanOption = option.replace('*', '');
              currentExercise.options.push(cleanOption);
              currentExercise.correctAnswer = cleanOption;
            } else {
              currentExercise.options.push(option);
            }
          }
        } else if (line.startsWith('Resposta:')) {
          const answer = line.replace('Resposta:', '').trim();
          currentExercise.correctAnswer = answer;
        } else if (line.startsWith('Explicacao:')) {
          currentExercise.explanation = line.replace('Explicacao:', '').trim();
        }
      }
    }
    
    return {
      title,
      description,
      difficulty,
      exercises
    };
  } catch (error) {
    console.error('Error parsing practice file:', error);
    return null;
  }
}