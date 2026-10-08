export type DnsProtocol = 'doh' | 'dot' | 'plain';

export interface DnsServer {
  address: string;
  protocol: DnsProtocol;
  hostname?: string;
  path?: string;
}

export abstract class DnsProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly servers: DnsServer[];
}