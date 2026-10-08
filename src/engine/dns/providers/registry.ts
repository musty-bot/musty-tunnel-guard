import { DnsProvider } from '../../contracts/DnsProvider';

class DnsProviderRegistry {
  private providers = new Map<string, DnsProvider>();

  register(provider: DnsProvider): void {
    if (this.providers.has(provider.id)) {
      throw new Error(`DnsProvider with id ${provider.id} already registered`);
    }
    this.providers.set(provider.id, provider);
  }

  get(id: string): DnsProvider | undefined {
    return this.providers.get(id);
  }

  getAll(): DnsProvider[] {
    return Array.from(this.providers.values());
  }

  getByIds(ids: string[]): DnsProvider[] {
    return ids.map(id => this.providers.get(id)).filter((p): p is DnsProvider => p !== undefined);
  }
}

export const dnsProviderRegistry = new DnsProviderRegistry();