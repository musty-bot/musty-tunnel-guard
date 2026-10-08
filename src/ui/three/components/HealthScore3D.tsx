import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HealthScore3DProps {
  score: number;
  status: 'secure' | 'warning' | 'leaking' | 'disconnected';
  size?: number;
  onReady?: (group: THREE.Group) => void;
}

const statusColors = {
  secure: '#00FF88',
  warning: '#FFAA00',
  leaking: '#FF3366',
  disconnected: '#666699',
};

const statusGlowColors = {
  secure: '#00FF88',
  warning: '#FFAA00',
  leaking: '#FF3366',
  disconnected: '#444466',
};

export const HealthScore3D: React.FC<HealthScore3DProps> = ({ 
  score, 
  status, 
  size = 4,
  onReady 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const bgRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const color = statusColors[status];
  const glowColor = statusGlowColors[status];
  const targetProgress = score / 100;
  
  const ringGeometry = useMemo(() => new THREE.RingGeometry(size * 0.85, size, 64), [size]);
  const innerRingGeometry = useMemo(() => new THREE.RingGeometry(size * 0.75, size * 0.82, 64), [size]);
  const bgRingGeometry = useMemo(() => new THREE.RingGeometry(size * 0.85, size, 64), [size]);
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = size * (0.85 + Math.random() * 0.15);
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      sizes[i] = Math.random() * 0.08 + 0.02;
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [size]);

  const bgMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#1a1a3a',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  }), []);

  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  }), [color]);

  const innerMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: glowColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  }), [glowColor]);

  const particleMaterial = useMemo(() => new THREE.PointsMaterial({
    color: color,
    size: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }), [color]);

  useEffect(() => {
    if (groupRef.current && onReady) {
      onReady(groupRef.current);
    }
  }, [onReady]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    if (ringRef.current) {
      const currentRot = ringRef.current.rotation.z;
      const targetRot = -Math.PI / 2 + targetProgress * Math.PI * 2;
      const diff = targetRot - currentRot;
      ringRef.current.rotation.z += diff * 0.1;
    }
    
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -time * 0.3;
    }
    
    if (bgRingRef.current) {
      const bgMat = bgRingRef.current.material as THREE.MeshBasicMaterial;
      bgMat.opacity = 0.3 + Math.sin(time * 2) * 0.1;
      bgRingRef.current.rotation.z = time * 0.1;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const phases = particlesRef.current.geometry.attributes.phase.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const phase = phases[i] + time * 0.5;
        const r = size * (0.85 + Math.sin(phase) * 0.08);
        const angle = (i / (positions.length / 3)) * Math.PI * 2 + time * 0.2;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = Math.sin(angle) * r;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (status === 'leaking') {
      groupRef.current.rotation.z = Math.sin(time * 10) * 0.02;
    } else if (status === 'secure') {
      groupRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.01);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={bgRingRef} geometry={bgRingGeometry} material={bgMaterial} />
      <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh ref={innerRingRef} geometry={innerRingGeometry} material={innerMaterial} />
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      <mesh
        geometry={new THREE.CircleGeometry(size * 0.6, 32)}
        material={new THREE.MeshBasicMaterial({
          color: '#050510',
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        })}
      />
      <mesh
        geometry={new THREE.CircleGeometry(size * 0.55, 32)}
        material={new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })}
      />
    </group>
  );
};