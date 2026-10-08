import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StatusIndicator3DProps {
  status: 'secure' | 'warning' | 'leaking' | 'disconnected';
  label?: string;
  onReady?: (group: THREE.Group) => void;
}

const statusColors = {
  secure: new THREE.Color('#00FF88'),
  warning: new THREE.Color('#FFAA00'),
  leaking: new THREE.Color('#FF3366'),
  disconnected: new THREE.Color('#666699'),
};

const statusGlowColors = {
  secure: new THREE.Color('#00FF88'),
  warning: new THREE.Color('#FFAA00'),
  leaking: new THREE.Color('#FF3366'),
  disconnected: new THREE.Color('#444466'),
};

export const StatusIndicator3D: React.FC<StatusIndicator3DProps> = ({ 
  status, 
  label,
  onReady 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);
  
  const color = statusColors[status];
  const glowColor = statusGlowColors[status];

  const coreGeometry = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(0.6, 0.65, 64), []);
  const scanlineGeometry = useMemo(() => new THREE.PlaneGeometry(1.5, 0.02), []);
  
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 150;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 0.3;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      sizes[i] = Math.random() * 0.04 + 0.01;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    return geo;
  }, []);

  const coreMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  }), [color]);

  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: glowColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  }), [glowColor]);

  const scanlineMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }), [glowColor]);

  const particleMaterial = useMemo(() => new THREE.PointsMaterial({
    color: color,
    size: 0.03,
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
    
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.15;
      coreRef.current.scale.setScalar(pulse);
      const cMat = coreRef.current.material as THREE.MeshBasicMaterial;
      cMat.opacity = 0.6 + Math.sin(time * 4) * 0.2;
    }
    
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = Math.sin(time + i) * 0.5;
      ring.rotation.y = time * (0.3 + i * 0.1);
      ring.rotation.z = Math.cos(time * 0.7 + i) * 0.3;
      const rMat = ring.material as THREE.MeshBasicMaterial;
      rMat.opacity = 0.3 + Math.sin(time * 2 + i) * 0.2;
    });
    
    if (scanlineRef.current) {
      scanlineRef.current.position.y = Math.sin(time * 2) * 0.7;
      const sMat = scanlineRef.current.material as THREE.MeshBasicMaterial;
      sMat.opacity = 0.4 + Math.sin(time * 4) * 0.3;
      scanlineRef.current.rotation.z = Math.sin(time) * 0.1;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += velocities[i * 3] * delta * 2;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 2;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 2;
        
        const dist = Math.sqrt(
          positions[i * 3] ** 2 + 
          positions[i * 3 + 1] ** 2 + 
          positions[i * 3 + 2] ** 2
        );
        
        if (dist > 1.2) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 0.5 + Math.random() * 0.2;
          
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);
          
          velocities[i * 3] = (Math.random() - 0.5) * 0.5;
          velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (status === 'leaking') {
      groupRef.current.rotation.y = Math.sin(time * 5) * 0.1;
      if (coreRef.current) {
        (coreRef.current.material as THREE.MeshBasicMaterial).color.lerp(new THREE.Color('#FF3366'), 0.05);
      }
    } else if (status === 'secure') {
      if (coreRef.current) {
        (coreRef.current.material as THREE.MeshBasicMaterial).color.lerp(new THREE.Color('#00FF88'), 0.05);
      }
    }
  });

  const ringConfigs = [
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: Math.PI / 2, y: 0, z: 0 },
    { x: Math.PI / 4, y: Math.PI / 4, z: 0 },
  ];

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef} geometry={coreGeometry} material={coreMaterial} />
      {ringConfigs.map((rot, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el; }}
          geometry={ringGeometry}
          material={ringMaterial}
          rotation={[rot.x, rot.y, rot.z]}
        />
      ))}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      <mesh ref={scanlineRef} geometry={scanlineGeometry} material={scanlineMaterial} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh
        geometry={new THREE.SphereGeometry(1.2, 16, 16)}
        material={new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.08,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        })}
      />
    </group>
  );
};