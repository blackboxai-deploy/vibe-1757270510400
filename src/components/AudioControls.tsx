'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AudioSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  format: string;
}

interface AudioControlsProps {
  onGenerate: (settings: AudioSettings) => void;
  disabled: boolean;
}

export default function AudioControls({ onGenerate, disabled }: AudioControlsProps) {
  const [settings, setSettings] = useState<AudioSettings>({
    voice: 'default',
    rate: 1,
    pitch: 1,
    volume: 0.8,
    format: 'mp3',
  });

  const voices = [
    { id: 'default', name: 'Default Voice', gender: 'Neutral' },
    { id: 'male-1', name: 'Professional Male', gender: 'Male' },
    { id: 'female-1', name: 'Professional Female', gender: 'Female' },
    { id: 'male-2', name: 'Casual Male', gender: 'Male' },
    { id: 'female-2', name: 'Casual Female', gender: 'Female' },
    { id: 'narrator', name: 'Documentary Narrator', gender: 'Male' },
  ];

  const handleGenerate = () => {
    onGenerate(settings);
  };

  const updateSetting = (key: keyof AudioSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Voice Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">Voice Selection</label>
        <Select value={settings.voice} onValueChange={(value) => updateSetting('voice', value)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
            <SelectValue placeholder="Choose a voice" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id} className="text-gray-100 focus:bg-gray-700">
                <div className="flex justify-between items-center w-full">
                  <span>{voice.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{voice.gender}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speech Rate */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Speech Rate</label>
          <span className="text-sm text-blue-400 font-mono">{settings.rate.toFixed(1)}x</span>
        </div>
        <Slider
          value={[settings.rate]}
          onValueChange={(value) => updateSetting('rate', value[0])}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5x (Slow)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>

      {/* Pitch Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Voice Pitch</label>
          <span className="text-sm text-purple-400 font-mono">{settings.pitch.toFixed(1)}</span>
        </div>
        <Slider
          value={[settings.pitch]}
          onValueChange={(value) => updateSetting('pitch', value[0])}
          min={0.5}
          max={1.5}
          step={0.05}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5 (Low)</span>
          <span>1.0 (Normal)</span>
          <span>1.5 (High)</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Volume</label>
          <span className="text-sm text-green-400 font-mono">{Math.round(settings.volume * 100)}%</span>
        </div>
        <Slider
          value={[settings.volume]}
          onValueChange={(value) => updateSetting('volume', value[0])}
          min={0}
          max={1}
          step={0.05}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0% (Mute)</span>
          <span>50%</span>
          <span>100% (Max)</span>
        </div>
      </div>

      {/* Audio Format */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">Output Format</label>
        <Select value={settings.format} onValueChange={(value) => updateSetting('format', value)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="mp3" className="text-gray-100 focus:bg-gray-700">MP3 (Recommended)</SelectItem>
            <SelectItem value="wav" className="text-gray-100 focus:bg-gray-700">WAV (High Quality)</SelectItem>
            <SelectItem value="ogg" className="text-gray-100 focus:bg-gray-700">OGG (Web Optimized)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Settings Preview */}
      <motion.div
        className="bg-gray-700/30 rounded-lg p-4 border border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-sm font-medium text-gray-300 mb-3">Settings Preview</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400">Voice:</span>
            <span className="text-blue-300 block">{voices.find(v => v.id === settings.voice)?.name}</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Format:</span>
            <span className="text-green-300 block uppercase">{settings.format}</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Speed:</span>
            <span className="text-purple-300 block">{settings.rate}x</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Quality:</span>
            <span className="text-yellow-300 block">High</span>
          </div>
        </div>
      </motion.div>

      {/* Generate Button */}
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <Button
          onClick={handleGenerate}
          disabled={disabled}
          className={`
            w-full h-12 text-lg font-semibold rounded-lg transition-all duration-300
            ${disabled
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25'
            }
          `}
        >
          {disabled ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Audio...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 5.464a9 9 0 010 12.728M18 12a6 6 0 01-6 6v-2a4 4 0 000-8V6a6 6 0 016 6zM12 6V4a8 8 0 018 8 8 8 0 01-8 8v-2a6 6 0 000-12V6z" />
              </svg>
              <span>Generate Audio</span>
            </div>
          )}
        </Button>
      </motion.div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <h5 className="text-xs font-medium text-blue-300 mb-2">💡 Pro Tips</h5>
        <ul className="text-xs text-blue-200/80 space-y-1">
          <li>• Use slower rates for better comprehension</li>
          <li>• Adjust pitch for different character voices</li>
          <li>• MP3 format offers best compatibility</li>
          <li>• Higher volume works better with headphones</li>
        </ul>
      </div>
    </div>
  );
}