import React from "react";

type SplashProps = {
  children?: React.ReactNode;
  image: React.ReactNode;
  title: string;
  subtitle?: string;
  text?: string;
};

function Splash({
  title,
  subtitle,
  text,
  image,
  children,
}: Readonly<SplashProps>) {
  return (
    <div className="animate-bounce-in bg-white w-[500px] p-8 flex flex-col gap-4 text-center rounded-3xl shadow-lg">
      <h2 className="font-heading">{title}</h2>
      {image}
      {subtitle && <p className="font-sub-heading">{subtitle}</p>}
      {text && <p className="font-mega">{text}</p>}
      {children}
    </div>
  );
}

export default Splash;
