import { join } from "node:path";
import { readFileSync, readdirSync } from "node:fs";

interface LessonData {
  subject: string;
  id: string;
  title: string;
  description: string;
  content: string[];
}

function parseMdFile(filePath: string): LessonData {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // First line is always the title
  const title = lines[0].trim();
  
  // Second line is the description
  const description = lines[1].trim();
  
  // Rest is the content
  const mainContent = lines.slice(2).join('\n');
  
  return {
    title,
    description,
    content: [mainContent]
  };
}

function loadLessons(subject: string): LessonData[] {
  const lessons: LessonData[] = [];
  const subjectPath = join(Deno.cwd(), 'src/lessonsData', subject);
  
  try {
    const files = readdirSync(subjectPath);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = join(subjectPath, file);
        const lessonData = parseMdFile(filePath);
        lessons.push({
          ...lessonData,
          subject,
          id: file.replace('.md', '')
        });
      }
    });
    
    return lessons.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    console.error(`Error loading lessons for subject ${subject}:`, error);
    return [];
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const subject = url.searchParams.get("subject");

  if (!subject) {
    return new Response(
      JSON.stringify({ error: "Subject parameter is required" }),
      { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }

  try {
    const lessons = loadLessons(subject);
    return new Response(
      JSON.stringify(lessons),
      { 
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to load lessons" }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});