import Image from 'next/image';
import bank from '../../../public/bank.svg';
import cancel from '../../../public/cancel.svg';
import dice from '../../../public/dice.svg';
import rocket from '../../../public/rocket.svg';

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

export function DynamicImage({ alt, className, name }: Readonly<DynamicImageProps>) {
  const src = imageMap[name];
  return (
    <Image
      src={src}
      alt={alt ?? name}
      className={className}
    />
  );
}
