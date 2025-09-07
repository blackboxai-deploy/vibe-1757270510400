'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  progress: number;
}

export default function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const getProgressStage = (progress: number) => {
    if (progress < 20) return 'Initializing...';
    if (progress < 40) return 'Processing text...';
    if (progress < 60) return 'Generating voice...';
    if (progress < 80) return 'Applying settings...';
    if (progress < 95) return 'Finalizing audio...';
    return 'Complete!';
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'from-blue-500 to-blue-600';
    if (progress < 50) return 'from-purple-500 to-purple-600';
    if (progress < 75) return 'from-pink-500 to-pink-600';
    if (progress < 95) return 'from-green-500 to-green-600';
    return 'from-emerald-500 to-emerald-600';
  };

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-200">Generating Audio</h3>
        <motion.span
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          key={progress}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {progress}%
        </motion.span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Bar */}
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          {/* Animated Progress Bar */}
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 400] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>

        {/* Progress Markers */}
        <div className="absolute -top-2 left-0 w-full flex justify-between">
          {[0, 25, 50, 75, 100].map((marker) => (
            <motion.div
              key={marker}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                progress >= marker 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 scale-125' 
                  : 'bg-gray-600 scale-100'
              }`}
              animate={{ 
                scale: progress >= marker ? 1.25 : 1,
                boxShadow: progress >= marker ? '0 0 10px rgba(147, 51, 234, 0.5)' : 'none'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Stage Indicator */}
      <motion.div
        className="text-center"
        key={getProgressStage(progress)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-300 font-medium mb-2">
          {getProgressStage(progress)}
        </p>
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { step: 1, title: 'Text Processing', icon: '📝', threshold: 20 },
          { step: 2, title: 'Voice Generation', icon: '🎤', threshold: 60 },
          { step: 3, title: 'Audio Export', icon: '🎵', threshold: 90 },
        ].map((item) => (
          <motion.div
            key={item.step}
            className={`p-4 rounded-lg border transition-all duration-500 ${
              progress >= item.threshold
                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg'
                : 'bg-gray-800/30 border-gray-700'
            }`}
            animate={{
              scale: progress >= item.threshold ? 1.05 : 1,
              borderColor: progress >= item.threshold ? 'rgb(59, 130, 246)' : 'rgb(75, 85, 99)'
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="text-2xl mb-2"
                animate={{ 
                  rotate: progress >= item.threshold ? [0, 360] : 0,
                  scale: progress >= item.threshold ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.div>
              <h4 className={`text-sm font-medium ${
                progress >= item.threshold ? 'text-blue-300' : 'text-gray-400'
              }`}>
                {item.title}
              </h4>
              <div className={`text-xs mt-1 ${
                progress >= item.threshold ? 'text-green-400' : 'text-gray-500'
              }`}>
                {progress >= item.threshold ? '✓ Complete' : 'Pending'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Estimated Time */}
      <motion.div
        className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Estimated time remaining:</span>
          <span className="text-blue-400 font-medium">
            {progress >= 95 ? '0s' : `${Math.max(1, Math.ceil((100 - progress) / 10))}s`}
          </span>
        </div>
      </motion.div>
    </div>
  );
}