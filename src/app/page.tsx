import Button from "@/components/Button/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="p-10 font-body lg:font-heading text-sun-800 bg-sun-100">
        Welcome to Farkle, Friend!
      </h1>
      <Link href="/game">
        <Button as="inline">Start Game</Button>
      </Link>
    </div>
  );
}
