import Link from 'next/link';
import Button from '@/components/Button/Button';
import DiceIcon from '@/components/DiceIcon/DiceIcon';

export function HomeScreen() {
  const title = 'FARKLE!'.split('');

  return (
    <div className="splash-screen bg-surface flex h-dvh items-center justify-center">
      <div className="gap-md flex flex-col items-center">
        <div
          className="p-xl animate-fade-in mb-md bg-surface border-border h-[200px] w-[200px] rotate-12 rounded-full border-4 opacity-0"
          style={{
            animationDelay: '1.45s',
          }}
        >
          <div
            className="animate-bounce-in opacity-0"
            style={{
              animationDelay: '1.65s',
            }}
          >
            <DiceIcon count={6} />
          </div>
        </div>
        <h1 className="font-mega text-text">
          {title.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="animate-bounce-in opacity-0"
              style={{
                animationDelay: `${index * 0.05 + 1}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <div
          className="animate-bounce-in gap-md px-lg flex w-full max-w-[320px] flex-col opacity-0 sm:px-0"
          style={{
            animationDelay: '1.45s',
          }}
        >
          <Link href="/game">
            <Button
              as="inline"
              size="large"
            >
              Start
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
