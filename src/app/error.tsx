'use client';

import { ErrorScreen } from '@/components/ErrorScreen/ErrorScreen';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorPageProps>) {
  return (
    <ErrorScreen
      error={error}
      reset={reset}
    />
  );
}
