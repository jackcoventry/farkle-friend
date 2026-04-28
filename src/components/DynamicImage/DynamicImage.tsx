import dice from "../../../public/dice.svg";
import rocket from "../../../public/rocket.svg";
import bank from "../../../public/bank.svg";
import cancel from "../../../public/cancel.svg";
import Image from "next/image";

export const imageMap = {
  dice,
  rocket,
  bank,
  cancel,
} as const;

export type ImageKey = keyof typeof imageMap;

type DynamicImageProps = {
  alt?: string;
  className?: string;
  name: ImageKey;
};

export function DynamicImage({
  alt,
  className,
  name,
}: Readonly<DynamicImageProps>) {
  const src = imageMap[name];
  return <Image src={src} alt={alt ?? name} className={className} />;
}
