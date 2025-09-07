'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Environment, PerspectiveCamera, Box, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Character3DProps {
  isSpeaking: boolean;
}

// 3D Character Component
function Character({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  const [time, setTime] = useState(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const elapsedTime = state.clock.getElapsedTime();
    setTime(elapsedTime);

    // Idle breathing animation
    meshRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.02;
    
    // Head slight movement
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(elapsedTime * 0.3) * 0.05;
      headRef.current.rotation.y = Math.sin(elapsedTime * 0.2) * 0.03;
    }

    // Eye blinking
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = Math.sin(elapsedTime * 0.8) * 0.5 + 0.5;
      const blink = blinkCycle > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }

    // Speaking animation - mouth movement
    if (mouthRef.current) {
      if (isSpeaking) {
        // Rapid mouth movement when speaking
        const speakingIntensity = Math.sin(elapsedTime * 12) * 0.3 + 0.7;
        mouthRef.current.scale.x = speakingIntensity;
        mouthRef.current.scale.y = speakingIntensity * 0.8;
      } else {
        // Return to normal
        mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1, 0.1);
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1, 0.1);
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Head */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.4, 1]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#4f46e5" : "#6366f1"} 
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.3, 0.2, 0.51]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.3, 0.2, 0.51]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Eye pupils */}
      <mesh position={[-0.3, 0.2, 0.6]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.6]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.51]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#ef4444" : "#1f2937"} 
          roughness={0.8}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[1.5, 2, 0.8]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#7c3aed" : "#8b5cf6"} 
          roughness={0.4} 
          metalness={0.1}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-1.2, -1.2, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#4f46e5" : "#6366f1"} 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[1.2, -1.2, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#4f46e5" : "#6366f1"} 
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Floating Particles
function Particles({ isSpeaking }: { isSpeaking: boolean }) {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const elapsedTime = state.clock.getElapsedTime();
    particlesRef.current.rotation.y = elapsedTime * 0.1;
    
    particlesRef.current.children.forEach((particle, i) => {
      const mesh = particle as THREE.Mesh;
      mesh.position.y = Math.sin(elapsedTime + i) * 0.5;
      mesh.rotation.x = elapsedTime * 0.5 + i;
      mesh.rotation.z = elapsedTime * 0.3 + i * 0.5;
    });
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial 
              color={isSpeaking ? "#fbbf24" : "#60a5fa"} 
              emissive={isSpeaking ? "#f59e0b" : "#3b82f6"}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Character3D({ isSpeaking }: Character3DProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div 
      className="w-full h-full bg-gradient-to-b from-gray-900/50 to-gray-950/80 rounded-lg overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading 3D Character...</p>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm ${
            isSpeaking 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-blue-500/20 border border-blue-500/30'
          }`}
          animate={{ scale: isSpeaking ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1 }}
        >
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-400' : 'bg-blue-400'}`}></div>
          <span className={`text-xs font-medium ${isSpeaking ? 'text-green-300' : 'text-blue-300'}`}>
            {isSpeaking ? 'Speaking' : 'Listening'}
          </span>
        </motion.div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="text-xs text-gray-500 text-right">
          <div>Click and drag to rotate</div>
          <div>Scroll to zoom</div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          color={isSpeaking ? "#fbbf24" : "#60a5fa"}
          castShadow 
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5}
          color={isSpeaking ? "#f59e0b" : "#3b82f6"}
        />

        {/* Environment */}
        <Environment preset="night" />
        
        {/* 3D Character */}
        <Character isSpeaking={isSpeaking} />
        
        {/* Floating Particles */}
        <Particles isSpeaking={isSpeaking} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>

      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isSpeaking ? 'bg-yellow-400/30' : 'bg-blue-400/20'
            }`}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}