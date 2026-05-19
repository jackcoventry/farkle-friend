import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDiceKeyboardShortcuts } from './useDiceKeyboardShortcuts';

function renderShortcuts(overrides: Partial<Parameters<typeof useDiceKeyboardShortcuts>[0]> = {}) {
  const handlers = {
    onBank: vi.fn(),
    onFinish: vi.fn(),
    onRoll: vi.fn(),
    onToggleDie: vi.fn(),
  };

  renderHook(() =>
    useDiceKeyboardShortcuts({
      canBank: true,
      canFinish: true,
      canRoll: true,
      currentRollLength: 6,
      ...handlers,
      ...overrides,
    })
  );

  return handlers;
}

describe('useDiceKeyboardShortcuts', () => {
  it('runs active dice shortcuts', () => {
    const handlers = renderShortcuts();

    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(handlers.onToggleDie).toHaveBeenCalledWith(0);
    expect(handlers.onRoll).toHaveBeenCalledTimes(1);
    expect(handlers.onBank).toHaveBeenCalledTimes(1);
    expect(handlers.onFinish).toHaveBeenCalledTimes(1);
  });

  it('does not run shortcuts when disabled', () => {
    const handlers = renderShortcuts({ enabled: false });

    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));

    expect(handlers.onRoll).not.toHaveBeenCalled();
  });

  it('ignores prevented, modified, form, and modal events', () => {
    const handlers = renderShortcuts();

    const preventedEvent = new KeyboardEvent('keydown', { cancelable: true, key: 'r' });
    preventedEvent.preventDefault();
    globalThis.dispatchEvent(preventedEvent);
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', shiftKey: true }));

    const input = document.createElement('input');
    document.body.append(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'r' }));

    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    document.body.append(dialog);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'r' }));

    expect(handlers.onRoll).not.toHaveBeenCalled();

    input.remove();
    dialog.remove();
  });
});
