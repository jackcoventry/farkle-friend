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
  return (
    <TurnActionCluster
      actions={[
        {
          ariaDescribedBy: actionHintId,
          ariaLabel: 'Roll dice',
          disabled: !canRoll,
          icon: 'dice',
          label: 'Roll',
          onClick: onRoll,
        },
        {
          ariaDescribedBy: actionHintId,
          disabled: !canBank,
          icon: 'bank',
          label: 'Bank',
          onClick: onBank,
        },
        {
          ariaDescribedBy: actionHintId,
          disabled: !canFinish,
          icon: 'rocket',
          label: 'End turn',
          onClick: onFinish,
        },
      ]}
    />
  );
}
