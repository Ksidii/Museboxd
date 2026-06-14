import Link from "next/link";

export default function ChartsPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="flex flex-col items-center border-2 border-effect/50 bg-black p-12 md:p-20 relative">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-effect"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-effect"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-effect"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-effect"></div>

        <h1 className="font-orbitron font-bold text-[32px] md:text-[48px] text-brand uppercase text-center mb-4 tracking-wider">
          Work in progress
        </h1>
        <p className="font-orbit text-[16px] md:text-[20px] text-text/80 text-center max-w-125 mb-8">
          We are currently working hard to bring you the best music charts. Stay tuned!
        </p>
        
        <Link 
          href="/" 
          className="px-8 py-3 border border-effect text-effect font-orbitron hover:bg-effect hover:text-black transition-colors"
        >
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}