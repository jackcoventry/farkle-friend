import Button from "@/components/Button/Button";
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import Link from "next/link";

export default function Home() {
  const title = "FARKLE!".split("");
  return (
    <div className="splash-screen h-dvh flex items-center justify-center bg-gray-800">
      <div className="flex flex-col gap-2 items-center">
        <div
          className="bg-white rounded-full w-[200px] h-[200px] mb-4 p-6 rotate-12 opacity-0 animate-bounce-in"
          style={{
            animationDelay: "1.45s",
          }}
        >
          <div
            className="opacity-0 animate-bounce-in"
            style={{
              animationDelay: "1.65s",
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
          className="opacity-0 animate-bounce-in"
          style={{
            animationDelay: "1.45s",
          }}
        >
          {" "}
          <Link href="/game">
            <Button as="inline" size="large" className="inline-block">
              Start Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
