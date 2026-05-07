import type { useI18n } from './I18nProvider';
import { isMessageKey } from './messages';

type Translate = ReturnType<typeof useI18n>['t'];

export function translateValidationMessage(t: Translate, message?: string) {
  if (!message) return '';
  return isMessageKey(message) ? t(message) : message;
}
