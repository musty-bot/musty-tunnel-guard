import { z } from 'zod';

export const ConfigSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  monitorInterval: z.number().min(30).max(3600).default(300),
  autoReconnect: z.boolean().default(true),
  killSwitch: z.boolean().default(false),
  defaultDnsProvider: z.string().default('cloudflare'),
  lastProfileId: z.string().uuid().optional(),
  engine: z.literal('musty-v1'),
});

export const VerifySettingsSchema = z.object({
  dnsLeak: z.boolean().default(true),
  ipLeak: z.boolean().default(true),
  webrtcLeak: z.boolean().default(true),
});

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  recipeId: z.string(),
  server: z.string().min(1),
  port: z.number().min(1).max(65535).default(22),
  username: z.string().min(1),
  authType: z.enum(['key', 'password']),
  authRef: z.string(),
  tunnelType: z.literal('socks5'),
  localPort: z.number().min(1).max(65535),
  verifySettings: VerifySettingsSchema.default(() => ({ dnsLeak: true, ipLeak: true, webrtcLeak: true })),
  keepaliveInterval: z.number().min(5).max(300).default(20),
  createdAt: z.number(),
  updatedAt: z.number(),
  engine: z.literal('musty-v1'),
});

export const NetworkRuleSchema = z.object({
  ssid: z.string(),
  action: z.enum(['auto', 'prompt', 'none']),
  profileId: z.string().uuid().optional(),
});

export const HistoryEntrySchema = z.object({
  ts: z.number(),
  event: z.enum(['tunnel-up', 'tunnel-down', 'leak-test', 'reconnect', 'error']),
  profileId: z.string().uuid().optional(),
  details: z.record(z.string(), z.unknown()),
  engine: z.literal('musty-v1'),
});

export type Config = z.infer<typeof ConfigSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type NetworkRule = z.infer<typeof NetworkRuleSchema>;
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
export type VerifySettings = z.infer<typeof VerifySettingsSchema>;