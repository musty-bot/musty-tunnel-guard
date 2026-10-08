import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { ConfigSchema, ProfileSchema, NetworkRuleSchema, HistoryEntrySchema } from './schema';
import { defaultConfig, createDefaultProfile, defaultNetworkRules } from './defaults';
import { Config, Profile, NetworkRule, HistoryEntry } from './schema';

const KEYS = {
  config: 'musty:config',
  profiles: 'musty:profiles',
  networks: 'musty:networks',
  history: 'musty:history',
};

async function getJSON<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

async function setJSON(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const configStore = {
  async get(): Promise<Config> {
    const data = await getJSON(KEYS.config, defaultConfig);
    return ConfigSchema.parse(data);
  },
  async set(config: Config): Promise<void> {
    await setJSON(KEYS.config, ConfigSchema.parse(config));
  },
};

export const profileStore = {
  async getAll(): Promise<Profile[]> {
    const data = await getJSON(KEYS.profiles, [] as Profile[]);
    return z.array(ProfileSchema).parse(data);
  },
  async get(id: string): Promise<Profile | undefined> {
    const profiles = await this.getAll();
    return profiles.find(p => p.id === id);
  },
  async save(profile: Profile): Promise<void> {
    const profiles = await this.getAll();
    const idx = profiles.findIndex(p => p.id === profile.id);
    const updated = { ...profile, updatedAt: Date.now() };
    if (idx >= 0) profiles[idx] = updated;
    else profiles.push(updated);
    await setJSON(KEYS.profiles, profiles);
  },
  async delete(id: string): Promise<void> {
    const profiles = await this.getAll();
    await setJSON(KEYS.profiles, profiles.filter(p => p.id !== id));
  },
};

export const networkStore = {
  async getAll(): Promise<NetworkRule[]> {
    const data = await getJSON(KEYS.networks, defaultNetworkRules);
    return z.array(NetworkRuleSchema).parse(data);
  },
  async save(rules: NetworkRule[]): Promise<void> {
    await setJSON(KEYS.networks, rules);
  },
};

export const historyStore = {
  async append(entry: HistoryEntry): Promise<void> {
    const history = await getJSON(KEYS.history, [] as HistoryEntry[]);
    history.push(entry);
    if (history.length > 1000) history.splice(0, history.length - 1000);
    await setJSON(KEYS.history, history);
  },
  async getAll(limit = 100): Promise<HistoryEntry[]> {
    const data = await getJSON(KEYS.history, [] as HistoryEntry[]);
    return z.array(HistoryEntrySchema).parse(data).slice(-limit);
  },
};