export const futuristicTheme = {
  colors: {
    // Primary brand colors
    primary: '#00F5FF',        // Cyan - main accent
    primaryDark: '#00B8D4',    // Darker cyan
    primaryGlow: '#00FFFF',    // Bright cyan for glow
    
    // Secondary accents
    secondary: '#FF00FF',      // Magenta
    secondaryGlow: '#FF00FF',  // Magenta glow
    accent: '#FFFF00',         // Yellow
    
    // Status colors (futuristic)
    secure: '#00FF88',         // Neon green
    warning: '#FFAA00',        // Neon orange
    leaking: '#FF3366',        // Neon red
    disconnected: '#666699',   // Muted purple
    
    // Backgrounds
    bgDeep: '#050510',         // Near black with blue tint
    bgDark: '#0A0A1A',         // Dark navy
    bgCard: '#0F0F23',         // Card background
    bgElevated: '#15152E',     // Elevated surfaces
    
    // Text
    textPrimary: '#FFFFFF',    // Pure white
    textSecondary: '#A0A0CC',  // Muted cyan
    textMuted: '#606080',      // Dim
    textOnAccent: '#000000',   // Black on bright colors
    
    // Borders & lines
    border: '#00F5FF33',       // Cyan 20%
    borderBright: '#00F5FF',   // Full cyan
    grid: '#00F5FF11',         // Grid lines 7%
    
    // Glow effects
    glowCyan: '#00FFFF',
    glowMagenta: '#FF00FF',
    glowGreen: '#00FF88',
  },
  
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  
  borderRadius: {
    sm: 4, md: 8, lg: 16, xl: 24, full: 999,
  },
  
  // Futuristic specific
  glow: {
    sm: '0 0 8px',
    md: '0 0 16px',
    lg: '0 0 32px',
    xl: '0 0 64px',
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 600,
    ambient: 4000,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
    mono: 'monospace',
  },
} as const;

export type FuturisticTheme = typeof futuristicTheme;