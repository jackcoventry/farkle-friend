import Image from 'next/image';

export const imageMap = {
  dice: { height: 312.184, src: '/dice.svg', width: 292.916 },
  rocket: { height: 2780.48, src: '/rocket.svg', width: 2482.766 },
  bank: { height: 461, src: '/bank.svg', width: 478 },
  cancel: { height: 24, src: '/cancel.svg', width: 24 },
} as const;

export type ImageKey = keyof typeof imageMap;

type DynamicImageProps = {
  alt?: string;
  className?: string;
  name: ImageKey;
};

export function DynamicImage({ alt, className, name }: Readonly<DynamicImageProps>) {
  const image = imageMap[name];
  return (
    <Image
      src={image.src}
      alt={alt ?? name}
      className={className}
      height={image.height}
      width={image.width}
    />
  );
}
