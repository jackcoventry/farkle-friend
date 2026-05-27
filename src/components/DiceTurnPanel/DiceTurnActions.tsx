'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { TurnActionCluster } from '@/components/TurnActionCluster/TurnActionCluster';

type DiceTurnActionsProps = {
  actionHintId?: string;
  canBank: boolean;
  canFinish: boolean;
  canRoll: boolean;
  onBank: () => void;
  onFinish: () => void;
  onRoll: () => void;
};

export function DiceTurnActions({
  actionHintId,
  canBank,
  canFinish,
  canRoll,
  onBank,
  onFinish,
  onRoll,
}: Readonly<DiceTurnActionsProps>) {
  const { t } = useI18n();

  return (
    <TurnActionCluster
      actions={[
        {
          ariaDescribedBy: actionHintId,
          ariaLabel: t('actions.rollDice'),
          disabled: !canRoll,
          icon: 'dice',
          label: t('actions.roll'),
          onClick: onRoll,
        },
        {
          ariaDescribedBy: actionHintId,
          ariaLabel: t('actions.bank'),
          disabled: !canBank,
          icon: 'bank',
          label: t('actions.bank'),
          onClick: onBank,
        },
        {
          ariaDescribedBy: actionHintId,
          ariaLabel: t('actions.endTurn'),
          disabled: !canFinish,
          icon: 'rocket',
          label: t('actions.endTurn'),
          onClick: onFinish,
        },
      ]}
    />
  );
}
