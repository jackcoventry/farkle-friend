'use client';

import { useState } from 'react';
import { useGame } from '@/domain/game/GameProvider';
import type { ThemePreference } from '@/domain/game/gameTypes';
import { useI18n } from '@/i18n/I18nProvider';
import { localeLabels, locales, type Locale } from '@/i18n/locales';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Pill from '@/components/Pill/Pill';

type GamePreferencesProps = {
  className?: string;
};

export function GamePreferences({ className }: Readonly<GamePreferencesProps>) {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const updatePreferences = (settings: {
    locale?: Locale;
    motionEnabled?: boolean;
    tableFeedback?: boolean;
    theme?: ThemePreference;
  }) => {
    dispatch({
      type: 'UPDATE_PREFERENCES',
      preferences: {
        locale: settings.locale ?? state.preferences.locale,
        motionEnabled: settings.motionEnabled ?? state.preferences.motionEnabled,
        tableFeedback: settings.tableFeedback ?? state.preferences.tableFeedback,
        theme: settings.theme ?? state.preferences.theme,
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        size="small"
        variant="primary"
        onClick={() => setIsOpen(true)}
        icon="three-dots-vertical"
        iconOnly
        ariaLabel={t('preferences.open')}
        className={className}
      >
        {t('preferences.open')}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel={t('preferences.title')}
      >
        <Modal.Body className="modal-panel modal-panel--narrow">
          <div className="modal-panel__header">
            <Modal.CloseButton ariaLabel={t('preferences.close')} />
          </div>
          <div className="modal-panel__content">
            <div className="grid gap-4">
              <h2 className="font-heading text-center">{t('preferences.title')}</h2>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">{t('preferences.language')}</legend>
                <div className="flex flex-wrap gap-3">
                  {locales.map((option) => (
                    <Pill key={option}>
                      <Pill.Control>
                        <input
                          type="radio"
                          checked={state.preferences.locale === option}
                          onChange={() => updatePreferences({ locale: option })}
                          name="preferenceLocale"
                          id={`preferenceLocale_${option}`}
                        />
                      </Pill.Control>
                      <Pill.Label htmlFor={`preferenceLocale_${option}`}>
                        {localeLabels[option]}
                      </Pill.Label>
                    </Pill>
                  ))}
                </div>
              </fieldset>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">{t('preferences.sound')}</legend>
                <div className="flex flex-wrap gap-3">
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={state.preferences.tableFeedback}
                        onChange={() => updatePreferences({ tableFeedback: true })}
                        name="preferenceSound"
                        id="preferenceSound_on"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceSound_on">{t('common.on')}</Pill.Label>
                  </Pill>
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={!state.preferences.tableFeedback}
                        onChange={() => updatePreferences({ tableFeedback: false })}
                        name="preferenceSound"
                        id="preferenceSound_off"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceSound_off">{t('common.off')}</Pill.Label>
                  </Pill>
                </div>
              </fieldset>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">{t('preferences.animations')}</legend>
                <div className="flex flex-wrap gap-3">
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={state.preferences.motionEnabled}
                        onChange={() => updatePreferences({ motionEnabled: true })}
                        name="preferenceMotion"
                        id="preferenceMotion_on"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceMotion_on">{t('common.on')}</Pill.Label>
                  </Pill>
                  <Pill>
                    <Pill.Control>
                      <input
                        type="radio"
                        checked={!state.preferences.motionEnabled}
                        onChange={() => updatePreferences({ motionEnabled: false })}
                        name="preferenceMotion"
                        id="preferenceMotion_off"
                      />
                    </Pill.Control>
                    <Pill.Label htmlFor="preferenceMotion_off">{t('common.off')}</Pill.Label>
                  </Pill>
                </div>
              </fieldset>
              <fieldset className="preference-fieldset | grid gap-3 rounded-2xl border border-border bg-surface-muted p-4">
                <legend className="contents">{t('common.theme')}</legend>
                <div className="flex flex-wrap gap-3">
                  {(['system', 'light', 'dark'] as const).map((option) => {
                    const label =
                      option === 'system'
                        ? t('common.system')
                        : option === 'light'
                          ? t('common.light')
                          : t('common.dark');

                    return (
                      <Pill key={option}>
                        <Pill.Control>
                          <input
                            type="radio"
                            checked={state.preferences.theme === option}
                            onChange={() => updatePreferences({ theme: option })}
                            name="preferenceTheme"
                            id={`preferenceTheme_${option}`}
                          />
                        </Pill.Control>
                        <Pill.Label htmlFor={`preferenceTheme_${option}`}>{label}</Pill.Label>
                      </Pill>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
