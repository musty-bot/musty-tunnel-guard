import { AuthMethod, AuthConfig, AuthCredentials } from '@engine/contracts/AuthMethod';
import { authMethodRegistry } from '@engine/auth/registry';
import * as SecureStore from 'expo-secure-store';

const SERVICE = 'com.musty.tunnelguard';

export class PasswordAuth extends AuthMethod {
  readonly id = 'password';
  readonly name = 'Password';
  readonly description = 'Authenticate using password stored in secure enclave';

  async resolve(config: AuthConfig): Promise<AuthCredentials> {
    if (!config.passwordRef) throw new Error('Password reference required');
    const password = await SecureStore.getItemAsync(`${SERVICE}:${config.passwordRef}`);
    if (!password) throw new Error('Password not found in secure storage');
    return {
      username: config.username,
      password,
    };
  }
}

authMethodRegistry.register(new PasswordAuth());