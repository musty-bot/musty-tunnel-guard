import { SshTunnel, createSshTunnel } from './tunnel';
import { TunnelConfig } from '../contracts/Recipe';
import { AuthCredentials } from '../contracts/AuthMethod';

export interface ReconnectOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onReconnecting?: (attempt: number) => void;
  onReconnected?: () => void;
  onFailed?: (error: Error) => void;
}

export class AutoReconnect {
  private tunnel: SshTunnel | null = null;
  private retries = 0;
  private stopped = false;
  private readonly options: Required<ReconnectOptions>;

  constructor(
    private readonly tunnelConfig: TunnelConfig,
    private readonly credentials: AuthCredentials,
    options: ReconnectOptions = {}
  ) {
    this.options = {
      maxRetries: options.maxRetries ?? 10,
      baseDelay: options.baseDelay ?? 1000,
      maxDelay: options.maxDelay ?? 60000,
      onReconnecting: options.onReconnecting ?? (() => {}),
      onReconnected: options.onReconnected ?? (() => {}),
      onFailed: options.onFailed ?? (() => {}),
    };
  }

  async start(): Promise<SshTunnel> {
    this.stopped = false;
    return this.connect();
  }

  private async connect(): Promise<SshTunnel> {
    try {
      this.tunnel = await createSshTunnel(this.tunnelConfig, this.credentials);
      this.retries = 0;
      this.options.onReconnected();
      this.setupListeners();
      return this.tunnel;
    } catch (error) {
      if (this.stopped) throw error;
      return this.handleError(error as Error);
    }
  }

  private setupListeners(): void {
    if (!this.tunnel) return;
    this.tunnel.on('close', () => {
      if (!this.stopped) this.reconnect();
    });
    this.tunnel.on('error', (err) => {
      if (!this.stopped) this.reconnect();
    });
  }

  private async reconnect(): Promise<void> {
    if (this.retries >= this.options.maxRetries) {
      this.options.onFailed(new Error('Max reconnection attempts reached'));
      return;
    }

    this.retries++;
    this.options.onReconnecting(this.retries);

    const delay = Math.min(
      this.options.baseDelay * Math.pow(2, this.retries - 1),
      this.options.maxDelay
    );

    await new Promise(r => setTimeout(r, delay));
    
    if (!this.stopped) {
      await this.connect();
    }
  }

  private async handleError(error: Error): Promise<SshTunnel> {
    if (this.retries >= this.options.maxRetries) {
      this.options.onFailed(error);
      throw error;
    }
    return this.reconnect().then(() => this.tunnel!);
  }

  stop(): void {
    this.stopped = true;
    if (this.tunnel) {
      this.tunnel.close();
      this.tunnel = null;
    }
  }

  getCurrentTunnel(): SshTunnel | null {
    return this.tunnel;
  }
}