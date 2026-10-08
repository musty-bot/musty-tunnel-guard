import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Canvas3D } from '../three/Canvas3D';
import { TunnelVisualization } from '../three/components/TunnelVisualization';
import { HealthScore3D } from '../three/components/HealthScore3D';
import { StatusIndicator3D } from '../three/components/StatusIndicator3D';
import { useEngine, useProfiles, useConfig } from '../hooks/useEngine';
import { useMonitor } from '../hooks/useMonitor';
import { MustyFooter } from '../components/MustyFooter';
import { Profile } from '@config/schema';
import { futuristicTheme } from '../three/theme';

export const Dashboard3D: React.FC = () => {
  const { tunnel, health, loading, error, connect, disconnect, runLeakTest } = useEngine();
  const { profiles, loading: profilesLoading } = useProfiles();
  const { config } = useConfig();
  const { currentSsid } = useMonitor();
  
  const [showQuickConnect, setShowQuickConnect] = useState(false);
  const [animValue] = useState(new Animated.Value(0));

  const activeProfile = profiles.find(p => tunnel && true);
  const connected = !!tunnel;

  const handleConnect = async (profile: Profile) => {
    await connect(profile.id);
    setShowQuickConnect(false);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleTest = async () => {
    await runLeakTest();
  };

  if (profilesLoading) {
    return (
      <Canvas3D style={styles.canvas}>
        <TunnelVisualization status="disconnected" intensity={0.3} />
      </Canvas3D>
    );
  }

  return (
    <View style={styles.container}>
      {/* 3D Background */}
      <Canvas3D style={styles.canvas}>
        <TunnelVisualization 
          status={health.status} 
          intensity={connected ? 1 : 0.3}
        />
      </Canvas3D>

      {/* UI Overlay */}
      <ScrollView style={styles.overlay} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>TUNNEL GUARD</Text>
            <Text style={styles.subtitle}>SECURE TUNNELS · VERIFIED</Text>
          </View>
          <StatusIndicator3D status={health.status} />
        </View>

        {/* Health Score - 3D */}
        <View style={styles.scoreCard}>
          <Canvas3D style={styles.scoreCanvas}>
            <HealthScore3D score={health.score} status={health.status} size={3.5} />
          </Canvas3D>
          <Text style={[styles.statusText, { color: futuristicTheme.colors[health.status] }]}>
            {getStatusText(health.status)}
          </Text>
          <Text style={styles.scoreValue}>{health.score}</Text>
        </View>

        {/* Active Tunnel Info */}
        {connected && activeProfile && (
          <View style={styles.profileCard}>
            <Text style={styles.cardTitle}>ACTIVE TUNNEL</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>PROFILE</Text>
                <Text style={styles.infoValue}>{activeProfile.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ENDPOINT</Text>
                <Text style={styles.infoValue}>{activeProfile.server}:{activeProfile.port}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>NETWORK</Text>
                <Text style={styles.infoValue}>{currentSsid || 'UNKNOWN'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>TYPE</Text>
                <Text style={styles.infoValue}>SOCKS5 PROXY</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Connect */}
        {!connected && profiles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUICK CONNECT</Text>
              <TouchableOpacity 
                style={styles.toggleBtn}
                onPress={() => setShowQuickConnect(!showQuickConnect)}
              >
                <Text style={styles.toggleBtnText}>
                  {showQuickConnect ? 'HIDE' : 'SHOW'} PROFILES
                </Text>
              </TouchableOpacity>
            </View>
            
            {showQuickConnect && (
              <View style={styles.profileList}>
                {profiles.slice(0, 4).map(p => (
                  <TouchableOpacity 
                    key={p.id} 
                    style={styles.quickProfile} 
                    onPress={() => handleConnect(p)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.quickProfileLeft}>
                      <View style={[styles.statusDot, { backgroundColor: '#666699' }]} />
                      <View>
                        <Text style={styles.quickProfileName}>{p.name}</Text>
                        <Text style={styles.quickProfileServer}>{p.server}</Text>
                      </View>
                    </View>
                    <Text style={styles.quickConnectBtn}>CONNECT</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.error}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {connected ? (
            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleDisconnect}>
              <Text style={styles.btnText}>DISCONNECT</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} disabled>
              <Text style={styles.btnText}>SELECT PROFILE</Text>
            </TouchableOpacity>
          )}
          {connected && (
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleTest}>
              <Text style={styles.btnText}>LEAK TEST</Text>
            </TouchableOpacity>
          )}
        </View>

        <MustyFooter />
      </ScrollView>
    </View>
  );
};

function getStatusText(status: string): string {
  switch (status) {
    case 'secure': return 'ALL SYSTEMS SECURE — TUNNEL VERIFIED';
    case 'warning': return 'ANOMALIES DETECTED — REVIEW REQUIRED';
    case 'leaking': return 'LEAKS DETECTED — TUNNEL COMPROMISED';
    case 'disconnected': return 'NO ACTIVE TUNNEL';
    default: return '';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: futuristicTheme.colors.bgDeep },
  canvas: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  overlay: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24,
    paddingTop: 10,
  },
  titleContainer: { flex: 1 },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: futuristicTheme.colors.textPrimary,
    letterSpacing: 3,
    textShadowColor: futuristicTheme.colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: { 
    fontSize: 11, 
    color: futuristicTheme.colors.primary, 
    letterSpacing: 4,
    marginTop: 2,
    fontWeight: '500',
  },
  
  scoreCard: { 
    alignItems: 'center', 
    marginBottom: 24,
    paddingVertical: 10,
  },
  scoreCanvas: { width: 180, height: 180 },
  statusText: { 
    marginTop: 12, 
    fontSize: 13, 
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: futuristicTheme.colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scoreValue: { 
    fontSize: 14, 
    color: futuristicTheme.colors.textSecondary,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  
  profileCard: { 
    backgroundColor: futuristicTheme.colors.bgCard, 
    borderRadius: futuristicTheme.borderRadius.lg, 
    padding: 20, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: futuristicTheme.colors.border,
    shadowColor: futuristicTheme.colors.primaryGlow,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: futuristicTheme.colors.primary,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  infoItem: { width: '48%', marginBottom: 12 },
  infoLabel: { 
    fontSize: 10, 
    color: futuristicTheme.colors.textMuted, 
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: futuristicTheme.colors.textPrimary,
    fontFamily: 'monospace',
  },
  
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: futuristicTheme.colors.textPrimary,
    letterSpacing: 1,
  },
  toggleBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: futuristicTheme.borderRadius.full,
    borderWidth: 1,
    borderColor: futuristicTheme.colors.primary,
    backgroundColor: futuristicTheme.colors.primary + '11',
  },
  toggleBtnText: { 
    color: futuristicTheme.colors.primary, 
    fontWeight: '600', 
    fontSize: 12,
  },
  
  profileList: { gap: 10 },
  quickProfile: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    backgroundColor: futuristicTheme.colors.bgCard, 
    borderRadius: futuristicTheme.borderRadius.md, 
    borderWidth: 1, 
    borderColor: futuristicTheme.colors.border,
  },
  quickProfileLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  quickProfileName: { fontSize: 16, fontWeight: '600', color: futuristicTheme.colors.textPrimary },
  quickProfileServer: { fontSize: 12, color: futuristicTheme.colors.textMuted, marginTop: 2, fontFamily: 'monospace' },
  quickConnectBtn: { 
    color: futuristicTheme.colors.primary, 
    fontWeight: '700', 
    fontSize: 12,
    letterSpacing: 1,
  },
  
  error: { 
    padding: 16, 
    backgroundColor: futuristicTheme.colors.leaking + '22', 
    borderRadius: futuristicTheme.borderRadius.md, 
    borderWidth: 1, 
    borderColor: futuristicTheme.colors.leaking,
    marginBottom: 16,
  },
  errorText: { color: futuristicTheme.colors.leaking, fontFamily: 'monospace', fontSize: 13 },
  
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
  btn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: futuristicTheme.borderRadius.md, minWidth: 180 },
  btnText: { color: futuristicTheme.colors.textOnAccent, fontWeight: '700', fontSize: 15, textAlign: 'center', letterSpacing: 1 },
  btnDanger: { backgroundColor: futuristicTheme.colors.leaking, shadowColor: futuristicTheme.colors.leaking, shadowOpacity: 0.4, shadowRadius: 12, elevation: 4 },
  btnPrimary: { backgroundColor: futuristicTheme.colors.primary, shadowColor: futuristicTheme.colors.primaryGlow, shadowOpacity: 0.4, shadowRadius: 12, elevation: 4 },
});