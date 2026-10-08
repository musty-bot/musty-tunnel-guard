export interface RecipeConfig {
  id: string;
  name: string;
  server: string;
  port: number;
  username: string;
  authRef: string;
  keepaliveInterval?: number;
  verifySettings?: {
    dnsLeak?: boolean;
    ipLeak?: boolean;
    webrtcLeak?: boolean;
  };
}

export interface TunnelConfig {
  type: 'socks5';
  localPort: number;
  remoteHost: string;
  remotePort: number;
  username: string;
  privateKey?: string;
  passphrase?: string;
  password?: string;
  keepaliveInterval: number;
}

export abstract class Recipe {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly defaultPort: number;

  abstract getDefaults(): Partial<RecipeConfig>;
  abstract validate(config: RecipeConfig): { valid: boolean; errors: string[] };
  abstract buildTunnelConfig(config: RecipeConfig): TunnelConfig;
}