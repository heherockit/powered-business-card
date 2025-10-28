import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.scss'
import './styles/components.scss'
import './i18n'
import { AppRoutes } from './routes/AppRoutes'
import { AppThemeProvider, GlobalStyles } from './styles/GlobalStyles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <GlobalStyles />
      <AppRoutes />
    </AppThemeProvider>
  </StrictMode>,
)
