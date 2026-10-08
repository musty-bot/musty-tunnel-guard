import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TunnelVisualizationProps {
  status: 'secure' | 'warning' | 'leaking' | 'disconnected';
  intensity?: number;
  onReady?: (group: THREE.Group) => void;
}

const TUNNEL_SEGMENTS = 50;
const TUNNEL_RADIUS = 2.5;
const TUNNEL_LENGTH = 40;
const PARTICLE_COUNT = 2000;

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

export const TunnelVisualization: React.FC<TunnelVisualizationProps> = ({ 
  status, 
  intensity = 1,
  onReady 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const tunnelMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  
  const color = statusColors[status];
  const glowColor = statusGlowColors[status];

  const tunnelGeometry = useMemo(() => {
    const geo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        Array.from({ length: TUNNEL_SEGMENTS }, (_, i) => 
          new THREE.Vector3(0, 0, -i * (TUNNEL_LENGTH / TUNNEL_SEGMENTS))
        )
      ),
      TUNNEL_SEGMENTS,
      TUNNEL_RADIUS,
      16,
      false
    );
    return geo;
  }, []);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);
    const hues = new Float32Array(PARTICLE_COUNT);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const radius = Math.random() * TUNNEL_RADIUS * 0.8;
      const angle = Math.random() * Math.PI * 2;
      const z = -t * TUNNEL_LENGTH;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;
      sizes[i] = Math.random() * 0.15 + 0.05;
      alphas[i] = Math.random() * 0.5 + 0.3;
      hues[i] = Math.random();
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('hue', new THREE.BufferAttribute(hues, 1));
    return geo;
  }, []);

  const ringGeometry = useMemo(() => new THREE.RingGeometry(TUNNEL_RADIUS * 0.95, TUNNEL_RADIUS * 1.05, 32), []);

  const tunnelMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
    wireframe: true,
  }), [color]);

  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  }), [glowColor]);

  const particleMaterial = useMemo(() => new THREE.PointsMaterial({
    size: 0.1,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }), []);

  // Call onReady when group is mounted
  useEffect(() => {
    if (groupRef.current && onReady) {
      onReady(groupRef.current);
    }
  }, [onReady]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const speed = 8 * intensity;
    
    if (tunnelMeshRef.current) {
      const mat = tunnelMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(time * 2) * 0.05;
      tunnelMeshRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.02);
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const alphas = particlesRef.current.geometry.attributes.alpha.array as Float32Array;
      const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3 + 2] += speed * delta * (0.5 + Math.sin(time + i) * 0.3);
        
        if (positions[i * 3 + 2] > TUNNEL_RADIUS) {
          positions[i * 3 + 2] = -TUNNEL_LENGTH;
          positions[i * 3] = (Math.random() - 0.5) * TUNNEL_RADIUS * 1.6;
          positions[i * 3 + 1] = (Math.random() - 0.5) * TUNNEL_RADIUS * 1.6;
          alphas[i] = Math.random() * 0.5 + 0.3;
          sizes[i] = Math.random() * 0.15 + 0.05;
        }
        
        const t = 1 - (positions[i * 3 + 2] + TUNNEL_LENGTH) / TUNNEL_LENGTH;
        alphas[i] = (0.3 + 0.5 * Math.sin(time * 5 + i * 0.1)) * (0.5 + t * 0.5);
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.alpha.needsUpdate = true;
    }
    
    ringRefs.current.forEach((ring, idx) => {
      if (!ring) return;
      const ringTime = time * 1.2 + idx * 0.5;
      const scale = 1 + Math.sin(ringTime) * 0.15;
      ring.scale.setScalar(scale);
      const rMat = ring.material as THREE.MeshBasicMaterial;
      rMat.opacity = 0.3 + Math.sin(ringTime * 2) * 0.3;
      ring.position.z += speed * delta * 0.5;
      
      if (ring.position.z > TUNNEL_RADIUS * 2) {
        ring.position.z = -TUNNEL_LENGTH;
      }
    });
    
    if (status === 'leaking' && state.camera) {
      state.camera.position.x = Math.sin(time * 15) * 0.1;
      state.camera.position.y = Math.cos(time * 13) * 0.1;
    }
  });

  useFrame((state) => {
    if (tunnelMeshRef.current) {
      (tunnelMeshRef.current.material as THREE.MeshBasicMaterial).color.lerp(color, 0.1);
    }
    ringRefs.current.forEach(ring => {
      if (ring) (ring.material as THREE.MeshBasicMaterial).color.lerp(glowColor, 0.1);
    });
  });

  return (
    <group ref={groupRef}>
      <mesh ref={tunnelMeshRef} geometry={tunnelGeometry} material={tunnelMaterial} />
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el; }}
          geometry={ringGeometry}
          material={ringMaterial}
          position={[0, 0, -i * (TUNNEL_LENGTH / 8) - TUNNEL_LENGTH * 0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}
      <mesh
        geometry={new THREE.CircleGeometry(TUNNEL_RADIUS * 1.2, 32)}
        material={new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })}
        position={[0, 0, TUNNEL_RADIUS]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={new THREE.CircleGeometry(TUNNEL_RADIUS * 1.2, 32)}
        material={new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })}
        position={[0, 0, -TUNNEL_LENGTH - TUNNEL_RADIUS]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
};