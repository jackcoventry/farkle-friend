'use client';

import Button from '@/components/Button/Button';
import './ErrorScreen.css';

type ErrorScreenProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function ErrorScreen({ error, reset }: Readonly<ErrorScreenProps>) {
  return (
    <main className="p-xl bg-surface flex min-h-dvh items-center justify-center">
      <section className="error-screen__panel | gap-md p-xl bg-surface-raised text-text flex flex-col rounded-lg shadow-lg">
        <h1 className="font-heading">Something went wrong</h1>
        <p>The game hit an unexpected error. Try again to return to the current screen.</p>
        {error.digest ? (
          <p className="text-text-muted text-sm">Error reference: {error.digest}</p>
        ) : null}
        <Button
          onClick={reset}
          className="justify-center"
        >
          Try again
        </Button>
      </section>
    </main>
  );
}
