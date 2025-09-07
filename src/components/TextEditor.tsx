'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const [charCount, setCharCount] = useState(0);
  const [filteredText, setFilteredText] = useState('');

  useEffect(() => {
    // Smart text filtering - preserve content in parentheses, remove other special chars
    const processText = (text: string): string => {
      return text
        .replace(/[^\w\s\(\).,!?;:'"]/g, ' ') // Keep basic punctuation and parentheses
        .replace(/\s+/g, ' ')
        .trim();
    };

    const processed = processText(value);
    setFilteredText(processed);
    setCharCount(processed.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleSample = () => {
    const sampleText = `Welcome to our Advanced Text-to-Speech Studio! This amazing technology can convert your written content into natural-sounding speech. 

Here are some key features (that you'll love):
- High-quality voice synthesis
- Advanced audio controls (speed, pitch, volume)
- Smart character filtering 
- Beautiful 3D character animations
- Support for multiple file formats

Try typing your own text or upload a document to get started. The system intelligently filters special characters while preserving important content in parentheses for the best audio experience.`;
    
    onChange(sampleText);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <motion.button
            onClick={handleSample}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load Sample
          </motion.button>
          
          <motion.button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!value}
          >
            Clear
          </motion.button>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Characters: <span className="text-blue-400 font-medium">{charCount}</span></span>
          <span>Words: <span className="text-purple-400 font-medium">{filteredText.split(' ').filter(Boolean).length}</span></span>
        </div>
      </div>

      {/* Text Area */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Enter your text here, upload a file, or click 'Load Sample' to get started...

The system will automatically filter special characters while preserving content in parentheses (like this) for optimal speech synthesis."
          className="w-full h-64 p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          style={{ lineHeight: '1.6' }}
        />
        
        {/* Character overlay indicator */}
        {value && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="px-2 py-1 bg-gray-900/80 backdrop-blur-sm rounded text-xs text-gray-300">
              {charCount > 10000 ? (
                <span className="text-yellow-400">⚠ Very long text</span>
              ) : charCount > 5000 ? (
                <span className="text-orange-400">⚡ Long text</span>
              ) : (
                <span className="text-green-400">✓ Good length</span>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Processing Preview */}
      {value && filteredText !== value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-yellow-300 font-medium text-sm mb-1">Text Processing Preview</h4>
              <p className="text-yellow-200/80 text-sm">
                Special characters will be filtered for better speech synthesis. Content in parentheses will be preserved.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feature indicators */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Auto character filtering</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Parentheses preserved</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>Real-time preview</span>
        </div>
      </div>
    </div>
  );
}