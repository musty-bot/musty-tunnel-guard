# Tunnel Guard — Powered by Musty Corporations

**Musty Engine v1** — Secure tunnels you can prove.

A privacy-first mobile app that creates SSH tunnels and verifies they aren't leaking DNS, IP, or WebRTC data.

## Features

- **Guided SSH Tunnel Manager** — No command line required. Pick a recipe, enter server details, connect.
- **Leak Verification** — Built-in DNS, IP, and WebRTC leak tests that run *through* the tunnel.
- **Health Score** — 100 (secure), 60 (warning), 20 (leaking), 0 (disconnected).
- **Polymorphic Architecture** — Add recipes, leak checks, DNS providers, or auth methods by dropping a file.
- **Zero Telemetry** — Everything runs locally. No accounts. No servers.

## Recipes (v1)

| Recipe | Use Case |
|--------|----------|
| Safe Public WiFi | Encrypt all traffic on public networks via SOCKS5 proxy |
| Remote Database | Secure tunnel to PostgreSQL/MySQL/Redis |
| Home Server | Access your home server from anywhere |

## Leak Checks

| Check | Purpose |
|-------|---------|
| DNS Leak | Verifies DNS queries route through tunnel |
| IP Leak | Verifies public IP is hidden behind tunnel |
| WebRTC Leak | Checks for WebRTC IP exposure |

## DNS Providers

- Cloudflare (1.1.1.1) — DoH/DoT
- Quad9 (9.9.9.9) — DoH/DoT with threat blocking
- NextDNS — Customizable with config ID

## Auth Methods

- SSH Key (stored in Secure Enclave/Keystore)
- Password (stored in Secure Enclave/Keystore)

## Architecture

```
src/
├── engine/              # Musty Engine (single entry: musty.ts)
│   ├── contracts/       # Recipe, LeakCheck, DnsProvider, AuthMethod
│   ├── recipes/         # SafePublicWifi, RemoteDatabase, HomeServer
│   ├── dns/
│   │   ├── checks/      # DnsLeak, IpLeak, WebRtcLeak
│   │   └── providers/   # Cloudflare, Quad9, NextDns
│   ├── auth/            # KeyAuth, PasswordAuth
│   ├── ssh/             # SOCKS5 tunnel + auto-reconnect
│   └── health.ts        # Score calculation
├── ui/                  # React Native UI
│   ├── views/           # Splash, Dashboard, Recipes, LeakTest, Settings, About
│   ├── components/      # HealthScore, StatusBadge, ProfileCard, LeakResult, MustyFooter
│   └── hooks/           # useEngine, useMonitor
└── config/              # Schema, store, secrets, defaults
```

**The One Rule:** UI only calls `engine/musty.ts`. Nothing else.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on device/simulator
npx expo start --android
npx expo start --ios
```

## Configuration

Stored in AsyncStorage (no files on mobile):
- `config.json` — theme, monitor interval, auto-reconnect, kill-switch, default DNS
- `profiles.json` — saved tunnels (keychain references only)
- `networks.json` — per-SSID rules
- `history.jsonl` — append-only event log

Secrets stored in OS keychain via `expo-secure-store`:
- Service: `com.musty.tunnelguard`
- Keys: `profile:<id>:key`, `profile:<id>:passphrase`, `profile:<id>:password`

## Branding

- **Product:** Tunnel Guard
- **Engine:** Musty Engine (v1)
- **Corporation:** Musty Corporations
- **App ID:** com.musty.tunnelguard
- **Tagline:** "Secure tunnels you can prove."

## License

MIT — Powered by Musty Corporations.