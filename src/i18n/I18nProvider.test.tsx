import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useI18n } from './I18nProvider';
import { locales } from './locales';
import { getMessagePlaceholders, messages } from './messages';

describe('useI18n', () => {
  it('keeps locale message keys in sync', () => {
    const referenceKeys = Object.keys(messages.en).sort();

    for (const locale of locales) {
      expect(Object.keys(messages[locale]).sort()).toEqual(referenceKeys);
    }
  });

  it('keeps locale message placeholders in sync', () => {
    const referenceMessages = messages.en;

    for (const locale of locales) {
      for (const key of Object.keys(referenceMessages)) {
        const messageKey = key as keyof typeof referenceMessages;

        expect(getMessagePlaceholders(messages[locale][messageKey])).toEqual(
          getMessagePlaceholders(referenceMessages[messageKey])
        );
      }
    }
  });

  it('returns English fallback messages outside the app provider', () => {
    const { result } = renderHook(() => useI18n());

    expect(result.current.locale).toBe('en');
    expect(result.current.t('scoreGenerator.addDie', { value: 5 })).toBe('Add die showing 5');
  });
});
