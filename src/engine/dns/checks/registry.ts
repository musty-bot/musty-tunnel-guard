import { LeakCheck } from '@engine/contracts/LeakCheck';

class LeakCheckRegistry {
  private checks = new Map<string, LeakCheck>();

  register(check: LeakCheck): void {
    if (this.checks.has(check.id)) {
      throw new Error(`LeakCheck with id ${check.id} already registered`);
    }
    this.checks.set(check.id, check);
  }

  get(id: string): LeakCheck | undefined {
    return this.checks.get(id);
  }

  getAll(): LeakCheck[] {
    return Array.from(this.checks.values());
  }

  getByIds(ids: string[]): LeakCheck[] {
    return ids.map(id => this.checks.get(id)).filter((c): c is LeakCheck => c !== undefined);
  }
}

export const leakCheckRegistry = new LeakCheckRegistry();