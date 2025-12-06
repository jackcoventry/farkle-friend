import Button from "@/components/Button/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="splash-screen h-dvh flex items-center justify-center bg-gray-800">
      <div className="flex flex-col gap-2 items-center">
        <div className="bg-white rounded-full w-[200px] h-[200px] mb-4">
          <img src="/dice.svg" className="h-full" alt="Two illustrated dice" />
        </div>
        <h1 className="font-mega text-sun-800">FARKLE!</h1>
        <Link href="/game">
          <Button as="inline" size="large" className="inline-block">
            Start Game
          </Button>
        </Link>
      </div>
    </div>
  );
}
