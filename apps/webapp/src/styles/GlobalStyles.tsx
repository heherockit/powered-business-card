import { Global, css, ThemeProvider } from '@emotion/react';
import { theme } from '../constants/theme';
import type { AppTheme } from '../constants/theme';

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        html,
        body,
        #root {
          height: 100%;
        }
        body {
          margin: 0;
          font-family: ${theme.typography.fontFamily};
          line-height: ${theme.typography.lineHeight};
          color: ${theme.colors.textPrimary};
          background-color: ${theme.colors.background};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        img {
          display: block;
          max-width: 100%;
        }
        button {
          font-family: inherit;
        }
      `}
    />
  );
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme as AppTheme}>{children}</ThemeProvider>;
}
