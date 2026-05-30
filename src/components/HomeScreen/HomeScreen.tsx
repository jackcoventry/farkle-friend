'use client';

import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { DiceIcon } from '@/components/DiceIcon/DiceIcon';
import './HomeScreen.css';

export function HomeScreen() {
  const { t } = useI18n();

  return (
    <main className="splash-screen | bg-surface relative min-h-dvh overflow-auto">
      <div className="splash-screen__content | gap-xl px-md py-xl lg:px-lg relative mx-auto grid min-h-dvh w-full items-center">
        <section className="home-screen__hero | gap-xl grid items-center">
          <div className="home-screen__intro | gap-md flex flex-col">
            <div className="home-screen__kicker | text-accent inline-flex items-center rounded-full px-4 py-2">
              {t('home.kicker')}
            </div>
            <div className="home-screen__title-group | gap-md flex flex-col">
              <h1 className="home-screen__title | font-mega text-text">Farkle Friend!</h1>
              <p className="home-screen__intro | font-body text-text-muted">{t('home.intro')}</p>
            </div>
            <div className="home-screen__actions | gap-md flex flex-col">
              <Link href="/game">
                <Button
                  as="inline"
                  variant="primary"
                >
                  {t('actions.start')}
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="home-screen__preview | gap-md p-lg relative grid w-full justify-self-center overflow-hidden rounded-4xl border border-transparent"
            aria-hidden="true"
          >
            <div className="home-screen__preview-topline | text-text-muted font-button-1 relative flex items-center justify-between">
              <span>{t('home.previewTurn')}</span>
              <span className="text-accent">{t('turn.pts', { score: 450 })}</span>
            </div>
            <div className="home-screen__dice-cloud | gap-md relative flex flex-wrap items-center justify-center">
              {[1, 5, 3, 6, 1, 4].map((count, index) => (
                <div
                  className="home-screen__preview-die | bg-surface border-glass-border p-md rounded-3xl border"
                  key={`${count}-${index}`}
                >
                  <DiceIcon count={count as 1 | 2 | 3 | 4 | 5 | 6} />
                </div>
              ))}
            </div>
            <div className="home-screen__score-preview | border-glass-border p-md gap-lg relative flex items-stretch justify-between rounded-3xl border md:items-center">
              <div className="gap-xs grid">
                <span className="text-text-muted">{t('home.previewLeader')}</span>
                <strong className="text-text font-button-1">Ada</strong>
              </div>
              <div className="gap-xs grid">
                <span className="text-text-muted">{t('status.currentTotal')}</span>
                <strong className="text-text font-button-1">3,250</strong>
              </div>
            </div>
          </div>
        </section>

        <div className="home-screen__features | gap-sm grid">
          <div className="home-screen__feature | border-glass-border p-lg rounded-2xl border">
            <span className="text-text">{t('home.featureSetupTitle')}</span>
            <p className="home-screen__feature-text | text-text-muted">
              {t('home.featureSetupText')}
            </p>
          </div>
          <div className="home-screen__feature | border-glass-border p-lg rounded-2xl border">
            <span className="text-text">{t('home.featureModesTitle')}</span>
            <p className="home-screen__feature-text | text-text-muted">
              {t('home.featureModesText')}
            </p>
          </div>
          <div className="home-screen__feature | border-glass-border p-lg rounded-2xl border">
            <span className="text-text">{t('home.featureScoringTitle')}</span>
            <p className="home-screen__feature-text | text-text-muted">
              {t('home.featureScoringText')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
