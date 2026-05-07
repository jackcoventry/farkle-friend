import React from 'react';

type SplashProps = {
  children?: React.ReactNode;
  className?: string;
  image: React.ReactNode;
  title: string;
  text?: string;
};

function Splash({ title, text, image, children, className = '' }: Readonly<SplashProps>) {
  return (
    <div
      className={`animate-bounce-in bg-surface-raised border border-accent text-text flex max-h-[calc(100dvh-var(--spacing-5))] w-[min(500px,calc(100dvw-var(--spacing-5)))] flex-col gap-md overflow-auto rounded-3xl p-lg text-center shadow-lg sm:p-3xl ${className}`}
    >
      <h2 className="font-heading">{title}</h2>
      {image}
      {text && <p className="font-heading | text-accent">{text}</p>}
      {children}
    </div>
  );
}

export default Splash;
