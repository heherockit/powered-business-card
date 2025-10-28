import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Prompt } from '../Prompt';
import { AppThemeProvider } from '../../../styles/GlobalStyles';

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
});
