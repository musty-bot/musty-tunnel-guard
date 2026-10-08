export { version } from './version';
export { recipeRegistry, type RecipeConfig, type TunnelConfig } from './recipes/registry';
export { leakCheckRegistry } from './dns/checks/registry';
export { dnsProviderRegistry } from './dns/providers/registry';
export { authMethodRegistry } from './auth/registry';
export { createSshTunnel, AutoReconnect, type SshTunnel } from './ssh';
export { calculateHealth, type HealthScore, type HealthStatus } from './health';
export { type LeakCheckResult } from './contracts/LeakCheck';
export { type AuthCredentials, type AuthConfig } from './contracts/AuthMethod';
export { type DnsProvider, type DnsServer } from './contracts/DnsProvider';

import { recipeRegistry } from './recipes/registry';
import { leakCheckRegistry } from './dns/checks/registry';
import { dnsProviderRegistry } from './dns/providers/registry';
import { authMethodRegistry } from './auth/registry';
import { createSshTunnel, AutoReconnect } from './ssh';
import { calculateHealth } from './health';
import { LeakCheck } from './contracts/LeakCheck';
import { TunnelConnection } from './contracts/LeakCheck';
import { DnsLeakCheck } from './dns/checks/DnsLeak';
import { IpLeakCheck } from './dns/checks/IpLeak';
import { WebRtcLeakCheck } from './dns/checks/WebRtcLeak';

export const engine = {
  version: 'musty-v1',
  
  recipes: {
    getAll: () => recipeRegistry.getAll(),
    get: (id: string) => recipeRegistry.get(id),
    buildConfig: (recipeId: string, config: any) => {
      const recipe = recipeRegistry.get(recipeId);
      if (!recipe) throw new Error(`Recipe ${recipeId} not found`);
      return recipe.buildTunnelConfig(config);
    },
    validate: (recipeId: string, config: any) => {
      const recipe = recipeRegistry.get(recipeId);
      if (!recipe) throw new Error(`Recipe ${recipeId} not found`);
      return recipe.validate(config);
    },
  },

  checks: {
    getAll: () => leakCheckRegistry.getAll(),
    get: (id: string) => leakCheckRegistry.get(id),
    runAll: async (tunnel: TunnelConnection, checkIds?: string[]) => {
      const checks = checkIds 
        ? leakCheckRegistry.getByIds(checkIds)
        : leakCheckRegistry.getAll();
      return Promise.all(checks.map(c => c.run(tunnel)));
    },
  },

  providers: {
    getAll: () => dnsProviderRegistry.getAll(),
    get: (id: string) => dnsProviderRegistry.get(id),
  },

  auth: {
    getAll: () => authMethodRegistry.getAll(),
    get: (id: string) => authMethodRegistry.get(id),
    resolve: async (methodId: string, config: any) => {
      const method = authMethodRegistry.get(methodId);
      if (!method) throw new Error(`Auth method ${methodId} not found`);
      return method.resolve(config);
    },
  },

  tunnel: {
    create: createSshTunnel,
    autoReconnect: AutoReconnect,
  },

  health: {
    calculate: calculateHealth,
  },

  dns: {
    harden: async (providerId: string, configId?: string) => {
      const provider = dnsProviderRegistry.get(providerId);
      if (!provider) throw new Error(`Provider ${providerId} not found`);
      return provider.servers;
    },
  },
};

export default engine;