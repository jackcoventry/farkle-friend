'use client';

'use client';

import { useI18n } from '@/i18n/I18nProvider';
import Button from '@/components/Button/Button';
import './ErrorScreen.css';

type ErrorScreenProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function ErrorScreen({ error, reset }: Readonly<ErrorScreenProps>) {
  const { t } = useI18n();

  return (
    <main className="p-xl bg-surface flex min-h-dvh items-center justify-center">
      <section className="error-screen__panel | gap-md p-xl bg-surface-raised text-text flex flex-col rounded-lg shadow-lg">
        <h1 className="font-heading">{t('error.title')}</h1>
        <p>{t('error.description')}</p>
        {error.digest ? (
          <p className="text-text-muted text-sm">
            {t('error.reference', { digest: error.digest })}
          </p>
        ) : null}
        <Button
          onClick={reset}
          className="justify-center"
        >
          {t('error.tryAgain')}
        </Button>
      </section>
    </main>
  );
}
