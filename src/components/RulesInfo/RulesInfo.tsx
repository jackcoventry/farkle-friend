import DiceIcon from "@/components/DiceIcon/DiceIcon";
import { scoringRuleExamples } from "@/domain/game/scoringRules";

type RulesInfoRowProps = {
  dice?: Array<1 | 2 | 3 | 4 | 5 | 6>;
  points: number;
  title?: string;
};

type RulesInfoSectionProps = {
  title?: string;
  children?: React.ReactNode;
};

function RulesInfoRow({
  dice = [],
  points = 0,
  title,
}: Readonly<RulesInfoRowProps>) {
  return (
    <div>
      {title ? <h2 className="font-body-1 mb-2">{title}</h2> : null}
      <div className="flex gap-2 items-center">
        {dice.map((die, index) => (
          <span className="w-[28px] md:w-[50px]" key={index}>
            <DiceIcon count={die} />
          </span>
        ))}
        <span>=</span>
        <span>{points} points</span>
      </div>
    </div>
  );
}

function RulesInfoSection({
  title,
  children,
}: Readonly<RulesInfoSectionProps>) {
  return (
    <section className="gap-2 flex flex-col rounded-lg bg-sun-50 p-4">
      {title ? <h2 className="font-heading-2">{title}</h2> : null}
      {children}
    </section>
  );
}

function RulesInfo() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-center">Rules & scoring</h1>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <RulesInfoSection title="Singles">
            <p>Ones and fives score by themselves.</p>
          </RulesInfoSection>

          {scoringRuleExamples.singles.map((example) => (
            <RulesInfoRow key={example.title} {...example} />
          ))}

          <RulesInfoSection title="Three of a kind">
            <p>
              If a three-of-a-kind is rolled, the value is 100 times that value,
              apart from three 1s, which is 1000 times
            </p>
          </RulesInfoSection>
          {scoringRuleExamples.triples.map((example) => (
            <RulesInfoRow key={example.title} {...example} />
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <RulesInfoSection title="Four / five / six of a kind">
            <p>
              Whatever the triple value is, it is doubled for four, tripled for
              five and quadrupled for six.
            </p>
          </RulesInfoSection>
          {scoringRuleExamples.multiples.map((example) => (
            <RulesInfoRow key={example.title} {...example} />
          ))}

          <RulesInfoSection title="Straight">
            <p>Using all 6 dice.</p>
          </RulesInfoSection>
          <RulesInfoRow {...scoringRuleExamples.specials[0]} />
          <RulesInfoSection title="Three pairs">
            <p>Any distinct pairs, using all six dice.</p>
          </RulesInfoSection>
          <RulesInfoRow {...scoringRuleExamples.specials[1]} />

          <RulesInfoSection title="Two triples">
            <p>Any distinct triples, using all six dice.</p>
          </RulesInfoSection>
          <RulesInfoRow {...scoringRuleExamples.specials[2]} />
        </div>
      </div>
      <RulesInfoSection title="Combination precedence">
        <p>Some patterns override others:</p>
        <ul className="list-disc list-inside grid gap-1">
          <li>Straight / three pairs / two triples override lower patterns</li>
          <li>
            Six of a kind is handled as a scaled multiple, not two triples!
          </li>
        </ul>
      </RulesInfoSection>
      <details className="dice-turn-table__coach-panel bg-white/80 text-sm text-gray-800">
        <summary className="cursor-pointer font-body-1">
          Keyboard shortcuts
        </summary>
        <p className="mt-2">1-6 select dice, R roll, B bank, Enter end.</p>
      </details>
    </div>
  );
}

export default RulesInfo;
