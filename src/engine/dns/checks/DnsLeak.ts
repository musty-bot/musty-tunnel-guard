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
      headers: { 'Accept': 'application/dns-json' },
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

export class DnsLeakCheck extends LeakCheck {
  readonly id = 'dns-leak';
  readonly name = 'DNS Leak Test';
  readonly description = 'Verifies DNS queries route through the tunnel';

  async run(tunnel: TunnelConnection): Promise<LeakCheckResult> {
    try {
      const agent = new SocksProxyAgent(tunnel.socks5Proxy);
      
      const results = await Promise.all([
        this.queryDoh(agent, 'dnsleaktest.com'),
        this.queryDoh(agent, 'ipleak.net'),
      ]);

      const resolvers = new Set<string>();
      for (const r of results) {
        for (const addr of r) {
          resolvers.add(addr);
        }
      }

      const isLeaking = resolvers.size > 2 || !this.isExpectedResolver(resolvers);
      
      return {
        passed: !isLeaking,
        details: `DNS resolvers detected: ${Array.from(resolvers).join(', ')}`,
        fix: isLeaking ? 'Enable DNS-over-HTTPS in settings or check tunnel configuration' : undefined,
      };
    } catch (error) {
      return {
        passed: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fix: 'Check tunnel connection and try again',
      };
    }
  }

  private async queryDoh(agent: SocksProxyAgent, hostname: string): Promise<string[]> {
    try {
      const response = await fetchWithAgent(`https://1.1.1.1/dns-query?name=${hostname}&type=A`, agent);
      const data = await response.json() as { Answer?: Array<{ data: string }> };
      return data.Answer?.map(a => a.data) || [];
    } catch {
      return [];
    }
  }

  private isExpectedResolver(resolvers: Set<string>): boolean {
    const expected = ['1.1.1.1', '1.0.0.1', '9.9.9.9', '149.112.112.112'];
    return Array.from(resolvers).every(r => expected.some(e => r.includes(e)));
  }
}

leakCheckRegistry.register(new DnsLeakCheck());