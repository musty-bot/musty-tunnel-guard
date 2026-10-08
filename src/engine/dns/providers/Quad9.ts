import { DnsProvider, DnsServer } from '../../contracts/DnsProvider';
import { dnsProviderRegistry } from './registry';

export class Quad9Provider extends DnsProvider {
  readonly id = 'quad9';
  readonly name = 'Quad9 (9.9.9.9)';
  readonly description = 'Security-focused DNS with threat blocking';
  readonly servers: DnsServer[] = [
    { address: '9.9.9.9', protocol: 'doh', hostname: 'dns.quad9.net', path: '/dns-query' },
    { address: '149.112.112.112', protocol: 'doh', hostname: 'dns.quad9.net', path: '/dns-query' },
    { address: '9.9.9.9', protocol: 'dot', hostname: 'dns.quad9.net' },
    { address: '149.112.112.112', protocol: 'dot', hostname: 'dns.quad9.net' },
  ];
}

dnsProviderRegistry.register(new Quad9Provider());