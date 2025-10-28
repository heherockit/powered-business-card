import type { AppTheme } from '../constants/theme';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
