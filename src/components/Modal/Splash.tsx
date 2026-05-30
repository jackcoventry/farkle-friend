import React from 'react';
import './Splash.css';

type SplashProps = {
  children?: React.ReactNode;
  className?: string;
  image: React.ReactNode;
  title: string;
  text?: string;
};

export function Splash({ title, text, image, children, className = '' }: Readonly<SplashProps>) {
  return (
    <div
      className={`splash-panel | bg-surface-raised text-text gap-md p-lg sm:p-3xl flex flex-col overflow-auto rounded-3xl text-center shadow-lg ${className}`}
    >
      <h2 className="font-heading">{title}</h2>
      {image}
      {text && <p className="font-heading | text-accent">{text}</p>}
      {children}
    </div>
  );
}
