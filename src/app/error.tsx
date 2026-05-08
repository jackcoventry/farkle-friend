'use client';

import Button from '@/components/Button/Button';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorPageProps>) {
  return (
    <main className="p-xl bg-surface flex min-h-dvh items-center justify-center">
      <section className="gap-md p-xl flex max-w-[520px] flex-col rounded-lg bg-white text-center shadow-lg">
        <h1 className="font-heading">Something went wrong</h1>
        <p>The game hit an unexpected error. Try again to return to the current screen.</p>
        {error.digest ? (
          <p className="text-sm text-gray-700">Error reference: {error.digest}</p>
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
