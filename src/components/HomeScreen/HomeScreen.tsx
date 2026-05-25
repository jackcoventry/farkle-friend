'use client';

import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import DiceIcon from '@/components/DiceIcon/DiceIcon';
import './HomeScreen.css';

export function HomeScreen() {
  const { t } = useI18n();
  const title = 'FARKLE!'.split('');

  return (
    <div className="splash-screen bg-surface flex h-dvh items-center justify-center">
      <div className="splash-screen__content | gap-md flex flex-col items-center">
        <div className="home-screen__dice | p-xl mb-md bg-surface border-border rotate-12 rounded-full border-4">
          <DiceIcon count={6} />
        </div>
        <h1 className="font-mega text-text">
          {title.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="animate-bounce-in opacity-0"
              style={{
                animationDelay: `${index * 0.05 + 0.5}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <div className="home-screen__actions | gap-md px-lg flex w-full flex-col sm:px-0">
          <Link href="/game">
            <Button
              as="inline"
              size="large"
            >
              {t('actions.start')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
