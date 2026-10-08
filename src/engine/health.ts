import { LeakCheckResult } from '@engine/contracts/LeakCheck';

export type HealthStatus = 'secure' | 'warning' | 'leaking' | 'disconnected';

export interface HealthScore {
  score: number;
  status: HealthStatus;
  checks: { id: string; passed: boolean }[];
}

export function calculateHealth(
  connected: boolean,
  results: LeakCheckResult[]
): HealthScore {
  if (!connected) {
    return { score: 0, status: 'disconnected', checks: [] };
  }

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  if (total === 0) {
    return { score: 60, status: 'warning', checks: [] };
  }

  const ratio = passed / total;
  let score: number;
  let status: HealthStatus;

  if (ratio === 1) {
    score = 100;
    status = 'secure';
  } else if (ratio >= 0.5) {
    score = 60;
    status = 'warning';
  } else {
    score = 20;
    status = 'leaking';
  }

  return {
    score,
    status,
    checks: results.map(r => ({ id: r.details, passed: r.passed })),
  };
}

export function getStatusColor(status: HealthStatus): string {
  switch (status) {
    case 'secure': return '#10B981';
    case 'warning': return '#F59E0B';
    case 'leaking': return '#EF4444';
    case 'disconnected': return '#6B7280';
  }
}