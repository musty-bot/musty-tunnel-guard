import { Config, Profile, NetworkRule } from './schema';

export const defaultConfig: Config = {
  theme: 'system',
  monitorInterval: 300,
  autoReconnect: true,
  killSwitch: false,
  defaultDnsProvider: 'cloudflare',
  engine: 'musty-v1',
};

export function createDefaultProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: crypto.randomUUID(),
    name: '',
    recipeId: 'safe-public-wifi',
    server: '',
    port: 22,
    username: '',
    authType: 'key',
    authRef: '',
    tunnelType: 'socks5',
    localPort: 1080,
    verifySettings: { dnsLeak: true, ipLeak: true, webrtcLeak: true },
    keepaliveInterval: 20,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    engine: 'musty-v1',
    ...overrides,
  };
}

export const defaultNetworkRules: NetworkRule[] = [
  { ssid: '*', action: 'prompt' },
];