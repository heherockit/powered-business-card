import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Header } from '../Header';
import { AppThemeProvider } from '../../../styles/GlobalStyles';

describe('Header', () => {
  it('renders brand name and logo', () => {
    render(
      <AppThemeProvider>
        <Header />
      </AppThemeProvider>
    );

    expect(screen.getByText('Cardify')).toBeInTheDocument();
    expect(screen.getByAltText('Cardify logo')).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    render(
      <AppThemeProvider>
        <Header />
      </AppThemeProvider>
    );

    const nav = screen.getByRole('navigation', { name: /main/i });
    const home = within(nav).getByRole('link', { name: /home|nav\.home/i });
    const templates = within(nav).getByRole('link', { name: /templates|nav\.templates/i });
    const docs = within(nav).getByRole('link', { name: /docs|nav\.docs/i });

    expect(home).toHaveAttribute('href', '/');
    expect(templates).toHaveAttribute('href', '/templates');
    expect(docs).toHaveAttribute('href', '/docs');
  });
});
