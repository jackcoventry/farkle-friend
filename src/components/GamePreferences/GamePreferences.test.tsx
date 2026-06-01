import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { GamePreferences } from './GamePreferences';

describe('GamePreferences', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'en';
    delete document.documentElement.dataset.motion;
    delete document.documentElement.dataset.theme;
  });

  it('opens and closes the preferences modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GamePreferences className="custom-trigger-class" />);

    const openButton = screen.getByRole('button', { name: 'Preferences' });
    expect(openButton).toHaveClass('custom-trigger-class');

    await user.click(openButton);
    const dialog = screen.getByRole('dialog', { name: 'Game preferences' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close preferences' }));
    expect(screen.queryByRole('dialog', { name: 'Game preferences' })).toBeNull();
  });

  it('updates language, sound, animation, and theme preferences', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GamePreferences />);

    await user.click(screen.getByRole('button', { name: 'Preferences' }));

    const spanish = screen.getByLabelText('Español', { selector: '#preferenceLocale_es' });
    await user.click(spanish);
    expect(spanish).toBeChecked();
    expect(document.documentElement).toHaveAttribute('lang', 'es');
    expect(screen.getByRole('dialog', { name: 'Preferencias del juego' })).toBeInTheDocument();

    const soundOn = screen.getByLabelText('Activado', { selector: '#preferenceSound_on' });
    const soundOff = screen.getByLabelText('Desactivado', { selector: '#preferenceSound_off' });
    expect(soundOff).toBeChecked();
    await user.click(soundOn);
    expect(soundOn).toBeChecked();
    await user.click(soundOff);
    expect(soundOff).toBeChecked();

    const motionOff = screen.getByLabelText('Desactivado', { selector: '#preferenceMotion_off' });
    const motionOn = screen.getByLabelText('Activado', { selector: '#preferenceMotion_on' });
    await user.click(motionOff);
    expect(motionOff).toBeChecked();
    expect(document.documentElement.dataset.motion).toBe('off');
    await user.click(motionOn);
    expect(motionOn).toBeChecked();
    expect(document.documentElement.dataset.motion).toBe('on');

    const lightTheme = screen.getByLabelText('Claro', { selector: '#preferenceTheme_light' });
    await user.click(lightTheme);
    expect(lightTheme).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('light');

    const darkTheme = screen.getByLabelText('Oscuro', { selector: '#preferenceTheme_dark' });
    await user.click(darkTheme);
    expect(darkTheme).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
