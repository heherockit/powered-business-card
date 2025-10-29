import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Prompt } from '../Prompt';
import { AppThemeProvider } from '../../../styles/GlobalStyles';

vi.mock('../../../services/cardService', () => {
  return {
    generateCard: vi.fn(async () => ({
      card: {
        title: 'Jane Doe',
        subtitle: 'Designer',
        fields: [{ label: 'Phone', value: '123-456' }],
        notes: 'N/A',
      },
      templates: [{ id: 't1', name: 'Minimalist' }],
    })),
  };
});

const { generateCard } = await import('../../../services/cardService');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Prompt', () => {
  it('updates preview when typing', async () => {
    const user = userEvent.setup();
    render(
      <AppThemeProvider>
        <Prompt />
      </AppThemeProvider>
    );

    const descInput = screen.getByLabelText('Description');
    await user.clear(descInput);
    await user.type(descInput, 'Hello neon world');

    expect(descInput).toHaveValue('Hello neon world');
  });

  it('triggers generate via Enter key', async () => {
    const user = userEvent.setup();
    render(
      <AppThemeProvider>
        <Prompt />
      </AppThemeProvider>
    );

    const descInput = screen.getByLabelText('Description');
    await user.clear(descInput);
    await user.type(descInput, 'Hello{enter}');

    expect(generateCard).toHaveBeenCalledTimes(1);
    expect(generateCard).toHaveBeenCalledWith('Hello');
    // Result component appears
    expect(await screen.findByTestId('temporary-generating-result')).toBeInTheDocument();
  });

  it('triggers generate via button click', async () => {
    const user = userEvent.setup();
    render(
      <AppThemeProvider>
        <Prompt />
      </AppThemeProvider>
    );

    const descInput = screen.getByLabelText('Description');
    await user.clear(descInput);
    await user.type(descInput, 'World');

    const genBtn = screen.getByRole('button', { name: /generate/i });
    await user.click(genBtn);

    expect(generateCard).toHaveBeenCalledTimes(1);
    expect(generateCard).toHaveBeenCalledWith('World');
    expect(await screen.findByText(/Jane Doe/)).toBeInTheDocument();
  });

  it('shows error when API fails', async () => {
    const user = userEvent.setup();
    vi.mocked(generateCard).mockRejectedValueOnce(new Error('Network error'));

    render(
      <AppThemeProvider>
        <Prompt />
      </AppThemeProvider>
    );

    const descInput = screen.getByLabelText('Description');
    await user.clear(descInput);
    await user.type(descInput, 'Oops');
    const genBtn = screen.getByRole('button', { name: /generate/i });
    await user.click(genBtn);

    expect(generateCard).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('alert')).toHaveTextContent('Network error');
  });

  it('renders results with fields and templates', async () => {
    const user = userEvent.setup();
    render(
      <AppThemeProvider>
        <Prompt />
      </AppThemeProvider>
    );

    const descInput = screen.getByLabelText('Description');
    await user.clear(descInput);
    await user.type(descInput, 'Info');
    const genBtn = screen.getByRole('button', { name: /generate/i });
    await user.click(genBtn);

    expect(await screen.findByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Designer/)).toBeInTheDocument();
    expect(screen.getByText(/Phone/)).toBeInTheDocument();
    expect(screen.getByText(/123-456/)).toBeInTheDocument();
    expect(screen.getByText(/Suggested templates/i)).toBeInTheDocument();
    expect(screen.getByText(/Minimalist/)).toBeInTheDocument();
  });

  it('has responsive container classes for mobile', async () => {
    render(
      <AppThemeProvider>
        <Prompt />
      </AppThemeProvider>
    );
    const ta = screen.getByLabelText('Description');
    const section = ta.closest('section');
    expect(section).not.toBeNull();
    expect(section?.className).toMatch(/w-full/);
    expect(section?.className).toMatch(/sm:w-11\/12/);
    expect(section?.className).toMatch(/md:w-2\/3/);
  });
});
