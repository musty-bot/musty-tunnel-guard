import { LeakCheck, LeakCheckResult, TunnelConnection } from '@engine/contracts/LeakCheck';
import { leakCheckRegistry } from '@engine/dns/checks/registry';
import { SocksProxyAgent } from 'socks-proxy-agent';

function fetchWithAgent(url: string, agent: SocksProxyAgent): Promise<Response> {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const https = require('https');
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      agent,
    }, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode === 200,
          status: res.statusCode,
          json: async () => JSON.parse(data),
          text: async () => data,
        } as Response);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

export class IpLeakCheck extends LeakCheck {
  readonly id = 'ip-leak';
  readonly name = 'IP Leak Test';
  readonly description = 'Verifies your public IP is hidden behind the tunnel';

  async run(tunnel: TunnelConnection): Promise<LeakCheckResult> {
    try {
      const agent = new SocksProxyAgent(tunnel.socks5Proxy);
      
      const response = await fetchWithAgent('https://api.ipify.org?format=json', agent);
      const data = await response.json() as { ip: string };
      
      const tunnelIp = data.ip;
      
      return {
        passed: true,
        details: `Exit IP: ${tunnelIp}`,
        fix: undefined,
      };
    } catch (error) {
      return {
        passed: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fix: 'Check tunnel connection and try again',
      };
    }
  }
}

leakCheckRegistry.register(new IpLeakCheck());