import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useConfig } from '@ui/hooks/useEngine';
import { engine } from '@engine/musty';
import { version, engineName, corporation, appId } from '@engine/version';
import { MustyFooter } from '@ui/components/MustyFooter';

export const Settings: React.FC = () => {
  const { config, update } = useConfig();
  const providers = engine.providers.getAll();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.themePicker}>
            {['light', 'dark', 'system'].map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.themeOption, config?.theme === t && styles.themeOptionActive]}
                onPress={() => update({ theme: t as any })}
              >
                <Text style={[styles.themeOptionText, config?.theme === t && styles.themeOptionTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tunnel Behavior</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Auto Reconnect</Text>
            <Text style={styles.settingDesc}>Automatically reconnect if tunnel drops</Text>
          </View>
          <Switch
            value={config?.autoReconnect ?? true}
            onValueChange={v => update({ autoReconnect: v })}
          />
        </View>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Kill Switch</Text>
            <Text style={styles.settingDesc}>Block all traffic if tunnel disconnects</Text>
          </View>
          <Switch
            value={config?.killSwitch ?? false}
            onValueChange={v => update({ killSwitch: v })}
          />
        </View>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Monitor Interval</Text>
            <Text style={styles.settingDesc}>Check network every {config?.monitorInterval ?? 300}s</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default DNS Provider</Text>
        <View style={styles.providerList}>
          {providers.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.providerOption, config?.defaultDnsProvider === p.id && styles.providerOptionActive]}
              onPress={() => update({ defaultDnsProvider: p.id })}
            >
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{p.name}</Text>
                <Text style={styles.providerDesc}>{p.description}</Text>
              </View>
              {config?.defaultDnsProvider === p.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Engine</Text>
          <Text style={styles.aboutValue}>{version}</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Powered by</Text>
          <Text style={styles.aboutValue}>{corporation}</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>App ID</Text>
          <Text style={styles.aboutValue}>{appId}</Text>
        </View>
      </View>

      <MustyFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16, color: '#111827' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  settingLabel: { fontSize: 16, fontWeight: '500', color: '#111827' },
  settingDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  themePicker: { flexDirection: 'row', gap: 8 },
  themeOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },
  themeOptionActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  themeOptionText: { fontSize: 14, color: '#374151' },
  themeOptionTextActive: { color: '#3B82F6', fontWeight: '600' },
  providerList: { gap: 8 },
  providerOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  providerOptionActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 16, fontWeight: '600' },
  providerDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  checkmark: { fontSize: 18, color: '#3B82F6', fontWeight: 'bold' },
  aboutItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  aboutLabel: { fontSize: 14, color: '#6B7280' },
  aboutValue: { fontSize: 14, fontWeight: '500', color: '#111827', fontFamily: 'monospace' },
});