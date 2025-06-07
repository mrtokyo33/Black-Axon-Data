import React from 'react';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle, ArrowRight, Copy, Terminal, Code2, FileText } from 'lucide-react';

interface LessonContentProps {
  content: string;
  images: Record<string, string>;
}

const LessonContent: React.FC<LessonContentProps> = ({ content, images }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatText = (text: string) => {
    // Handle escaped characters first
    const processedText = text.replace(/\\([\\*$])/g, (_, char) => char);
    
    // Replace \cdotp with · in math expressions
    const processedMath = processedText.replace(/\\cdotp/g, '·');
    
    // Split by KaTeX delimiters and other formatting markers
    const parts = processedMath.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\*\*.*?\*\*|\*.*?\*)/);
    
    return parts.map((part, j) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Display math
        return <BlockMath key={j}>{part.slice(2, -2)}</BlockMath>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        return <InlineMath key={j}>{part.slice(1, -1)}</InlineMath>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-yellow">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={j}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderCodeBlock = (code: string, language: string = '', index: number) => {
    const codeId = `code-${index}`;
    const isCommand = language === 'bash' || language === 'shell';
    const isConfig = language === 'json' || language === 'yaml' || language === 'xml';
    
    // Detect if it's a multi-line script
    const isScript = code.includes('#!/bin/bash') || code.includes('function') || code.split('\n').length > 10;
    
    const getLanguageIcon = () => {
      switch (language) {
        case 'bash':
        case 'shell':
          return <Terminal size={16} className="text-green-400" />;
        case 'python':
          return <Code2 size={16} className="text-blue-400" />;
        case 'javascript':
          return <Code2 size={16} className="text-yellow-400" />;
        case 'json':
        case 'yaml':
        case 'xml':
          return <FileText size={16} className="text-purple-400" />;
        default:
          return <Code2 size={16} className="text-gray-400" />;
      }
    };

    const getLanguageLabel = () => {
      switch (language) {
        case 'bash':
        case 'shell':
          return 'Bash';
        case 'python':
          return 'Python';
        case 'javascript':
          return 'JavaScript';
        case 'json':
          return 'JSON';
        case 'yaml':
          return 'YAML';
        case 'xml':
          return 'XML';
        default:
          return 'Code';
      }
    };

    return (
      <motion.div
        key={codeId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`my-6 rounded-lg overflow-hidden border ${
          isCommand 
            ? 'border-green-500/30 bg-black/60' 
            : isConfig
            ? 'border-purple-500/30 bg-black/60'
            : 'border-blue-500/30 bg-black/60'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-2 ${
          isCommand 
            ? 'bg-green-500/10 border-b border-green-500/20' 
            : isConfig
            ? 'bg-purple-500/10 border-b border-purple-500/20'
            : 'bg-blue-500/10 border-b border-blue-500/20'
        }`}>
          <div className="flex items-center space-x-2">
            {getLanguageIcon()}
            <span className="text-sm font-medium text-white/80">
              {getLanguageLabel()}
              {isScript && ' Script'}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(code, codeId)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              copiedCode === codeId
                ? 'bg-green-500/20 text-green-400'
                : 'hover:bg-white/10 text-white/60 hover:text-white/80'
            }`}
          >
            <Copy size={12} />
            <span>{copiedCode === codeId ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-sm">
            <code className={`language-${language} text-white/90 font-source-code leading-relaxed`}>
              {code}
            </code>
          </pre>
          
          {/* Command indicator for bash */}
          {isCommand && (
            <div className="absolute top-4 left-2 text-green-400/60 text-xs font-mono">
              $
            </div>
          )}
        </div>

        {/* Footer for scripts */}
        {isScript && (
          <div className="px-4 py-2 bg-black/40 border-t border-white/10">
            <p className="text-xs text-white/60">
              💡 <strong>Dica:</strong> Salve este script em um arquivo .sh e execute com <code className="bg-white/10 px-1 rounded">bash script.sh</code>
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderInlineCode = (code: string) => {
    return (
      <code className="bg-black/40 border border-yellow/30 text-yellow px-1.5 py-0.5 rounded text-sm font-source-code">
        {code}
      </code>
    );
  };

  const renderTable = (tableContent: string) => {
    const rows = tableContent.trim().split('\n');
    const headers = rows[0].split('|').map(cell => cell.trim()).filter(Boolean);
    const data = rows.slice(2).map(row => 
      row.split('|').map(cell => cell.trim()).filter(Boolean)
    );

    return (
      <div className="my-4 md:my-6 -mx-2 md:mx-0 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full border-collapse bg-black/30 rounded-lg overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-yellow/10 border-b border-yellow/30">
                {headers.map((header, i) => (
                  <th key={i} className="p-2 md:px-6 md:py-4 text-left font-semibold text-yellow font-quicksand">
                    {formatText(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-yellow/10 hover:bg-yellow/5 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="p-2 md:px-6 md:py-4 text-white/90 font-poppins">
                      {formatText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // Skip the first 4 lines (title, description, difficulty, id)
    const lines = content.split('\n').slice(4);
    
    const result = [];
    let inCenterBlock = false;
    let inTable = false;
    let inCodeBlock = false;
    let tableContent = '';
    let codeContent = '';
    let codeLanguage = '';
    let codeIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting code block
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3);
          codeContent = '';
          continue;
        } else {
          // Ending code block
          inCodeBlock = false;
          result.push(renderCodeBlock(codeContent.trim(), codeLanguage, codeIndex++));
          codeContent = '';
          codeLanguage = '';
          continue;
        }
      }
      
      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }
      
      // Handle table content
      if (line.trim().startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableContent = line;
        } else {
          tableContent += '\n' + line;
        }
        continue;
      } else if (inTable) {
        result.push(renderTable(tableContent));
        inTable = false;
        tableContent = '';
      }
      
      // Handle centered image blocks
      if (line.trim() === '::: center') {
        inCenterBlock = true;
        continue;
      }
      
      if (inCenterBlock) {
        if (line.trim() === ':::') {
          inCenterBlock = false;
          continue;
        }
        
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, alt, src] = match;
          const imageName = src.split('/').pop() || '';
          if (images[imageName]) {
            result.push(
              <motion.div
                key={`img-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center my-4 md:my-6 -mx-2 md:mx-0"
              >
                <img
                  src={images[imageName]}
                  alt={alt}
                  className="w-[95%] rounded-lg shadow-lg"
                />
              </motion.div>
            );
          }
        }
        continue;
      }
      
      // Handle headers with different styles
      if (line.startsWith('# ')) {
        result.push(
          <motion.h2
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-quicksand text-yellow mb-4 md:mb-6 mt-6 md:mt-8 bg-yellow/5 p-3 rounded-lg border-l-4 border-yellow/80"
          >
            {formatText(line.substring(2))}
          </motion.h2>
        );
        continue;
      }
      
      if (line.startsWith('## ')) {
        result.push(
          <motion.h3
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl md:text-2xl font-quicksand text-yellow/90 mb-4 md:mb-5 mt-5 md:mt-7 bg-yellow/5 p-2 rounded-lg border-l-2 border-yellow/60"
          >
            {formatText(line.substring(3))}
          </motion.h3>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        result.push(
          <motion.h4
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg md:text-xl font-quicksand text-yellow/80 mb-3 md:mb-4 mt-4 md:mt-6 flex items-center"
          >
            <Circle size={6} className="text-yellow/80 mr-2" fill="currentColor" />
            {formatText(line.substring(4))}
          </motion.h4>
        );
        continue;
      }

      if (line.startsWith('#### ')) {
        result.push(
          <motion.h5
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-base md:text-lg font-quicksand text-yellow/70 mb-2 md:mb-3 mt-3 md:mt-5 ml-4 flex items-center"
          >
            <Circle size={4} className="text-yellow/60 mr-2" fill="currentColor" />
            {formatText(line.substring(5))}
          </motion.h5>
        );
        continue;
      }
      
      // Handle horizontal rules with arrow
      if (line.trim() === '---') {
        result.push(
          <div key={i} className="my-4 md:my-6 flex items-center">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-yellow/30 to-transparent"></div>
            <ArrowRight size={20} className="mx-2 text-yellow/50" />
            <div className="flex-grow h-px bg-gradient-to-r from-yellow/30 via-yellow/30 to-transparent"></div>
          </div>
        );
        continue;
      }
      
      // Handle lists
      if (line.startsWith('- ')) {
        result.push(
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-4 md:ml-6 mb-2 text-white/90 text-sm md:text-base font-poppins"
          >
            {formatText(line.substring(2))}
          </motion.li>
        );
        continue;
      }
      
      // Handle blockquotes
      if (line.startsWith('> ')) {
        result.push(
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-yellow/50 pl-4 my-3 md:my-4 text-white/80 italic text-sm md:text-base font-poppins"
          >
            {formatText(line.substring(2))}
          </motion.blockquote>
        );
        continue;
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        result.push(<div key={i} className="h-2 md:h-4" />);
        continue;
      }
      
      // Handle regular paragraphs with inline code formatting
      const processedLine = line.replace(/`([^`]+)`/g, (match, code) => {
        return `<INLINE_CODE>${code}</INLINE_CODE>`;
      });
      
      const parts = processedLine.split(/(<INLINE_CODE>.*?<\/INLINE_CODE>)/);
      
      result.push(
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/90 leading-relaxed mb-3 md:mb-4 text-sm md:text-base font-poppins"
        >
          {parts.map((part, j) => {
            if (part.startsWith('<INLINE_CODE>') && part.endsWith('</INLINE_CODE>')) {
              const code = part.slice(13, -14);
              return renderInlineCode(code);
            }
            return formatText(part);
          })}
        </motion.p>
      );
    }

    // Handle any remaining table content
    if (inTable) {
      result.push(renderTable(tableContent));
    }

    return result;
  };

  return (
    <div className="prose prose-invert max-w-none w-[95%] mx-auto">
      {renderContent()}
    </div>
  );
};

export default LessonContent;