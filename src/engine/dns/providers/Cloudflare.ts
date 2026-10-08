import { DnsProvider, DnsServer } from '../../contracts/DnsProvider';
import { dnsProviderRegistry } from './registry';

export class CloudflareProvider extends DnsProvider {
  readonly id = 'cloudflare';
  readonly name = 'Cloudflare (1.1.1.1)';
  readonly description = 'Fast, privacy-focused DNS with DoH/DoT support';
  readonly servers: DnsServer[] = [
    { address: '1.1.1.1', protocol: 'doh', hostname: 'cloudflare-dns.com', path: '/dns-query' },
    { address: '1.0.0.1', protocol: 'doh', hostname: 'cloudflare-dns.com', path: '/dns-query' },
    { address: '1.1.1.1', protocol: 'dot', hostname: 'cloudflare-dns.com' },
    { address: '1.0.0.1', protocol: 'dot', hostname: 'cloudflare-dns.com' },
  ];
}

dnsProviderRegistry.register(new CloudflareProvider());