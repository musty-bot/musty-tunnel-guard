import { useEffect, useState } from 'react';
import { useEngine } from './useEngine';
import { configStore, networkStore, profileStore } from '@config/store';
import * as Network from 'expo-network';

export function useMonitor() {
  const { tunnel, health, connect, disconnect } = useEngine();
  const [currentSsid, setCurrentSsid] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let interval: ReturnType<typeof setInterval>;

    const checkNetwork = async () => {
      try {
        const networkInfo = await Network.getNetworkStateAsync();
        // expo-network may not expose SSID directly, use type assertion
        const ssid = (networkInfo as any).ssid || (networkInfo as any).wifi?.ssid || 'unknown';
        
        if (mounted && ssid !== currentSsid) {
          setCurrentSsid(ssid);
          await handleNetworkChange(ssid);
        }
      } catch (err) {
        console.warn('Network check failed:', err);
      }
    };

    const handleNetworkChange = async (ssid: string) => {
      const config = await configStore.get();
      if (!config.autoReconnect) return;

      const rules = await networkStore.getAll();
      const rule = rules.find((r: any) => r.ssid === ssid || r.ssid === '*');
      
      if (!rule || rule.action === 'none') {
        if (tunnel) await disconnect();
        return;
      }

      if (rule.action === 'auto' && rule.profileId) {
        const profile = await profileStore.get(rule.profileId);
        if (profile && (!tunnel || health.status === 'disconnected')) {
          await connect(profile.id);
        }
      } else if (rule.action === 'prompt') {
        // UI will handle prompt
      }
    };

    checkNetwork();
    interval = setInterval(checkNetwork, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [tunnel, health.status, connect, disconnect, currentSsid]);

  return { currentSsid };
}