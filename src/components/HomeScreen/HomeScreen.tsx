'use client';

import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import Button from '@/components/Button/Button';
import DiceIcon from '@/components/DiceIcon/DiceIcon';
import './HomeScreen.css';

export function HomeScreen() {
  const { t } = useI18n();
  const { isAtLeast } = useBreakpoint();
  const buttonSize = isAtLeast('lg') ? 'large' : 'default';

  return (
    <main className="splash-screen | bg-surface relative min-h-dvh overflow-auto">
      <div className="splash-screen__content | gap-xl relative mx-auto grid min-h-dvh w-full items-center px-6 py-7">
        <section className="home-screen__hero | gap-xl grid items-center">
          <div className="home-screen__intro | gap-md flex flex-col">
            <div className="home-screen__kicker | text-accent inline-flex items-center rounded-full px-4 py-2">
              {t('home.kicker')}
            </div>
            <div className="home-screen__title-group">
              <h1 className="home-screen__title | font-mega text-text">Farkle Friend!</h1>
              <p className="home-screen__intro | font-body text-text-muted">{t('home.intro')}</p>
            </div>
            <div className="home-screen__actions | gap-md flex flex-col sm:flex-row">
              <Link href="/game">
                <Button
                  as="inline"
                  size={buttonSize || 'large'}
                  variant="secondary"
                >
                  {t('actions.start')}
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="home-screen__preview | relative grid gap-4 justify-self-center overflow-hidden rounded-4xl border border-transparent p-3 md:gap-5 md:p-5"
            aria-hidden="true"
          >
            <div className="home-screen__preview-topline | text-text-muted font-button-1 relative flex items-center justify-between">
              <span>{t('home.previewTurn')}</span>
              <span className="text-accent">{t('turn.pts', { score: 450 })}</span>
            </div>
            <div className="home-screen__dice-cloud | relative flex flex-wrap items-center justify-center gap-3">
              {[1, 5, 3, 6, 1, 4].map((count, index) => (
                <div
                  className="home-screen__preview-die | bg-surface border-glass-border rounded-3xl border p-2 md:p-3"
                  key={`${count}-${index}`}
                >
                  <DiceIcon count={count as 1 | 2 | 3 | 4 | 5 | 6} />
                </div>
              ))}
            </div>
            <div className="home-screen__score-preview | border-glass-border relative flex items-stretch justify-between gap-4 rounded-3xl border p-3 md:items-center md:p-4">
              <div className="grid gap-1">
                <span className="text-text-muted">{t('home.previewLeader')}</span>
                <strong className="text-text font-button-1">Ada</strong>
              </div>
              <div className="grid gap-1">
                <span className="text-text-muted">{t('status.currentTotal')}</span>
                <strong className="text-text font-button-1">3,250</strong>
              </div>
            </div>
          </div>
        </section>

        <div className="home-screen__features | gap-sm grid">
          <div className="home-screen__feature | border-glass-border rounded-2xl border p-4">
            <span className="text-text">{t('home.featureSetupTitle')}</span>
            <p className="text-text-muted">{t('home.featureSetupText')}</p>
          </div>
          <div className="home-screen__feature | border-glass-border rounded-2xl border p-4">
            <span className="text-text">{t('home.featureModesTitle')}</span>
            <p className="text-text-muted">{t('home.featureModesText')}</p>
          </div>
          <div className="home-screen__feature | border-glass-border rounded-2xl border p-4">
            <span className="text-text">{t('home.featureScoringTitle')}</span>
            <p className="text-text-muted">{t('home.featureScoringText')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
