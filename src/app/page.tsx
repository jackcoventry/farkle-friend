import Link from 'next/link';
import Button from '@/components/Button/Button';
import DiceIcon from '@/components/DiceIcon/DiceIcon';

export default function Home() {
  const title = 'FARKLE!'.split('');

  return (
    <div className="splash-screen bg-surface flex h-dvh items-center justify-center">
      <div className="gap-md flex flex-col items-center">
        <div
          className="p-xl animate-fade-in mb-md h-[200px] w-[200px] rotate-12 rounded-full border-4 border-white bg-gray-500 opacity-0"
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
        <h1 className="font-mega text-white">
          {title.map((e, i) => (
            <span
              key={i}
              className="animate-bounce-in opacity-0"
              style={{
                animationDelay: `${i * 0.05 + 1}s`,
              }}
            >
              {e}
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
