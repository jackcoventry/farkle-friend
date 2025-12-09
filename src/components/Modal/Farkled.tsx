type FarkledProps = {
  children?: React.ReactNode;
};

function Farkled({ children }: Readonly<FarkledProps>) {
  return (
    <div className="animate-bounce-in bg-white w-[500px] p-8 flex flex-col gap-4 text-center rounded-3xl">
      <h2 className="font-heading">You've been farkled!</h2>
      <figure
        className={`w-[200px] h-[200px] mx-auto p-6 flex items-center justify-center font-mega`}
      >
        ❌
      </figure>
      {children}
    </div>
  );
}

export default Farkled;
