import dice from "../../../public/dice.svg";
import rocket from "../../../public/rocket.svg";
import bank from "../../../public/bank.svg";

export const imageMap = {
  dice,
  rocket,
  bank,
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
  return <img src={src.src} alt={alt ?? name} className={className} />;
}
