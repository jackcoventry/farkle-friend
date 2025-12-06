import Button from "@/components/Button/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh flex items-center justify-center bg-sun-100">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="font-mega text-sun-800">FARKLE!</h1>
        <Link href="/game">
          <Button as="inline" className="inline">
            START GAME
          </Button>
        </Link>
      </div>
    </div>
  );
}
