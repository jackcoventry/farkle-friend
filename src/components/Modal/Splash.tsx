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
      className={`animate-bounce-in bg-surface-raised border-accent text-text gap-md p-lg sm:p-3xl flex max-h-[calc(100dvh-var(--spacing-5))] w-[min(500px,calc(100dvw-var(--spacing-5)))] flex-col overflow-auto rounded-3xl border text-center shadow-lg ${className}`}
    >
      <h2 className="font-heading">{title}</h2>
      {image}
      {text && <p className="font-heading | text-accent">{text}</p>}
      {children}
    </div>
  );
}

export default Splash;
