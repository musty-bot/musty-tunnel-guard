import { DnsProvider, DnsServer } from '../../contracts/DnsProvider';
import { dnsProviderRegistry } from './registry';

export class NextDnsProvider extends DnsProvider {
  readonly id = 'nextdns';
  readonly name = 'NextDNS';
  readonly description = 'Customizable DNS with analytics and blocking';
  readonly servers: DnsServer[] = [
    { address: '45.90.28.0', protocol: 'doh', hostname: 'dns.nextdns.io', path: '/{configId}' },
    { address: '45.90.30.0', protocol: 'doh', hostname: 'dns.nextdns.io', path: '/{configId}' },
    { address: '45.90.28.0', protocol: 'dot', hostname: 'dns.nextdns.io' },
    { address: '45.90.30.0', protocol: 'dot', hostname: 'dns.nextdns.io' },
  ];

  getServers(configId?: string): DnsServer[] {
    return this.servers.map(s => ({
      ...s,
      path: s.path?.replace('{configId}', configId || ''),
    }));
  }
}

dnsProviderRegistry.register(new NextDnsProvider());