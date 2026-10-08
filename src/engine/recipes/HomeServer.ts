import { Recipe, RecipeConfig, TunnelConfig } from '../contracts/Recipe';
import { recipeRegistry } from './registry';

export class HomeServerRecipe extends Recipe {
  readonly id = 'home-server';
  readonly name = 'Home Server';
  readonly description = 'Access your home server securely from anywhere';
  readonly defaultPort = 22;

  getDefaults(): Partial<RecipeConfig> {
    return {
      port: 22,
      verifySettings: { dnsLeak: true, ipLeak: true, webrtcLeak: true },
      keepaliveInterval: 25,
    };
  }

  validate(config: RecipeConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config.server) errors.push('Server is required');
    if (!config.username) errors.push('Username is required');
    if (!config.authRef) errors.push('Auth reference is required');
    if (config.port < 1 || config.port > 65535) errors.push('Invalid port');
    return { valid: errors.length === 0, errors };
  }

  buildTunnelConfig(config: RecipeConfig): TunnelConfig {
    return {
      type: 'socks5',
      localPort: 1081,
      remoteHost: config.server,
      remotePort: config.port,
      username: config.username,
      keepaliveInterval: config.keepaliveInterval ?? 25,
    };
  }
}

recipeRegistry.register(new HomeServerRecipe());