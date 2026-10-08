import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';

interface Canvas3DProps {
  children: React.ReactNode;
  style?: any;
  onCreated?: (gl: any) => void;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({ children, style, onCreated }) => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // For r3f native, we don't need asset preloading
  useEffect(() => {
    setAssetsLoaded(true);
  }, []);

  if (!assetsLoaded) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loading}>
          <View style={styles.loadingBar} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Canvas
        style={StyleSheet.absoluteFill}
        onCreated={(state) => {
          state.gl.setPixelRatio(Math.min(2, (window as any).devicePixelRatio || 1));
          onCreated?.(state.gl);
        }}
        camera={{ position: [0, 0, 15], fov: 50 }}
        shadows={false}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      >
        {children}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050510' },
  loadingBar: {
    width: 60, height: 3, borderRadius: 2,
    backgroundColor: '#00F5FF33',
    overflow: 'hidden',
  },
});