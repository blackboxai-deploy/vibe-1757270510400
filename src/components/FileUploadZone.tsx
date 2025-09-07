'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import mammoth from 'mammoth';

interface FileUploadZoneProps {
  onFileProcess: (text: string) => void;
}

export default function FileUploadZone({ onFileProcess }: FileUploadZoneProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.readAsText(file);
    });
  };

  const processWordFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processPdfFile = async (file: File): Promise<string> => {
    // For now, return a placeholder - PDF processing requires server-side handling
    return `PDF file "${file.name}" uploaded. Text extraction will be processed on the server.`;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);

    try {
      let extractedText = '';
      
      if (file.type === 'text/plain') {
        extractedText = await processTextFile(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await processWordFile(file);
      } else if (file.type === 'application/pdf') {
        extractedText = await processPdfFile(file);
      } else {
        throw new Error('Unsupported file type');
      }

      // Smart text processing - remove special characters except parentheses content
      const processedText = extractedText
        .replace(/[^\w\s\(\).,!?;:'"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      onFileProcess(processedText);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileProcess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive || dragActive
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
      
      {isProcessing ? (
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-300">Processing file...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-200 mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              or <span className="text-blue-400 underline">browse to choose</span>
            </p>
            <p className="text-xs text-gray-500">
              Supports: TXT, DOCX, PDF (max 10MB)
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
              .txt
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
              .docx
            </span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs">
              .pdf
            </span>
          </div>
        </div>
      )}

      {/* Animated particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-0"
            animate={{
              opacity: isDragActive ? [0, 1, 0] : 0,
              y: [0, -20, -40],
              x: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${20 + i * 10}%`,
              top: '80%',
            }}
          />
        ))}
      </div>
      </motion.div>
    </div>
  );
}