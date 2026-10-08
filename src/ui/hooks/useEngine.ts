import { useState, useEffect, useCallback } from 'react';
import { engine, SshTunnel, HealthScore, LeakCheckResult } from '@engine/musty';
import { configStore, profileStore } from '@config/store';
import { Config, Profile } from '@config/schema';

export function useEngine() {
  const [tunnel, setTunnel] = useState<SshTunnel | null>(null);
  const [health, setHealth] = useState<HealthScore>({ score: 0, status: 'disconnected', checks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (profileId: string) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await profileStore.get(profileId);
      if (!profile) throw new Error('Profile not found');

      const recipe = engine.recipes.get(profile.recipeId);
      if (!recipe) throw new Error('Recipe not found');

      const authMethod = engine.auth.get(profile.authType);
      if (!authMethod) throw new Error('Auth method not found');

      const credentials = await authMethod.resolve({
        type: profile.authType,
        username: profile.username,
        keyRef: profile.authType === 'key' ? profile.authRef : undefined,
        passwordRef: profile.authType === 'password' ? profile.authRef : undefined,
      });

      const tunnelConfig = recipe.buildTunnelConfig({
        ...profile,
        authRef: profile.authRef,
      });

      const sshTunnel = await engine.tunnel.create(tunnelConfig, credentials);
      setTunnel(sshTunnel);

      const checkIds = [
        profile.verifySettings.dnsLeak && 'dns-leak',
        profile.verifySettings.ipLeak && 'ip-leak',
        profile.verifySettings.webrtcLeak && 'webrtc-leak',
      ].filter(Boolean) as string[];

      const results = await engine.checks.runAll(sshTunnel, checkIds);
      setHealth(engine.health.calculate(true, results));

      const currentConfig = await configStore.get();
      await configStore.set({ ...currentConfig, lastProfileId: profileId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setHealth(engine.health.calculate(false, []));
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (tunnel) {
      await tunnel.close();
      setTunnel(null);
      setHealth(engine.health.calculate(false, []));
    }
  }, [tunnel]);

  const runLeakTest = useCallback(async (checkIds?: string[]) => {
    if (!tunnel) return;
    setLoading(true);
    try {
      const results = await engine.checks.runAll(tunnel, checkIds);
      setHealth(engine.health.calculate(true, results));
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setLoading(false);
    }
  }, [tunnel]);

  return { tunnel, health, loading, error, connect, disconnect, runLeakTest };
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await profileStore.getAll();
    setProfiles(data);
    setLoading(false);
  };

  const save = async (profile: Profile) => {
    await profileStore.save(profile);
    await load();
  };

  const remove = async (id: string) => {
    await profileStore.delete(id);
    await load();
  };

  return { profiles, loading, save, remove, refresh: load };
}

export function useConfig() {
  const [config, setConfigState] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configStore.get().then((c: Config) => { setConfigState(c); setLoading(false); });
  }, []);

  const update = async (partial: Partial<Config>) => {
    const current = await configStore.get();
    const updated = { ...current, ...partial };
    await configStore.set(updated);
    setConfigState(updated);
  };

  return { config, loading, update };
}