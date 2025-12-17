import DiceIcon from "@/components/DiceIcon/DiceIcon";

type RulesInfoRowProps = {
  dice?: number[];
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
    <div className="gap-2 flex flex-col">
      {title ? <h2 className="font-heading-2">{title}</h2> : null}
      {children}
    </div>
  );
}

function RulesInfo() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-center">Game rules</h1>
      <div className="gap-8 md:flex">
        <div className="flex flex-col gap-5 mb-8 md:mb-0">
          <RulesInfoSection title="Singles" />

          <RulesInfoRow dice={[1]} points={100} title="Single 1" />
          <RulesInfoRow dice={[5]} points={50} title="Single 5" />

          <RulesInfoSection title="Three of a kind">
            <p>
              If a three-of-a-kind is rolled, the value is 100 times that value,
              apart from three 1s, which is 1000 times
            </p>
          </RulesInfoSection>
          <RulesInfoRow dice={[1, 1, 1]} points={1000} title="Three 1s" />
          <RulesInfoRow dice={[2, 2, 2]} points={200} title="Three 2s" />
          <RulesInfoRow dice={[3, 3, 3]} points={300} title="Three 3s" />
          <RulesInfoRow dice={[4, 4, 4]} points={400} title="Three 4s" />
          <RulesInfoRow dice={[5, 5, 5]} points={500} title="Three 5s" />
          <RulesInfoRow dice={[6, 6, 6]} points={600} title="Three 6s" />
        </div>
        <div className="flex flex-col gap-5">
          <RulesInfoSection title="Four / five / six of a kind">
            <p>
              Whatever the triple value is, it is doubled for four, tripled for
              five and quadrupled for six.
            </p>
          </RulesInfoSection>
          <RulesInfoRow dice={[4, 4, 4, 4]} points={800} title="Four 4s" />
          <RulesInfoRow dice={[5, 5, 5, 5, 5]} points={1800} title="Five 5s" />
          <RulesInfoRow
            dice={[1, 1, 1, 1, 1, 1]}
            points={4000}
            title="Six 1s"
          />

          <RulesInfoSection title="Straight">
            <p>Using all 6 dice.</p>
          </RulesInfoSection>
          <RulesInfoRow
            dice={[1, 2, 3, 4, 5, 6]}
            points={1500}
            title="Straight"
          />
          <RulesInfoSection title="Three pairs">
            <p>Any distinct pairs, using all six dice.</p>
          </RulesInfoSection>
          <RulesInfoRow
            dice={[2, 2, 5, 5, 6, 6]}
            points={1500}
            title="Three pairs"
          />

          <RulesInfoSection title="Two triples">
            <p>Any distinct triples, using all six dice.</p>
          </RulesInfoSection>
          <RulesInfoRow
            dice={[3, 3, 3, 6, 6, 6]}
            points={2500}
            title="Two triples"
          />
        </div>
      </div>
      <RulesInfoSection title="Combination precedence">
        <p>Some patterns override others:</p>
        <ul className="list-disc list-inside">
          <li>Straight / three pairs / two triples override lower patterns</li>
          <li>
            Six of a kind is handled as a scaled multiple, not two triples!
          </li>
        </ul>
      </RulesInfoSection>
    </div>
  );
}

export default RulesInfo;
