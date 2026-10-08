import { AuthMethod } from '@engine/contracts/AuthMethod';

class AuthMethodRegistry {
  private methods = new Map<string, AuthMethod>();

  register(method: AuthMethod): void {
    if (this.methods.has(method.id)) {
      throw new Error(`AuthMethod with id ${method.id} already registered`);
    }
    this.methods.set(method.id, method);
  }

  get(id: string): AuthMethod | undefined {
    return this.methods.get(id);
  }

  getAll(): AuthMethod[] {
    return Array.from(this.methods.values());
  }
}

export const authMethodRegistry = new AuthMethodRegistry();