import { Client, ConnectConfig } from 'ssh2';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { TunnelConfig } from '@engine/contracts/Recipe';
import { AuthCredentials } from '@engine/contracts/AuthMethod';

export interface SshTunnel {
  socks5Proxy: string;
  localPort: number;
  close(): Promise<void>;
  on(event: string, listener: (...args: any[]) => void): SshTunnel;
}

export function createSshTunnel(
  tunnelConfig: TunnelConfig,
  credentials: AuthCredentials
): Promise<SshTunnel> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let server: any = null;

    const connectConfig: ConnectConfig = {
      host: tunnelConfig.remoteHost,
      port: tunnelConfig.remotePort,
      username: tunnelConfig.username,
      readyTimeout: 30000,
      keepaliveInterval: tunnelConfig.keepaliveInterval * 1000,
      keepaliveCountMax: 3,
    };

    if (credentials.privateKey) {
      connectConfig.privateKey = credentials.privateKey;
      if (credentials.passphrase) connectConfig.passphrase = credentials.passphrase;
    } else if (credentials.password) {
      connectConfig.password = credentials.password;
    } else if (credentials.agentSocket) {
      connectConfig.agent = credentials.agentSocket;
    }

    conn.on('ready', () => {
      conn.forwardIn('127.0.0.1', tunnelConfig.localPort, (err: any, server_: any) => {
        if (err) {
          conn.end();
          reject(err);
          return;
        }
        server = server_;
        const proxyUrl = `socks5://127.0.0.1:${tunnelConfig.localPort}`;
        const tunnel: SshTunnel = {
          socks5Proxy: proxyUrl,
          localPort: tunnelConfig.localPort,
          close: () => closeTunnel(conn, server),
          on: (event: string, listener: (...args: any[]) => void) => {
            (conn as any).on(event, listener);
            return tunnel;
          },
        };
        resolve(tunnel);
      });
    });

    conn.on('error', (err: any) => {
      reject(err);
    });

    conn.on('close', () => {
      if (server) server.close();
    });

    conn.connect(connectConfig);
  });
}

async function closeTunnel(conn: Client, server: any): Promise<void> {
  return new Promise((resolve) => {
    if (server) server.close();
    conn.end();
    conn.on('close', resolve);
    setTimeout(resolve, 1000);
  });
}

export function createSocksAgent(tunnel: SshTunnel): SocksProxyAgent {
  return new SocksProxyAgent(tunnel.socks5Proxy);
}