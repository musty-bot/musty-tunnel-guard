export interface LeakCheckResult {
  passed: boolean;
  details: string;
  fix?: string;
}

export interface TunnelConnection {
  socks5Proxy: string;
  close(): Promise<void>;
}

export abstract class LeakCheck {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;

  abstract run(tunnel: TunnelConnection): Promise<LeakCheckResult>;
}