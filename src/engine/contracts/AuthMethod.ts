export interface AuthCredentials {
  username: string;
  privateKey?: string;
  passphrase?: string;
  password?: string;
  agentSocket?: string;
}

export interface AuthConfig {
  type: 'key' | 'password' | 'agent';
  username: string;
  keyRef?: string;
  passwordRef?: string;
}

export abstract class AuthMethod {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;

  abstract resolve(config: AuthConfig): Promise<AuthCredentials>;
}