import Image from 'next/image';

const iconDimension = 256;

export const imageMap = {
  dice: { src: '/dice.svg' },
  rocket: { src: '/rocket.svg' },
  bank: { src: '/bank.svg' },
  cancel: { src: '/cancel.svg' },
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
      height={iconDimension}
      style={{ objectFit: 'contain' }}
      width={iconDimension}
    />
  );
}
