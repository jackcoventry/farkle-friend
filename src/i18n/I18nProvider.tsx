'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useGame } from '@/domain/game/GameProvider';
import { type Locale, defaultLocale } from './locales';
import { MessageKey, MessageValues, messages } from './messages';

type I18nContextValue = {
  locale: Locale;
  t: (key: MessageKey, values?: MessageValues) => string;
};

const fallbackContext: I18nContextValue = {
  locale: defaultLocale,
  t: (key, values) => formatMessage(messages[defaultLocale][key] ?? key, values),
};

const I18nContext = createContext<I18nContextValue>(fallbackContext);

function formatMessage(message: string, values?: MessageValues) {
  if (!values) return message;

  return message.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value == null ? match : String(value);
  });
}

export function I18nProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { state } = useGame();
  const locale = state.preferences.locale ?? defaultLocale;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key, values) =>
        formatMessage(messages[locale][key] ?? messages[defaultLocale][key] ?? key, values),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
