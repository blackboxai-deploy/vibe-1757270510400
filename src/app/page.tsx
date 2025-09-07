'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUploadZone from '@/components/FileUploadZone';
import TextEditor from '@/components/TextEditor';
import AudioControls from '@/components/AudioControls';
import Character3D from '@/components/Character3D';
import ProgressIndicator from '@/components/ProgressIndicator';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleFileProcess = (extractedText: string) => {
    setText(extractedText);
  };

  const handleGenerateAudio = async (settings: any) => {
    setIsGenerating(true);
    setProgress(0);
    setIsSpeaking(true);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, settings }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGenerating(false);
      setIsSpeaking(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Advanced TTS Studio
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Convert text, PDF, and Word files to high-quality audio with intelligent character processing and immersive 3D animations
        </p>
      </motion.header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          {/* File Upload */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Upload Files</h2>
            <FileUploadZone onFileProcess={handleFileProcess} />
          </div>

          {/* Text Editor */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Text Content</h2>
            <TextEditor value={text} onChange={handleTextChange} />
          </div>

          {/* Audio Controls */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Audio Settings</h2>
            <AudioControls onGenerate={handleGenerateAudio} disabled={!text || isGenerating} />
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <ProgressIndicator progress={progress} />
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Generated Audio</h2>
              <AudioPlayer audioUrl={audioUrl} />
            </div>
          )}
        </motion.div>

        {/* Right Panel - 3D Character */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-300">AI Character</h2>
          <div className="h-96 lg:h-[600px]">
            <Character3D isSpeaking={isSpeaking} />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center mt-16 py-8 border-t border-gray-800"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 mb-4">
            Experience the future of text-to-speech with AI-powered character animations
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>🎯 Smart Character Filtering</span>
            <span>🎤 Advanced Voice Controls</span>
            <span>🎭 3D Character Animation</span>
            <span>📁 Multi-Format Support</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}