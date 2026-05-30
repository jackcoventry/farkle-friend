'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { scoringRuleExamples } from '@/domain/game/scoringRules';
import { DiceIcon } from '@/components/DiceIcon/DiceIcon';
import { Panel } from '@/components/Panel/Panel';
import './RulesInfo.css';

type RulesInfoRowProps = {
  dice?: Array<1 | 2 | 3 | 4 | 5 | 6>;
  points: number;
  title?: string;
};

type RulesInfoSectionProps = {
  title?: string;
  children?: React.ReactNode;
};

function getExampleTitleKey(title?: string) {
  if (!title) return null;
  const specialKeyByTitle = {
    Straight: 'rules.straight',
    'Three pairs': 'rules.threePairs',
    'Two triples': 'rules.twoTriples',
  } as const;
  const specialKey = specialKeyByTitle[title as keyof typeof specialKeyByTitle];
  if (specialKey) return { key: specialKey, values: undefined };

  const match = title.match(/^(Single|Three|Four|Five|Six) (\d)s?$/);
  if (!match) return null;

  const [, count, face] = match;
  const keyByCount = {
    Single: 'rules.example.single',
    Three: 'rules.example.three',
    Four: 'rules.example.four',
    Five: 'rules.example.five',
    Six: 'rules.example.six',
  } as const;

  return {
    key: keyByCount[count as keyof typeof keyByCount],
    values: { face: Number(face) },
  };
}

function RulesInfoRow({ dice = [], points = 0, title }: Readonly<RulesInfoRowProps>) {
  const { t } = useI18n();
  const translatedTitle = getExampleTitleKey(title);

  return (
    <div>
      {title ? (
        <h2 className="font-body-1 mb-xs">
          {translatedTitle ? t(translatedTitle.key, translatedTitle.values) : title}
        </h2>
      ) : null}
      <div className="gap-xs flex items-center">
        {dice.map((die, index) => (
          <span
            className="rules-info__die"
            key={`${die}_${index}`}
          >
            <DiceIcon count={die} />
          </span>
        ))}
        <span>=</span>
        <span>{t('rules.points', { points })}</span>
      </div>
    </div>
  );
}

function RulesInfoSection({ title, children }: Readonly<RulesInfoSectionProps>) {
  return (
    <Panel className="gap-xs flex flex-col">
      {title ? <h2 className="font-heading-2">{title}</h2> : null}
      {children}
    </Panel>
  );
}

export function RulesInfo() {
  const { t } = useI18n();

  return (
    <div className="gap-xl text-text flex flex-col">
      <div className="gap-lg grid md:grid-cols-2">
        <div className="gap-lg flex flex-col">
          <RulesInfoSection title={t('rules.singles')}>
            <p>{t('rules.singlesDetail')}</p>
          </RulesInfoSection>

          {scoringRuleExamples.singles.map((example) => (
            <RulesInfoRow
              key={example.title}
              {...example}
            />
          ))}

          <RulesInfoSection title={t('rules.threeKind')}>
            <p>{t('rules.threeKindDetail')}</p>
          </RulesInfoSection>
          {scoringRuleExamples.triples.map((example) => (
            <RulesInfoRow
              key={example.title}
              {...example}
            />
          ))}
        </div>
        <div className="gap-lg flex flex-col">
          <RulesInfoSection title={t('rules.multiples')}>
            <p>{t('rules.multiplesDetail')}</p>
          </RulesInfoSection>
          {scoringRuleExamples.multiples.map((example) => (
            <RulesInfoRow
              key={example.title}
              {...example}
            />
          ))}

          <RulesInfoSection title={t('rules.straight')}>
            <p>{t('rules.straightDetail')}</p>
          </RulesInfoSection>
          <RulesInfoRow {...scoringRuleExamples.specials[0]} />
          <RulesInfoSection title={t('rules.threePairs')}>
            <p>{t('rules.threePairsDetail')}</p>
          </RulesInfoSection>
          <RulesInfoRow {...scoringRuleExamples.specials[1]} />

          <RulesInfoSection title={t('rules.twoTriples')}>
            <p>{t('rules.twoTriplesDetail')}</p>
          </RulesInfoSection>
          <RulesInfoRow {...scoringRuleExamples.specials[2]} />
        </div>
      </div>
      <RulesInfoSection title={t('rules.combinationPrecedence')}>
        <p>{t('rules.patternsOverride')}</p>
        <ul className="gap-2xs grid list-inside list-disc">
          <li>{t('rules.overrideLowerPatterns')}</li>
          <li>{t('rules.scaledMultiple')}</li>
        </ul>
      </RulesInfoSection>
      <Panel>
        <details className="dice-turn-table__coach-panel">
          <summary className="font-body-1 cursor-pointer">{t('rules.keyboardShortcuts')}</summary>
          <p className="mt-xs">{t('rules.keyboardShortcutsDetail')}</p>
        </details>
      </Panel>
    </div>
  );
}
