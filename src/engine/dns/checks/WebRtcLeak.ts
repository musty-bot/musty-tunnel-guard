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
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TunnelGuard/1.0)' },
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

export class WebRtcLeakCheck extends LeakCheck {
  readonly id = 'webrtc-leak';
  readonly name = 'WebRTC Leak Test';
  readonly description = 'Checks for WebRTC IP leaks (may not work on all mobile platforms)';

  async run(tunnel: TunnelConnection): Promise<LeakCheckResult> {
    try {
      const agent = new SocksProxyAgent(tunnel.socks5Proxy);
      
      const response = await fetchWithAgent('https://browserleaks.com/webrtc', agent);
      const html = await response.text();
      
      const hasLocalIp = /(\b(?:10|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b)/.test(html);
      const hasPublicIp = /\b(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){3}\b/.test(html);
      
      const isLeaking = hasLocalIp || hasPublicIp;
      
      return {
        passed: !isLeaking,
        details: isLeaking 
          ? 'WebRTC may be exposing local/public IPs' 
          : 'No WebRTC leaks detected',
        fix: isLeaking 
          ? 'Disable WebRTC in browser settings or use a browser with WebRTC blocking' 
          : undefined,
      };
    } catch (error) {
      return {
        passed: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fix: 'WebRTC test may not work on this platform',
      };
    }
  }
}

leakCheckRegistry.register(new WebRtcLeakCheck());