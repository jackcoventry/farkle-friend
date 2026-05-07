import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useI18n } from './I18nProvider';

describe('useI18n', () => {
  it('returns English fallback messages outside the app provider', () => {
    const { result } = renderHook(() => useI18n());

    expect(result.current.locale).toBe('en');
    expect(result.current.t('scoreGenerator.addDie', { value: 5 })).toBe('Add die showing 5');
  });
});
