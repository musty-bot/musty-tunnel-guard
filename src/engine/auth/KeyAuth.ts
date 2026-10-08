import { AuthMethod, AuthConfig, AuthCredentials } from '@engine/contracts/AuthMethod';
import { authMethodRegistry } from '@engine/auth/registry';
import * as SecureStore from 'expo-secure-store';

const SERVICE = 'com.musty.tunnelguard';

export class KeyAuth extends AuthMethod {
  readonly id = 'key';
  readonly name = 'SSH Key';
  readonly description = 'Authenticate using SSH private key stored in secure enclave';

  async resolve(config: AuthConfig): Promise<AuthCredentials> {
    if (!config.keyRef) throw new Error('Key reference required');
    const privateKey = await SecureStore.getItemAsync(`${SERVICE}:${config.keyRef}`);
    if (!privateKey) throw new Error('Private key not found in secure storage');
    const passphrase = config.passwordRef 
      ? await SecureStore.getItemAsync(`${SERVICE}:${config.passwordRef}`)
      : undefined;
    return {
      username: config.username,
      privateKey,
      passphrase: passphrase ?? undefined,
    };
  }
}

authMethodRegistry.register(new KeyAuth());