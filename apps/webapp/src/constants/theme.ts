export const palette = {
  // Light theme base
  bg: '#ffffff',
  surface: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#64748b',

  // Accents
  accent: '#2563eb',
  accentAlt: '#0ea5e9',
  success: '#16a34a',
  highlight: '#f59e0b',
};

export const theme = {
  colors: {
    background: palette.bg,
    surface: palette.surface,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    accent: palette.accent,
    accentAlt: palette.accentAlt,
    success: palette.success,
    highlight: palette.highlight,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadows: {
    neon: '0 1px 2px rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: `ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
    lineHeight: 1.6,
  },
};

export type AppTheme = typeof theme;