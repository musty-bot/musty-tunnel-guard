import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEngine, useProfiles, useConfig } from '../hooks/useEngine';
import { useMonitor } from '../hooks/useMonitor';
import { HealthScore } from '../components/HealthScore';
import { StatusBadge } from '../components/StatusBadge';
import { MustyFooter } from '../components/MustyFooter';
import { Profile } from '@config/schema';

export const Dashboard: React.FC = () => {
  const { tunnel, health, loading, error, connect, disconnect, runLeakTest } = useEngine();
  const { profiles, loading: profilesLoading } = useProfiles();
  const { config } = useConfig();
  const { currentSsid } = useMonitor();

  const activeProfile = profiles.find(p => tunnel && true);
  const connected = !!tunnel;

  const handleConnect = async (profile: Profile) => {
    await connect(profile.id);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleTest = async () => {
    await runLeakTest();
  };

  if (profilesLoading) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Tunnel Guard</Text>
        <StatusBadge status={health.status} />
      </View>

      <View style={styles.scoreCard}>
        <HealthScore score={health.score} status={health.status} size={140} />
        <Text style={styles.statusText}>{getStatusText(health.status)}</Text>
      </View>

      {connected && activeProfile && (
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Active Tunnel</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Profile:</Text>
            <Text style={styles.infoValue}>{activeProfile.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Server:</Text>
            <Text style={styles.infoValue}>{activeProfile.server}:{activeProfile.port}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SSID:</Text>
            <Text style={styles.infoValue}>{currentSsid || 'Unknown'}</Text>
          </View>
        </View>
      )}

      {!connected && profiles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Connect</Text>
          <View style={styles.profileList}>
            {profiles.slice(0, 3).map(p => (
              <TouchableOpacity key={p.id} style={styles.quickProfile} onPress={() => handleConnect(p)}>
                <Text style={styles.quickProfileName}>{p.name}</Text>
                <Text style={styles.quickProfileServer}>{p.server}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {error && (
        <View style={styles.error}>
          <Text>{error}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {connected ? (
          <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleDisconnect}>
            <Text style={styles.btnText}>Disconnect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={() => {}} disabled>
            <Text style={styles.btnText}>Select Profile</Text>
          </TouchableOpacity>
        )}
        {connected && (
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleTest}>
            <Text style={styles.btnText}>Run Leak Test</Text>
          </TouchableOpacity>
        )}
      </View>

      <MustyFooter />
    </ScrollView>
  );
};

function getStatusText(status: string): string {
  switch (status) {
    case 'secure': return 'All checks passed — tunnel verified';
    case 'warning': return 'Some checks failed — review results';
    case 'leaking': return 'Leaks detected — tunnel not secure';
    case 'disconnected': return 'No active tunnel';
    default: return '';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  scoreCard: { alignItems: 'center', marginBottom: 24 },
  statusText: { marginTop: 12, fontSize: 16, color: '#6B7280', textAlign: 'center' },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#111827' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#111827' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#111827' },
  profileList: { gap: 8 },
  quickProfile: { padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  quickProfileName: { fontSize: 16, fontWeight: '600' },
  quickProfileServer: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  error: { padding: 12, backgroundColor: '#FEF2F2', borderRadius: 8, borderWidth: 1, borderColor: '#FECACA', marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
  btn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10, minWidth: 160 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16, textAlign: 'center' },
  btnDanger: { backgroundColor: '#EF4444' },
  btnSecondary: { backgroundColor: '#3B82F6' },
});