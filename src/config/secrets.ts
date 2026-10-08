import * as SecureStore from 'expo-secure-store';

const SERVICE = 'com.musty.tunnelguard';

export async function setSecret(account: string, secret: string): Promise<void> {
  await SecureStore.setItemAsync(`${SERVICE}:${account}`, secret);
}

export async function getSecret(account: string): Promise<string | null> {
  return SecureStore.getItemAsync(`${SERVICE}:${account}`);
}

export async function deleteSecret(account: string): Promise<void> {
  await SecureStore.deleteItemAsync(`${SERVICE}:${account}`);
}

export async function setKeyPair(profileId: string, privateKey: string, passphrase?: string): Promise<void> {
  await setSecret(`profile:${profileId}:key`, privateKey);
  if (passphrase) {
    await setSecret(`profile:${profileId}:passphrase`, passphrase);
  }
}

export async function getKeyPair(profileId: string): Promise<{ privateKey: string | null; passphrase: string | null }> {
  const [privateKey, passphrase] = await Promise.all([
    getSecret(`profile:${profileId}:key`),
    getSecret(`profile:${profileId}:passphrase`),
  ]);
  return { privateKey, passphrase };
}

export async function setPassword(profileId: string, password: string): Promise<void> {
  await setSecret(`profile:${profileId}:password`, password);
}

export async function getPassword(profileId: string): Promise<string | null> {
  return getSecret(`profile:${profileId}:password`);
}

export async function deleteProfileSecrets(profileId: string): Promise<void> {
  await Promise.all([
    deleteSecret(`profile:${profileId}:key`),
    deleteSecret(`profile:${profileId}:passphrase`),
    deleteSecret(`profile:${profileId}:password`),
  ]);
}