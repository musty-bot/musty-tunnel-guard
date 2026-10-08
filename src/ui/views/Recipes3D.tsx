import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { Canvas3D } from '../three/Canvas3D';
import { TunnelVisualization } from '../three/components/TunnelVisualization';
import { StatusIndicator3D } from '../three/components/StatusIndicator3D';
import { useEngine, useProfiles } from '../hooks/useEngine';
import { ProfileCard } from '../components/ProfileCard';
import { MustyFooter } from '../components/MustyFooter';
import { createDefaultProfile } from '../../config/defaults';
import { Profile } from '@config/schema';
import { futuristicTheme } from '../three/theme';

export const Recipes3D: React.FC = () => {
  const { profiles, save, remove } = useProfiles();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [animValue] = useState(new Animated.Value(0));

  const recipes = [
    { id: 'safe-public-wifi', name: 'SAFE PUBLIC WIFI', desc: 'Encrypt all traffic on public networks', icon: '🛡️' },
    { id: 'remote-database', name: 'REMOTE DATABASE', desc: 'Secure tunnel to remote databases', icon: '🗄️' },
    { id: 'home-server', name: 'HOME SERVER', desc: 'Access home server from anywhere', icon: '🏠' },
  ];

  const handleNew = (recipeId: string) => {
    const profile = createDefaultProfile({ recipeId, name: '', server: '', username: '', authRef: '' });
    setEditing(profile);
    setShowCreate(false);
  };

  const handleEdit = (profile: Profile) => setEditing(profile);

  const handleSave = async (profile: Profile) => {
    await save(profile);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('DELETE PROFILE', 'Are you sure?', [
      { text: 'CANCEL', style: 'cancel' },
      { text: 'DELETE', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  const handleTest = async () => {
    Alert.alert('TEST', 'Connection test would run here');
  };

  return (
    <View style={styles.container}>
      {/* 3D Background */}
      <Canvas3D style={styles.canvas}>
        <TunnelVisualization status="disconnected" intensity={0.4} />
      </Canvas3D>

      {/* UI Overlay */}
      <ScrollView style={styles.overlay} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>RECIPES</Text>
            <Text style={styles.subtitle}>TUNNEL PRESETS</Text>
          </View>
          <StatusIndicator3D status="disconnected" />
        </View>

        {/* Recipe Grid */}
        {showCreate && (
          <View style={styles.recipeGrid}>
            {recipes.map(r => (
              <TouchableOpacity key={r.id} style={styles.recipeCard} onPress={() => handleNew(r.id)} activeOpacity={0.7}>
                <View style={styles.recipeIconContainer}>
                  <Text style={styles.recipeIcon}>{r.icon}</Text>
                </View>
                <Text style={styles.recipeName}>{r.name}</Text>
                <Text style={styles.recipeDesc}>{r.desc}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.recipeCard, styles.cancelCard]} onPress={() => setShowCreate(false)} activeOpacity={0.7}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        )}

        {!showCreate && (
          <>
            {/* New Profile Button */}
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(true)} activeOpacity={0.7}>
              <Text style={styles.addBtnText}>+ NEW PROFILE</Text>
            </TouchableOpacity>

            {/* Saved Profiles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SAVED PROFILES</Text>
              {profiles.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>NO PROFILES CONFIGURED</Text>
                  <Text style={styles.emptySub}>TAP + NEW PROFILE TO CREATE ONE</Text>
                </View>
              ) : (
                profiles.map(p => (
                  <View key={p.id} style={styles.profileItem}>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{p.name}</Text>
                      <Text style={styles.profileServer}>{p.server}:{p.port}</Text>
                    </View>
                    <View style={styles.profileActions}>
                      <TouchableOpacity onPress={() => handleEdit(p)} style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>EDIT</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(p.id)} style={styles.deleteBtn}>
                        <Text style={styles.deleteBtnText}>DELETE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        {/* Profile Editor */}
        {editing && (
          <Animated.View style={[styles.editorOverlay, styles.editorCard]}>
            <ProfileCard
              profile={editing}
              onChange={setEditing}
              onSave={() => handleSave(editing!)}
              onTest={handleTest}
            />
          </Animated.View>
        )}

        <MustyFooter />
      </ScrollView>
    </View>
  );
};

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
  
  addBtn: { 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    backgroundColor: futuristicTheme.colors.primary + '11', 
    borderRadius: futuristicTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: futuristicTheme.colors.primary,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  addBtnText: { color: futuristicTheme.colors.primary, fontWeight: '700', letterSpacing: 1 },
  
  recipeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  recipeCard: { 
    flex: 1, 
    minWidth: '45%', 
    padding: 24, 
    backgroundColor: futuristicTheme.colors.bgCard, 
    borderRadius: futuristicTheme.borderRadius.lg, 
    borderWidth: 1, 
    borderColor: futuristicTheme.colors.border,
    alignItems: 'center',
    shadowColor: futuristicTheme.colors.primaryGlow,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cancelCard: { borderColor: futuristicTheme.colors.textMuted, backgroundColor: futuristicTheme.colors.bgDark },
  recipeIconContainer: { 
    width: 60, height: 60, borderRadius: 30, 
    backgroundColor: futuristicTheme.colors.primary + '11',
    borderWidth: 1,
    borderColor: futuristicTheme.colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  recipeIcon: { fontSize: 28 },
  recipeName: { fontSize: 15, fontWeight: '700', color: futuristicTheme.colors.textPrimary, textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 },
  recipeDesc: { fontSize: 12, color: futuristicTheme.colors.textMuted, textAlign: 'center', lineHeight: 18 },
  cancelText: { color: futuristicTheme.colors.textMuted, fontWeight: '700', letterSpacing: 1 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: futuristicTheme.colors.primary, letterSpacing: 2, marginBottom: 16 },
  
  empty: { alignItems: 'center', padding: 40, backgroundColor: futuristicTheme.colors.bgCard, borderRadius: futuristicTheme.borderRadius.lg, borderWidth: 1, borderColor: futuristicTheme.colors.border },
  emptyText: { fontSize: 16, fontWeight: '700', color: futuristicTheme.colors.textMuted, marginBottom: 4, letterSpacing: 1 },
  emptySub: { fontSize: 12, color: futuristicTheme.colors.textMuted, letterSpacing: 1 },
  
  profileItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: futuristicTheme.colors.bgCard, 
    borderRadius: futuristicTheme.borderRadius.md, 
    borderWidth: 1, 
    borderColor: futuristicTheme.colors.border, 
    marginBottom: 10 
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: futuristicTheme.colors.textPrimary },
  profileServer: { fontSize: 12, color: futuristicTheme.colors.textMuted, marginTop: 2, fontFamily: 'monospace' },
  profileActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: futuristicTheme.colors.bgElevated, 
    borderRadius: futuristicTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: futuristicTheme.colors.border,
  },
  actionBtnText: { color: futuristicTheme.colors.primary, fontWeight: '700', fontSize: 12 },
  deleteBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: futuristicTheme.colors.leaking + '22', 
    borderRadius: futuristicTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: futuristicTheme.colors.leaking,
  },
  deleteBtnText: { color: futuristicTheme.colors.leaking, fontWeight: '700', fontSize: 12 },
  
  editorOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', padding: 20 },
  editorCard: { maxHeight: '90%' },
});